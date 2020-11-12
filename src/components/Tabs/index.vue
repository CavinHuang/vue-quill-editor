<template>
  <div class="at-tabs"
       :class="{
      'at-tabs--small': size === 'small',
      'at-tabs--card': type === 'card',
      'at-tabs--scroll': scrollable
    }">
    <div class="at-tabs__header">
      <div class="at-tabs__extra" v-if="$slots.extra">
        <slot name="extra"></slot>
      </div>
      <div class="at-tabs__nav">
        <!-- S prev btn -->
        <span class="at-tabs__prev" v-if="scrollable" :class="{ 'at-tabs__prev--disabled': !prevable }" @click="scrollPrev">
          <i class="icon icon-chevron-left"></i>
        </span>
        <!-- E prev btn -->
        <!-- S next btn -->
        <span class="at-tabs__next" v-if="scrollable" :class="{ 'at-tabs__next--disabled': !nextable }" @click="scrollNext">
          <i class="icon icon-chevron-right"></i>
        </span>
        <!-- E next btn -->
        <!-- S Tab nav -->
        <div class="at-tabs__nav-wrap">
          <div class="at-tabs__nav-scroll" ref="navScroll">
            <div class="at-tabs-nav" ref="nav" :style="navStyle">
              <div class="at-tabs-nav__item"
                   :class="{
                  'at-tabs-nav__item--active': index === activeIndex,
                  'at-tabs-nav__item--disabled': item.disabled,
                  'at-tabs-nav__item--closable': item.closable
                }"
                   v-for="(item, index) in navList" :key="index"
                   @click="setNavByIndex(index)">
                <!-- S icon -->
                <i v-if="item.icon"
                   class="icon at-tabs-nav__icon"
                   :class="{
                    [item.icon]: item.icon
                  }">
                </i>{{ item.label }}
                <!-- E icon -->
                <!-- S close btn -->
                <span class="at-tabs-nav__close"
                      v-if="item.closable"
                      @click.stop="removeHandle(index)">
                  <i class="icon icon-x"></i>
                </span>
                <!-- E close btn -->
              </div>
            </div>
          </div>
        </div>
        <!-- E Tab nav -->
      </div>
    </div>
    <div class="at-tabs__body" :style="tabsBodyTranslateStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AtTabs',
  props: {
    value: {
      type: String
    },
    type: {
      type: String,
      default: 'line',
      validator: val => ['line', 'card'].indexOf(val) > -1
    },
    size: {
      type: String,
      default: 'default',
      validator: val => ['default', 'small'].indexOf(val) > -1
    },
    closable: {
      type: Boolean,
      default: false
    },
    animated: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      navList: [],
      activeKey: this.value,
      navOffset: 0,
      navStyle: {
        transform: ''
      },
      nextable: false,
      prevable: false
    }
  },
  watch: {
    activeKey () {
      this.$emit('on-change', {
        index: this.activeIndex,
        name: this.activeKey
      })
      this.$nextTick(() => {
        this.scrollToActiveTab()
      })
    }
  },
  computed: {
    scrollable () {
      return this.prevable || this.nextable
    },
    activeIndex () {
      const navList = this.navList
      for (let i = 0, len = navList.length; i < len; i++) {
        const item = navList[i]
        if (item.name === this.activeKey) {
          return i
        }
      }
      return 0
    },
    tabsBodyTranslateStyle () {
      const activeIndex = this.activeIndex
      const translateValue = this.animated ? `${-activeIndex * 100}%` : 0
      return {
        transform: `translate3d(${translateValue}, 0, 0)`
      }
    }
  },
  methods: {
    scrollPrev () {
      if (!this.prevable) return
      const containerWidth = this.$refs.navScroll.offsetWidth
      const currentOffset = this.getCurrentScrollOffset()
      if (currentOffset === 0) return
      const newOffset = currentOffset > containerWidth ? currentOffset - containerWidth : 0
      this.setOffset(newOffset)
    },
    scrollNext () {
      if (!this.nextable) return
      const containerWidth = this.$refs.navScroll.offsetWidth
      const currentOffset = this.getCurrentScrollOffset()
      const navWidth = this.$refs.nav.offsetWidth
      if (navWidth - currentOffset <= containerWidth) return
      const newOffset = (navWidth - currentOffset > containerWidth * 2) ? currentOffset + containerWidth : navWidth - containerWidth
      this.setOffset(newOffset)
    },
    scrollToActiveTab () {
      if (!this.scrollable) return
      const activeTab = this.$el.querySelector('.at-tabs-nav__item--active')
      const navScroll = this.$refs.navScroll
      const activeTabBounds = activeTab.getBoundingClientRect()
      const navScrollBounds = navScroll.getBoundingClientRect()
      const currentOffset = this.getCurrentScrollOffset()
      let newOffset = currentOffset
      if (activeTabBounds.left < navScrollBounds.left) {
        newOffset = currentOffset - (navScrollBounds.left - activeTabBounds.left)
      }
      if (activeTabBounds.right > navScrollBounds.right) {
        newOffset = currentOffset + (activeTabBounds.right - navScrollBounds.right)
      }
      this.setOffset(newOffset)
    },
    getCurrentScrollOffset () {
      return this.navOffset
    },
    setOffset (value) {
      this.navOffset = Math.abs(value)
      this.navStyle.transform = `translate3d(-${this.navOffset}px, 0, 0)`
    },
    getTabs () {
      return this.$children.filter(item =>
        item.$options.name === 'AtTabPane'
      )
    },
    removeHandle (index) {
      const tabs = this.getTabs()
      const tab = tabs[index]
      let activeKey = ''
      if (tab.disabled) return
      this.navList.splice(index, 1)
      this.$emit('on-tab-remove', {
        index,
        name: tab.currentName
      })
      this.$nextTick(() => {
        this.updateNav()
      })
      if (tab.currentName === this.activeKey) {
        const newTabs = this.getTabs()
        if (newTabs.length) {
          const nextAbleTabs = tabs.filter((item, itemIndex) =>
            !item.disabled && itemIndex > index
          )
          const prevAbleTabs = tabs.filter((item, itemIndex) =>
            !item.disabled && itemIndex < index
          )
          if (nextAbleTabs.length) {
            activeKey = nextAbleTabs[0].currentName
          } else if (prevAbleTabs.length) {
            activeKey = prevAbleTabs[prevAbleTabs.length - 1].currentName
          } else {
            activeKey = newTabs[0].currentName
          }
        }
        this.activeKey = activeKey
      }
    },
    updateNav () {
      this.navList = []
      this.getTabs().forEach((item, index) => {
        this.navList.push({
          label: item.label,
          name: item.currentName || index,
          disabled: item.disabled,
          icon: item.icon,
          closable: item.isClosable
        })
        if (!item.currentName) {
          item.currentName = index
        }
        if (index === 0 && !this.activeKey) {
          this.activeKey = item.currentName || index
        }
        if (!this.animated) {
          this.switchTabsWithNoAnimated()
        }
      })
    },
    setNavByIndex (index) {
      const currentName = this.navList[index]
      if (!currentName.disabled) {
        this.activeKey = currentName.name
        if (!this.animated) {
          this.switchTabsWithNoAnimated()
        }
      }
    },
    switchTabsWithNoAnimated () {
      const tabs = this.getTabs()
      tabs.forEach(item => {
        item.show = (item.currentName === this.activeKey)
      })
    },
    updateHandle () {
      const navWidth = this.$refs.nav.offsetWidth
      const containerWidth = this.$refs.navScroll.offsetWidth
      const currentOffset = this.getCurrentScrollOffset()
      if (containerWidth < navWidth) {
        this.prevable = currentOffset !== 0
        this.nextable = currentOffset + containerWidth < navWidth
        if (navWidth - currentOffset < containerWidth) {
          this.setOffset(navWidth - containerWidth)
        }
      } else {
        this.nextable = false
        this.prevable = false
        if (currentOffset > 0) {
          this.setOffset(0)
        }
      }
    }
  },
  mounted () {
    window.addEventListener('resize', this.updateHandle, false)
    this.updateNav()
    setTimeout(() => {
      this.scrollToActiveTab()
    }, 0)
  },
  updated () {
    this.updateHandle()
  }
}
</script>
<style lang="scss">
@import "../var";
.at-tabs {
  overflow: hidden;

  /* element */
  &__header {
    margin-bottom: 16px;
    font-size: 0;
    border-bottom: 1px solid $tabs-border-color;
  }
  &__nav {
    position: relative;
    margin-bottom: -1px;
    height: $tabs-nav-height;
    color: $tabs-navigation-color;
    font-size: $tabs-nav-font-size;
    overflow: hidden;
  }
  &__nav-wrap {
    overflow: hidden;
  }
  &__prev, &__next {
    position: absolute;
    top: 0;
    width: $tabs-navigation-btn-width;
    height: 100%;
    transition: color .3s;
    cursor: pointer;

    &:hover {
      color: $tabs-navigation-color-hover;;
    }

    &--disabled {
      color: $tabs-navigation-color-disabled;
      cursor: default;

      &:hover {
        color: $tabs-navigation-color-disabled;
      }
    }

    .icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%)
    }
  }
  &__prev {
    left: 0;
  }
  &__next {
    right: 0;
  }
  &__body {
    white-space: nowrap;
    transition: all .3s;
  }
  &__extra {
    float: right;
    margin-top: 6px;
  }
  &__pane {
    display: inline-block;
    width: 100%;
    white-space: initial;
    vertical-align: top;
  }

  /* modifier */
  &--small {
    .at-tabs__header {
      margin-bottom: 12px;
    }
    .at-tabs__nav {
      height: $tabs-nav-height-sm;
    }
    .at-tabs-nav__item {
      margin-right: 16px;
      padding: $tabs-nav-item-padding-sm;
      line-height: $tabs-nav-height-sm;
      font-size: $tabs-nav-font-size-sm;
    }
    .at-tabs__extra {
      margin-top: 3px;
    }
  }
  &--card {
    &.at-tabs--small {
      .at-tabs-nav__item {
        line-height: $tabs-nav-height-sm - 2;
      }
    }

    .at-tabs-nav__item {
      margin: 0 2px 0 0;
      line-height: $tabs-nav-height - 2;
      border: 1px solid $tabs-border-color;
      border-radius: 4px 4px 0 0;
      background-color: $tabs-nav-item-bg-color-card;
      transition: background-color .3s;

      &::after {
        content: normal
      }

      &--active {
        border-bottom-color: transparent;
        background-color: $tabs-nav-item-bg-color;
      }
    }
  }
  &--scroll {
    .at-tabs__nav {
      padding: 0 $tabs-navigation-btn-width;
    }
  }
}

