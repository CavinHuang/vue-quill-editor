<template>
  <div
    class="at-message__wrapper"
    :style="{
      top: top ? `${top}px` : 'auto'
    }">
    <transition name="move-up" @after-leave="doDestory">
      <div
        class="at-message"
        :class="{
          [`at-message--${type}`]: type
        }"
        v-show="visible">
        <i class="icon at-message__icon" :class="iconClass"></i>
        <span class="at-message__content">{{ message }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data () {
    return {
      message: '',
      duration: 3000,
      type: 'info',
      icon: '',
      visible: false,
      timer: null,
      closed: false,
      onClose: null,
      top: null
    }
  },
  computed: {
    iconClass () {
      const classArr = {
        success: 'icon-check-circle',
        error: 'icon-x-circle',
        warning: 'icon-alert-circle',
        info: 'icon-info',
        loading: 'icon-loader'
      }
      return this.icon || classArr[this.type]
    }
  },
  watch: {
    closed (val) {
      if (val) {
        this.visible = false
      }
    }
  },
  methods: {
    doDestory () {
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },
    close () {
      this.closed = true
      if (typeof this.onClose === 'function') {
        this.onClose(this)
      }
    },
    startTimer () {
      if (this.duration) {
        this.timer = setTimeout(() => {
          !this.closed && this.close()
        }, this.duration)
      }
    },
    clearTimer () {
      this.timer && clearTimeout(this.timer)
    }
  },
  mounted () {
    this.startTimer()
  }
}
</script>

<style lang="scss">
@import "../var";
.at-message {
  display: inline-block;
  padding: $message-padding;
  font-size: $message-font-size;
  line-height: 1.5;
  border-radius: $border-radius-base;
  background-color: $message-bg-color;
  box-shadow: $message-box-shadow;
  z-index: $zindex-message;

  /* element */
  &__wrapper {
    position: fixed;
    left: 0;
    top: 16px;
    width: 100%;
    text-align: center;
    transition: opacity .3s, transform .3s, top .4s;
    pointer-events: none;
  }
  &__icon {
    display: inline-block;
    margin-right: 4px;
    vertical-align: middle;
  }

  /* modifier */
  &--success .at-message__icon {
    color: $message-icon-color-success;
  }
  &--error .at-message__icon {
    color: $message-icon-color-error;
  }
  &--warning .at-message__icon {
    color: $message-icon-color-warning;
  }
  &--info .at-message__icon {
    color: $message-icon-color-info;
  }
  &--loading .at-message__icon {
    color: $message-icon-color-loading;
    animation: icon-loading 2s linear infinite both;
  }
}
</style>
