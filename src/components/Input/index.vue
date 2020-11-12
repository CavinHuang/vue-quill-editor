<script>
export default {
  name: 'QuillInput',
  props: {
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      values: ''
    }
  },
  watch: {
    value: {
      handler (value) {
        this.values = value
      },
      immediate: true
    }
  },
  computed: {},
  methods: {
    changeHandle (e) {
      console.log(this)
      this.values = e.target.value
      this.$emit('change', e)
      e.stopPropagation()
      e.preventDefault()
      return false
    }
  },
  render () {
    const { placeholder, type, changeHandle, values } = this
    const suffix = this.$attrs.suffix ? this.$attrs.suffix : (this.$slots.suffix ? this.$slots.suffix : '')
    return suffix ? <span class="quill-input-affix-wrapper">
      <input placeholder={placeholder} type={type} value={values} class="quill-input" onInput={changeHandle} />
      <span class="quill-input-suffix">
        {suffix}
      </span>
    </span>
      : <input placeholder={placeholder} type={type} value={values} class="quill-input" onInput={changeHandle} />
  }
}
</script>