.at-tabs-nav {
  display: inline-block;
  white-space: nowrap;
  transition: transform .3s;

  /* element */
  &__icon {
    margin-right: 8px;
  }
  &__close {
    position: absolute;
    margin-left: 2px;
    color: $tabs-nav-item-icon-color;
    opacity: 0;
    transition: all .3s;

    &:hover {
      color: $tabs-nav-item-icon-color-hover;
    }
  }
  &__item {
    position: relative;
    display: inline-block;
    margin-right: 24px;
    padding: $tabs-nav-item-padding;
    line-height: $tabs-nav-height;
    transition: color .3s;
    cursor: pointer;

    &:last-of-type {
      margin-right: 0;
    }
    &::after {
      content: '';
      position: absolute;
      left: 0;
      width: 100%;
      height: 2px;
      bottom: 0;
      background-color: $menu-item-text-color-active;
      transform: scaleX(0);
      transition: all .15s;
    }
    &:not(&--disabled):hover {
      color: $menu-item-text-color-active;
    }

    &--active {
      color: $menu-item-text-color-active;

      &::after {
        transform: scaleX(1)
      }
    }
    &--disabled {
      color: $tabs-navigation-color-disabled;
      cursor: default;
    }
    &--closable {
      &:hover {
        .at-tabs-nav__close {
          opacity: 1;
        }
      }
    }
  }
}
</style>
