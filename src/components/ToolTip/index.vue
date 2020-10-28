<template>
  <Popover container-cls="cc-tooltip">
    <div slot="content">
      {{title}}
    </div>
    <slot></slot>
  </Popover>
</template>

<script>
import Popover from '../Popover'
export default {
  name: 'ToolTip',
  components: {
    Popover
  },
  props: {
    trigger: {
      type: String,
      default: 'hover'
    },
    title: {
      type: [String, Number],
      default: ''
    },
    mouseEnterDelay: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss">
@import "../var";
@include b('tooltip') {
  background: $--tool-tip-bgcolor;
  color: #fff;
  border-radius: 4px;
  & .top-end {
    @include triangleAfter(top){
      right:5px;
    };
    @include triangleBefore(top){
      right:5px;
      bottom: -11px;
    };
  }
  & .top-middle {
    @include triangleAfter(top){
      left: calc(50% - 6px);
    };
    @include triangleBefore(top){
      left: calc(50% - 6px);
      bottom: -11px;
    };
  }
  & .top-start {
    @include triangleAfter(top){
      left: 5px
    };
    @include triangleBefore(top){
      left: 5px;
      bottom: -11px;
    };
  }

  &.bottom-end {
    @include triangleAfter(bottom){
      right:5px;
    };
    @include triangleBefore(bottom){
      right:5px;
      top: -11px;
    };
  }
  &.bottom-middle {
    @include triangleAfter(bottom){
      border-bottom-color: $--tool-tip-border-color;
    };
    @include triangleBefore(bottom){
      left: calc(50% - 6px);
      top: -11px;
    };
  }
  .bottom-start {
    @include triangleAfter(bottom){
      left: 5px
    };
    @include triangleBefore(bottom){
      left: 5px;
      top: -11px;
    };
  }

  .right-end {
    @include triangleAfter(right){
      bottom: 5px;
    };
    @include triangleBefore(right){
      bottom: 5px;
      left:-11px;
    };
  }
  .right-middle {
    @include triangleAfter(right){
      top: calc(50% - 6px);
    };
    @include triangleBefore(right){
      top: calc(50% - 6px);
      left:-11px;
    };
  }
  .right-start {
    @include triangleAfter(right){
      top: 5px
    };
    @include triangleBefore(right){
      top: 5px;
      left:-11px;
    };
  }

  .left-end {
    @include triangleAfter(left){
      bottom: 5px;
    };
    @include triangleBefore(left){
      bottom: 5px;
      right:-11px;
    };
  }
  .left-middle {
    @include triangleAfter(left){
      top: calc(50% - 6px);
    };
    @include triangleBefore(left){
      top: calc(50% - 6px);
      right:-11px;
    };
  }
  .left-start {
    @include triangleAfter(left){
      top: 5px;
    };
    @include triangleBefore(left){
      top: 5px;
      right:-11px;
    };
  }
}
</style>
