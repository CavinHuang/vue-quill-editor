<template>
  <div>
    <Popover trigger="click">
      这是一些内容
    </Popover>
    <ToolTip>
      这是一些内容
    </ToolTip>
  </div>
</template>

<script>
import Popover from '@/components/Popover'
import ToolTip from '@/components/ToolTip'
export default {
  name: 'About',
  components: {
    Popover,
    ToolTip
  }
}
</script>
