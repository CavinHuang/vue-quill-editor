<template>
  <label class="at-radio">
    <span class="at-radio__input">
      <span
        class="at-radio__inner"
        :class="{
          'at-radio--focus': focus,
          'at-radio--checked': store === label,
          'at-radio--disabled': disabled
        }"></span>
      <input
        type="radio"
        class="at-radio__original"
        v-model="store"
        :name="name"
        :value="label"
        :disabled="disabled"
        @focus="focus = true"
        @blur="focus = false">
    </span>
    <span class="at-radio__label">
      <slot></slot>
    </span>
  </label>
</template>

<script>
import Emitter from '@/mixins/emitter'

export default {
  name: 'AtRadio',
  props: {
    value: [String, Number],
    name: String,
    label: {
      type: [String, Number],
      required: true
    },
    disabled: Boolean
  },
  mixins: [Emitter],
  data () {
    return {
      store: this.value,
      focus: false,
      isGroup: false
    }
  },
  watch: {
    store (store) {
      this.$emit('input', store)
      if (this.isGroup) {
        this.dispatch('AtRadioGroup', 'input', store)
      }
    },
    value (val) {
      this.store = val
    }
  },
  mounted () {
    this.$on('init-data', data => {
      this.store = data
      this.isGroup = true
    })
  }
}
</script>
<style lang="scss">
  /**
   * Mixes a color with white. It's different from lighten()
   *
   * @param {color} $color
   * @param {number (percentage)} $percent [The amout of white to be mixed in]
   * @return {color}
   *
   * @example
   *   .element {
   *     background-color: tint(#6ecaa6 , 40%);
   *   }
   *
   *   // CSS Output
   *   .element {
   *     background-color: #a8dfc9;
   *   }
   */

  @function tint(
    $color,
    $percent
  ) {
    @return mix(#FFF, $color, $percent);
  }
/**
 * Radio Style
 */
$text-color                 : #3F536E;
$color-white                : #FFF;
$color-primary              : #6190E8;

$font-size-smer             : 12px;

$brand-blue-400             : #79A1EB;

$grey-100                   : #ECECEC;
$grey-50                    : #F7F7F7;
$grey-300                   : #D2D2D2;
$border-color-base          : #C5D9E8;

$border-color-lighter       : tint($border-color-base, 50%);
$border-color-lightest      : tint($border-color-base, 80%);

/* Radio */
$radio-size                 : 16px;
$radio-dot-size             : 8px;
$radio-font-size            : $font-size-smer;

$radio-border-c-hover       : $brand-blue-400;
$radio-border-c-checked     : $brand-blue-400;
$radio-border-c-disabled    : $grey-100;
$radio-bg-c-disabled        : $grey-50;
$radio-dot-c-disabled       : $grey-300;

$cursor-disabled            : not-allowed;

$border-radius-base         : 4px;
$border-radius-sm           : 4px;

$btn-padding-smer           : 2px 10px;
$btn-padding-sm             : 4px 12px;
$btn-font-size-sm           : 11px;
$btn-padding-base           : 6px 16px;
$btn-font-size-base         : 12px;
$btn-padding-md             : 8px 16px;
$btn-font-size-md           : 14px;
$btn-default-color          : $text-color;
$btn-default-bg             : $color-white;
$btn-default-bg-hover       : $border-color-lightest;
$btn-default-bg-active      : $border-color-lighter;
$btn-default-border         : $border-color-base;
$btn-disabled-color         : $grey-300;
$btn-disabled-bg            : $grey-50;

@mixin button-size($padding, $font-size) {
  padding: $padding;
  font-size: $font-size;
}

/**
 * AtRadio
 */
.at-radio {
  position: relative;
  display: inline-block;
  color: $text-color;
  font-size: 0;
  white-space: nowrap;
  user-select: none;
  cursor: pointer;

  + .at-radio {
    margin-left: 16px;
  }

  /* modifier */
  &--checked {
    .at-radio-button__inner {
      color: $color-white;
      border-color: $color-primary;
      background-color: $color-primary;
    }
  }

  /* element */
  &__input {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
  }
  &__inner {
    position: relative;
    display: inline-block;
    width: $radio-size;
    height: $radio-size;
    border: 1px solid $border-color-base;
    border-radius: 50%;
    background-color: $color-white;
    transition: border .2s;
    cursor: pointer;

    &:not(.at-radio--disabled):hover {
      border-color: $radio-border-c-hover;
    }
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: $radio-dot-size;
      height: $radio-dot-size;
      border-radius: 50%;
      background-color: $radio-border-c-hover;
      transform: translate(-50%, -50%) scale(0);
      transition: transform .2s;
    }
    &.at-radio--checked {
      border-color: $radio-border-c-checked;

      &::after {
        transform: translate(-50%, -50%) scale(1);
      }
    }
    &.at-radio--disabled {
      border-color: $radio-border-c-disabled;
      background-color: $radio-bg-c-disabled;
      cursor: $cursor-disabled;

      &.at-radio--checked::after {
        background-color: $radio-dot-c-disabled;
      }
    }
  }
  &__original {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: 0;
    opacity: 0;
    outline: none;
    z-index: -1;
  }
  &__label {
    font-size: $radio-font-size;
    padding-left: 8px;
    vertical-align: middle;
  }
}

/**
 * AtRadioButton
 */
.at-radio-button {
  position: relative;
  display: inline-block;
  overflow: hidden;

  &:not(:last-child) {
    margin-right: -1px;
    border-collapse: separate;
  }
  &:first-child {
    .at-radio-button__inner {
      border-radius: $border-radius-base 0 0 $border-radius-base;
    }
  }
  &:last-child {
    .at-radio-button__inner {
      border-radius: 0 $border-radius-base $border-radius-base 0;
    }
  }

  /* modifier */
  &--small {
    .at-radio-button__inner {
      @include button-size($btn-padding-sm, $btn-font-size-sm);
    }
  }
  &--normal {
    .at-radio-button__inner {
      @include button-size($btn-padding-base, $btn-font-size-base);
    }
  }
  &--large {
    .at-radio-button__inner {
      @include button-size($btn-padding-md, $btn-font-size-md);
    }
  }

  /* element */
  &__inner {
    position: relative;
    display: inline-block;
    margin: 0;
    color: $text-color;
    white-space: nowrap;
    text-align: center;
    vertical-align: middle;
    line-height: 1.5;
    border: 1px solid $btn-default-border;
    background: $btn-default-bg;
    transition: all .2s;
    outline: none;
    user-select: none;
    cursor: pointer;
    @include button-size($btn-padding-base, $btn-font-size-base);
  }
  &__original {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0;
    outline: none;
    z-index: -1;

    &:disabled {
      & + .at-radio-button__inner {
        color: $btn-disabled-color;
        background-color: $btn-disabled-bg;
        border-color: $btn-default-border;
        cursor: $cursor-disabled;
      }
    }
  }
}
</style>
