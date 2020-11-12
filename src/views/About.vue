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

    <at-tabs>
      <at-tab-pane label="Tab1" name="name1">
        <p>Content of Tab Pane 1</p>
      </at-tab-pane>
      <at-tab-pane label="Tab2" name="name2">
        <p>Content of Tab Pane 2</p>
      </at-tab-pane>
      <at-tab-pane label="Tab3" name="name3">
        <p>Content of Tab Pane 3</p>
      </at-tab-pane>
      <div slot="extra">
        <button>额外内容</button>
      </div>
    </at-tabs>
  </div>
</template>

<script>
import Popover from '@/components/Popover'
import ToolTip from '@/components/ToolTip'
import Modal from '@/components/Modal'
import AtTabs from '@/components/Tabs'
import AtTabPane from '@/components/Tabs/tab-pane'
const TABS = [{
  title: 'Tab 1',
  value: 'tab1'
}, {
  title: 'Tab 2',
  value: 'tab2'
}, {
  title: 'Disabled Tab',
  value: 'tab3',
  disabled: true
}, {
  title: 'Tab 4',
  value: 'tab4'
}]
export default {
  name: 'About',
  components: {
    Popover,
    ToolTip,
    Modal,
    AtTabs,
    AtTabPane
  },
  data () {
    return {
      modalVisible: false,
      tabs: TABS,
      currentTab: 'tab1'
    }
  },
  methods: {
    handleClick (newTab) {
      this.currentTab = newTab
    }
  }
}
</script>
<style lang="less">
.disabled-tabs {
  position: relative;
  margin: 0 auto;
  &__item {
    display: inline-block;
    margin: 0 5px;
    padding: 10px;
    padding-bottom: 8px;
    font-size: 16px;
    letter-spacing: 0.8px;
    color: gray;
    text-decoration: none;
    border: none;
    background-color: transparent;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.25s;
    &:hover {
      border-bottom: 2px solid gray;
      color: black;
    }
    &:focus {
      outline: none;
      border-bottom: 2px solid gray;
      color: blue;
    }
    &_active {
      color: blue;
    }
    &:disabled {
      border-bottom: 2px solid transparent;
      color: gray;
      cursor: default;
    }
    .tabs__item:first-child {
      margin-left: 0;
    }
    .tabs__item:last-child {
      margin-right: 0;
    }
  }
  &__active-line {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background-color: blue;
    transition: transform 0.4s ease, width 0.4s ease;
  }
}
.content {
  margin-top: 30px;
  font-size: 20px;
}
</style>
