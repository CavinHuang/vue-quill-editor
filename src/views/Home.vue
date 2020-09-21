<template>
  <div class="home">
    <rich-text
      v-model="content"
      placeholder="请输入内容"
      :supportFontTag="true"
    />

  </div>
</template>

<script>
// @ is an alias to /src
import RichText from '@/components/VEditor/src/editor.vue'
export default {
  name: 'Home',
  components: {
    RichText
  },
  data () {
    return {
      content: ''
    }
  }
}
</script>
