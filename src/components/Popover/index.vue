
<script>
import { on, off } from '@/utils/utils'
import { getPopoverPosition } from '@/utils/vuePopper'
import classNames from 'classnames'
export default {
  name: 'ccPopover',
  props: {
    // 事件类型用户自己传
    trigger: {
      type: String,
      default: 'hover',
      validator: value => ['click', 'hover'].indexOf(value) > -1
    },
    placement: {
      type: String,
      default: 'bottom-middle',
      validator (value) {
        const dator = /^(top|bottom|left|right)(-start|-end|-middle)?$/g.test(value)
        return dator
      }
    },
    mouseEnterDelay: {
      type: Number,
      default: 0
    },
    containerCls: {
      type: [String, Array],
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    hideDestroyElement: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      time: '',
      top: 0,
      left: 0,
      init: false,
      show: false,
      options: {
        direction: ''
      },
      enterTimer: null
    }
  },
  computed: {
    contentCls () {
      if (Array.isArray(this.containerCls)) return [this.options.direction, ...this.containerCls]
      return [this.options.direction, this.containerCls]
    }
  },
  methods: {
    handlClick () {
      // 为了兼容v-if
      // 为了兼容滚动消除
      this.init = true
      // console.log(this.$refs.content)
      if (this.$refs.content && this.$refs.content.style.display === 'none') {
        // 有bug, 必须这样强制写
        this.$refs.content.style.display = 'block'
        this.show = true
      } else {
        this.show = !this.show
      }
      // 不要监听body, 因为可能height不是100%
      // 这个document也可以有用户指定
      // 放入的是同名函数, 没问题的
      this.show && document.addEventListener('click', this.close)
    },
    close (e) {
      if (this.isPopover(e)) {
        this.show = false
        document.removeEventListener('click', this.close)
      }
    },
    isPopover (e) {
      const dom = e.target
      const popover = this.$refs.popover
      const content = this.$refs.content
      return !(popover.contains(dom) || content.contains(dom))
    },
    // 移入
    handleMouseEnter () {
      clearTimeout(this.time)
      this.init = true
      this.show = true
    },
    // 移出
    handleMouseLeave () {
      clearTimeout(this.time)
      this.time = setTimeout(() => {
        this.show = false
      }, 200)
    }
  },
  watch: {
    init () {
      this.$nextTick(() => {
        const trigger = this.trigger
        const content = this.$refs.content
        document.body.appendChild(content)
        if (trigger === 'hover') {
          on(content, 'mouseenter', this.handleMouseEnter)
          on(content, 'mouseleave', this.handleMouseLeave)
        }
      })
    },
    visible: {
      handler: function (value) {
        this.show = value
      },
      immediate: true
    },
    show (val) {
      if (this.show) {
        this.$nextTick(() => {
          const { popover, content } = this.$refs
          const { left, top, options } = getPopoverPosition(
            popover,
            content,
            this.placement
          )
          this.left = left
          this.top = top
          this.options = options
        })
      }
      this.$emit('visibleChange', val)
    }
  },
  mounted () {
    this.$nextTick(() => {
      const trigger = this.trigger
      const popover = this.$refs.popover
      if (trigger === 'hover') {
        this.enterTimer = setTimeout(() => {
          on(popover, 'mouseenter', this.handleMouseEnter)
        }, this.mouseEnterDelay)
        on(popover, 'mouseleave', this.handleMouseLeave)
      } else if (trigger === 'click') {
        on(popover, 'click', this.handlClick)
      }
    })
  },
  beforeDestroy () {
    const { popover, content } = this.$refs
    off(content, 'mouseleave', this.handleMouseLeave)
    off(popover, 'mouseleave', this.handleMouseLeave)
    off(content, 'mouseenter', this.handleMouseEnter)
    off(popover, 'mouseenter', this.handleMouseEnter)
    off(document, 'click', this.close)
    if (document.body.contains(content)) {
      document.body.removeChild(content)
    }
  },
  render () {
    const wrapCls = classNames(['cc-popover__content', this.contentCls])
    const ele = this.init ? (
      <div ref='content' class={wrapCls} style=
        {{
          top: this.top + 'px',
          left: this.left + 'px',
          display: this.show ? 'block' : 'none'
        }}
      >
        <div class='cc-popover__box'>
          {this.$slots.content}
        </div>
      </div>
    ) : ''
    return (<div class='cc-popover' ref='popover'>
      <transition name='fade'>
        {ele}
      </transition>
      {this.$slots.default}
    </div>)
  }
}
</script>

<style lang="scss">
@import "../var";
@include b(popover) {
  position: relative;
  display: inline-block;
  @include e(box) {
    overflow: auto;
  }
  @include e(content) {
    position: absolute;
    color: $--color-weak;
    background-color: white;
    box-shadow: 0px 0px 3px rgb(172, 171, 171);
    top: 100px;
    left: 100px;
    padding: 6px;
    @at-root {
      .top-end {
        @include triangleAfter(top){
          right:5px;
        };
        @include triangleBefore(top){
          right:5px;
        };
      }
      .top-middle {
        @include triangleAfter(top){
          left: calc(50% - 6px);
        };
        @include triangleBefore(top){
          left: calc(50% - 6px);
        };
      }
      .top-start {
        @include triangleAfter(top){
          left: 5px
        };
        @include triangleBefore(top){
          left: 5px
        };
      }

      .bottom-end {
        @include triangleAfter(bottom){
          right:5px;
        };
        @include triangleBefore(bottom){
          right:5px;
        };
      }
      .bottom-middle {
        @include triangleAfter(bottom){
          left: calc(50% - 6px);
        };
        @include triangleBefore(bottom){
          left: calc(50% - 6px);
        };
      }
      .bottom-start {
        @include triangleAfter(bottom){
          left: 5px
        };
        @include triangleBefore(bottom){
          left: 5px
        };
      }
      .right-end {
        @include triangleAfter(right){
          bottom: 5px;
        };
        @include triangleBefore(right){
          bottom: 5px;
        };
      }
      .right-middle {
        @include triangleAfter(right){
          top: calc(50% - 6px);
        };
        @include triangleBefore(right){
          top: calc(50% - 6px);
        };
      }
      .right-start {
        @include triangleAfter(right){
          top: 5px
        };
        @include triangleBefore(right){
          top: 5px
        };
      }
      .left-end {
        @include triangleAfter(left){
          bottom: 5px;
        };
        @include triangleBefore(left){
          bottom: 5px;
        };
      }
      .left-middle {
        @include triangleAfter(left){
          top: calc(50% - 6px);
        };
        @include triangleBefore(left){
          top: calc(50% - 6px);
        };
      }
      .left-start {
        @include triangleAfter(left){
          top: 5px
        };
        @include triangleBefore(left){
          top: 5px
        };
      }
    }
  }
}
</style>
