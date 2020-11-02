<template>
  <div class="at-radio-group">
    <slot></slot>
  </div>
</template>

<script>
import Emitter from '@/mixins/emitter'
export default {
  name: 'AtRadioGroup',
  props: {
    value: [String, Number],
    size: String,
    fill: String,
    textColor: String
  },
  mixins: [Emitter],
  watch: {
    value (value) {
      this.$emit('radio-group-change', value)
      this.broadcast('AtRadio', 'init-data', value)
    }
  },
  mounted () {
    this.broadcast('AtRadio', 'init-data', this.value)
  }
}
</script>
<style lang="scss">
.at-radio-group {
  display: inline-block;
  font-size: 0;
  line-height: 1;
  border-collapse: separate;
}
</style>
