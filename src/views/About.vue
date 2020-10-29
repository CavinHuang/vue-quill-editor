<template>
  <div>
    <Popover trigger="click">
      这是一些内容
    </Popover>
    <ToolTip>
      这是一些内容
    </ToolTip>
    <button @click="modalVisible = !modalVisible">关闭打开</button>
    <Modal :visible="modalVisible" @visibleChange="(val) => modalVisible = val"></Modal>
  </div>
</template>

<script>
import Popover from '@/components/Popover'
import ToolTip from '@/components/ToolTip'
import Modal from '@/components/Modal'
export default {
  name: 'About',
  components: {
    Popover,
    ToolTip,
    Modal
  },
  data () {
    return {
      modalVisible: false
    }
  }
}
</script>
