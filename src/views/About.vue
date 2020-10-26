<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="toggleModal">打开Modal对话框</button>
    <Modal v-show="showModal" v-on:close="closeme"></Modal>
  </div>
</template>

<script>
import Modal from '@/components/Modal'
export default {
  name: 'About',
  data () {
    return {
      showModal: false
    }
  },
  components: {
    Modal
  },
  methods: {
    toggleModal () {
      this.showModal = !this.showModal
    },
    closeme () {
      this.showModal = !this.showModal
    }
  }
}
</script>
