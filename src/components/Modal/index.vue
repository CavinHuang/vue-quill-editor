<template>
<transition name="fade">
  <div class="modal-root" v-show="show">
    <div class="modal-mask"></div>
    <div class="modal-wrap">
      <div role="document" class="modal" style="width: 520px; transform-origin: 420.8px -65px;">
        <div style="width: 0px; height: 0px; overflow: hidden;"></div>
        <div class="modal-content">
          <button type="button" class="modal-close" @click="closeSelf()">
            <span class="modal-close-x">
              <i class="anticon anticon-close modal-close-icon">
                <svg viewBox="64 64 896 896" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="">
                  <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                </svg>
              </i>
            </span>
          </button>
          <div class="modal-header">
            <div class="modal-title">{{title}}</div>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <div>
              <button type="button" class="btn" @click="closeSelf"><span>{{cancelText}}</span></button>
              <button type="button" class="btn btn-primary" @click="confirm"><span>{{confirmText}}</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>
<script>
export default {
  name: 'Modal',
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    cancelText: {
      type: String,
      default: '关闭'
    },
    confirmText: {
      type: String,
      default: '确定'
    }
  },
  data () {
    return {
      show: false,
      init: false
    }
  },
  watch: {
    visible: {
      handler: function (val) {
        this.show = val
      },
      immediate: true
    },
    show (val) {
      if (val && !this.init) {
        this.$nextTick(() => {
          const body = document.querySelector('body')
          if (body.append) {
            body.append(this.$el)
          } else {
            body.appendChild(this.$el)
          }
        })
        this.init = true
      }
      this.$emit('visibleChange', val)
    }
  },
  methods: {
    closeSelf () {
      this.show = false
      this.$emit('cancel')
    },
    confirm () {
      this.show = false
      this.$emit('ok')
    }
  }
}
</script>

<style lang="scss">
.modal-root {
  .modal-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.45);
    filter: alpha(opacity=50);
  }
  .modal-wrap {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    overflow: auto;
    outline: 0;
    -webkit-overflow-scrolling: touch;
  }
  .modal {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: 'tnum';
    position: relative;
    top: 100px;
    width: auto;
    margin: 0 auto;
    padding-bottom: 24px;
    pointer-events: none;
  }
  .modal-content {
    position: relative;
    background-color: #fff;
    background-clip: padding-box;
    border: 0;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    pointer-events: auto;
  }
  .modal-close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    padding: 0;
    color: rgba(0, 0, 0, 0.45);
    font-weight: 700;
    line-height: 1;
    text-decoration: none;
    background: transparent;
    border: 0;
    outline: 0;
    cursor: pointer;
    transition: color 0.3s;
  }
  .modal-close-x {
    display: block;
    width: 56px;
    height: 56px;
    font-size: 16px;
    font-style: normal;
    line-height: 56px;
    text-align: center;
    text-transform: none;
    text-rendering: auto;
  }
  .anticon {
    display: inline-block;
    color: inherit;
    font-style: normal;
    line-height: 0;
    text-align: center;
    text-transform: none;
    vertical-align: -0.125em;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    & svg {
      display: inline-block;
    }
    & > * {
      line-height: 1;
    }
  }
  svg:not(:root) {
    overflow: hidden;
  }
  svg:not(:root) {
    overflow: hidden;
  }
  .modal-header {
    padding: 16px 24px;
    color: rgba(0, 0, 0, 0.65);
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    border-radius: 4px 4px 0 0;
  }
  .modal-title {
    margin: 0;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    word-wrap: break-word;
  }
  .modal-body {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
  }
  .modal-footer {
    padding: 10px 16px;
    text-align: right;
    background: transparent;
    border-top: 1px solid #e8e8e8;
    border-radius: 0 0 4px 4px;
    & button + button {
      margin-bottom: 0;
      margin-left: 8px;
    }
  }
  .btn {
    line-height: 1.499;
    position: relative;
    display: inline-block;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    background-image: none;
    border: 1px solid transparent;
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    touch-action: manipulation;
    height: 32px;
    padding: 0 15px;
    font-size: 14px;
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.65);
    background-color: #fff;
    border-color: #d9d9d9;
    &::before {
      position: absolute;
      top: -1px;
      right: -1px;
      bottom: -1px;
      left: -1px;
      z-index: 1;
      display: none;
      background: #fff;
      border-radius: inherit;
      opacity: 0.35;
      transition: opacity 0.2s;
      content: '';
      pointer-events: none;
    }
  }
  .btn, .btn:active, .btn:focus {
    outline: 0;
  }
  .btn > i, .btn > span {
    display: inline-block;
    transition: margin-left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    pointer-events: none;
  }
  .btn-primary {
    color: #fff;
    background-color: #1890ff;
    border-color: #1890ff;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
  }
}
</style>
