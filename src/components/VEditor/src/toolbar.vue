<!--
/**
 * 自定义toolbar
 * @author huangchunmao
 * @email sujinw@qq.com
 * @version v1.0.0
 * @date 2020/9/21
*/
-->
<script>
import classNames from 'classnames'
import emojiList from './emojiList.js'
import Vue from 'vue'
import { Tooltip, Popover, Icon, Tabs, Input } from 'ant-design-vue'

const COLORS = [
  '#E53333', '#E56600', '#FF9900',
  '#64451D', '#DFC5A4', '#FFE500',
  '#009900', '#006600', '#99BB00',
  '#B8D100', '#60D978', '#00D5FF',
  '#337FE5', '#003399', '#4C33E5',
  '#9933E5', '#CC33E5', '#EE33EE',
  '#ffffff', '#cccccc', '#999999',
  '#666666', '#333333', '#000000'
]

const EMOJI_DEFAULT_WIDTH = 24
const EMOJI_DEFAULT_HEIGHT = 24
const EMOJI_COSTOM_WIDTH = 74
const EMOJI_COSTOM_HEIGHT = 74

Vue.use(Tabs)

export default {
  components: {
    Input,
    Icon,
    Tooltip,
    Popover
  },
  props: {
    iconPrefix: {
      type: String,
      default: 'fishdicon'
    },
    prefixCls: {
      type: String,
      default: 'fishd-richeditor'
    },
    popoverPlacement: {
      type: String,
      default: 'top'
    },
    tooltipPlacement: {
      type: String,
      default: 'bottom'
    },
    toolbar: {
      type: Array,
      default: () => []
    },
    customEmoji: {
      type: Array,
      default: () => []
    },
    customLink: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formatPainterActive: {
      type: Boolean,
      default: false
    },
    customInsertValue: {
      type: Object,
      default: () => {
        return {}
      }
    },
    getCurrentSize: {
      type: Function,
      default: () => {
        return function () {
        }
      }
    },
    getCurLineHeight: {
      type: Function,
      default: () => {
        return function () {
        }
      }
    },
    handleInsertValue: {
      type: Function,
      default: () => {
        return function () {
        }
      }
    }
  },
  data () {
    return {
      className: '',
      getPopupContainer: () => document.body,
      curInsertValueList: [],
      defaultSizes: ['32px', '24px', '20px', '18px', '16px', '14px', '13px', '12px'],
      defaultLineHeight: ['1.0', '1.2', '1.5', '1.8', '2.0', '2.4', '2.6', '2.8', '3.0', '4.0', '5.0'],
      curSize: null,
      sizePopoverVisible: false,
      lineHeightPopoverVisible: false,
      curLineHeight: null,
      curIVSearchValue: '',
      defaultBackgrounds: () => {
        const colors = []
        COLORS.forEach(function (color, index) {
          colors.push(<button
            class="background-item"
            key={'default_background_' + index}
            value={color}
            title={color}
            style={{ backgroundColor: color }}
          />)
        })
        return colors
      },
      defaultColors: () => {
        const colors = []
        COLORS.forEach(function (color, index) {
          colors.push(<button
            class="color-item"
            key={'default_background_' + index}
            value={color}
            title={color}
            style={{ backgroundColor: color }}
          />)
        })
        return colors
      },
      defaultEmojis: () => {
        const data = emojiList
        const colSize = 10
        const resPath = '//qiyukf.com/sdk/res/portrait/emoji/'
        const tmpObj = {}
        const result = []

        data.forEach((item, index) => {
          const grpIndex = parseInt(item.id / colSize, 10)

          if (typeof tmpObj[grpIndex] === 'undefined') {
            tmpObj[grpIndex] = []
          }

          tmpObj[grpIndex].push(
            <div class="emoji-item-ctner" key={'emoji_' + grpIndex + '_' + index} >
              <button
                class={'emoji-item ' + item.className}
                value={
                  JSON.stringify({
                    type: 'defaultEmoji',
                    alt: item.title,
                    src: resPath + item.imgName + '.png',
                    width: EMOJI_DEFAULT_WIDTH,
                    height: EMOJI_DEFAULT_HEIGHT,
                    id: 'emoticon_' + item.className.replace('-', '_')
                  })
                }
                title={item.title}
              />
            </div>
          )
        })

        Object.keys(tmpObj).forEach((key) => {
          result.push(
            <div class="emoji-row" key={'emoji_row_' + key}>
              { tmpObj[key] }
            </div>
          )
        })

        return result
      }
    }
  },
  created () {
  },
  render () {
    const { toolbar } = this
    return <div ref="toolbarCtner">
      {this.genToolbar(toolbar)}
    </div>
  },
  methods: {
    genCustomEmoji (data) {
      if (!(data && data.length)) return

      const sortedData = data.slice().sort((a, b) => {
        if (typeof a.id !== 'number' || typeof b.id !== 'number') {
          return 0
        } else {
          return a.id - b.id
        }
      })

      return sortedData.map((item, index) => {
        return (
          <img
            key={'emoji_extend_' + index}
            class={'emoji-extend-item ' + item.className}
            value={
              JSON.stringify({
                type: 'customEmoji',
                alt: item.title,
                src: item.url,
                width: EMOJI_DEFAULT_WIDTH,
                height: EMOJI_DEFAULT_HEIGHT
              })
            }
            title={item.title}
            src={item.url}
            width={EMOJI_COSTOM_WIDTH}
            height={EMOJI_COSTOM_HEIGHT}
            alt={item.title}
          />
        )
      })
    },
    handleSizePopoverVisibleChange (visible) {
      this.sizePopoverVisible = visible
      if (!visible) return
      const { getCurrentSize } = this
      const curSize = getCurrentSize && getCurrentSize()
      if (curSize !== this.curSize) {
        this.curSize = curSize
      }
    },
    handleClearIVSearch () {
      this.curIVSearchValue = ''
    },
    handleSizeItemClick (e) {
      const target = e.target

      if (target.classList.value.indexOf('size-item') > -1 && target.hasAttribute('value')) {
        this.$emit('handleFormatSize', target.getAttribute('value'))
        this.sizePopoverVisible = false
      }
    },
    handleFormatPainterClick () {
      const {
        formatPainterActive
      } = this
      if (formatPainterActive) {
        this.$emit('unsaveSelectionFormat')
      } else {
        this.$emit('saveSelectionFormat')
      }
    },
    handleIVSearchChange (e) {
      const value = e.target.value
      this.curIVSearchValue = value || ''
    },
    handleLineHeightPopoverVisibleChange (visible) {
      this.lineHeightPopoverVisible = visible
      console.log('visible', visible)
      if (!visible) return
      const { getCurLineHeight } = this
      const curLineHeight = getCurLineHeight && getCurLineHeight()
      console.log('visible', curLineHeight)
      if (curLineHeight !== this.curLineHeight) {
        this.curLineHeight = curLineHeight * 1
      }
    },
    handleLineHeightItemClick (e) {
      const target = e.target
      if (target.classList.value.indexOf('line-height-item') > -1 && target.hasAttribute('value')) {
        this.$emit('handleFormatLineHeight', target.getAttribute('value'))
        this.lineHeightPopoverVisible = false
      }
    },
    getModuleHTML (mType, key) {
      const {
        iconPrefix,
        handleInsertValue,
        prefixCls,
        customEmoji,
        customLink,
        customInsertValue,
        popoverPlacement,
        tooltipPlacement,
        getPopupContainer
      } = this
      let mValue = null; let value = null; let tooltip = null

      // mType 对象格式：
      // {'align': 'right'}
      // {size: ['32px', '24px', '18px', '16px', '13px', '12px']}
      if (typeof mType === 'object') {
        const obj = mType
        mType = Object.keys(obj)[0]
        mValue = obj[mType]
      }
      // 处理定制的链接模块
      if (mType in customLink) {
        const customModule = customLink[mType] || {}
        const cls = classNames('action custom-entry', {
          [`ql-${mType}Entry`]: true,
          [`${iconPrefix}`]: true,
          [`${iconPrefix}-richeditor-transfer`]: true,
          [`${customModule.className}`]: !!customModule.className
        })

        value = <button class={cls} key={key}/>
        if (customModule.title) {
          tooltip = customModule.title
        }
      } else if (mType in customInsertValue) { // 处理定制的插入值
        const customModule = customInsertValue[mType] || {}
        const cls = classNames('action custom-insert-value ql-customInsertValue', {
          [`${customModule.className}`]: !!customModule.className
        })
        const mValue = customModule.option || []
        let editable = true

        if (customModule.editable !== undefined) {
          editable = customModule.editable
        }

        if (Array.isArray(mValue) && mValue.length) {
          this.curInsertValueList = mValue
        }

        let filteredValueList = this.curInsertValueList || []
        if (customModule.showSearch && this.curInsertValueList && this.curInsertValueList.length) {
          filteredValueList = this.curInsertValueList.filter((item) => {
            return (
              item.title &&
              item.title.toLowerCase().indexOf(this.curIVSearchValue.toLowerCase()) > -1
            )
          })
        }

        const content = (
          <div class="insert-value-con" onClick={handleInsertValue}>
            {
              customModule.showSearch
                ? <div class="insert-value-search">
                  <Input
                    placeholder={customModule.searchPlaceholder ? customModule.searchPlaceholder : '请输入关键字'}
                    suffix={
                      this.curIVSearchValue
                        ? <Icon
                          class="insert-value-icon-clear"
                          type="close-circle-fill"
                          onClick={this.handleClearIVSearch}
                        /> : null
                    }
                    value={this.curIVSearchValue}
                    onChange={this.handleIVSearchChange}
                  />
                </div> : null
            }
            {
              filteredValueList.length
                ? filteredValueList.map(function (item, index) {
                  return (
                    <button
                      class="insert-value-item"
                      key={'insert_value_' + index}
                      title={item.title}
                      value={
                        JSON.stringify({
                          value: item.value,
                          editable: item.editable !== undefined ? item.editable : editable
                        })
                      }
                    >
                      {item.title}
                    </button>
                  )
                }) : <div class="insert-value-empty">暂无数据</div>
            }
          </div>
        )

        value = (
          <Popover
            trigger="click"
            overlayClassName={`${prefixCls}-insert-value-popover`}
            content={content}
            title={null}
            key={key}
            placement={popoverPlacement}
            getPopupContainer={getPopupContainer}
          >
            <Tooltip
              trigger="hover"
              placement={tooltipPlacement}
              title={customInsertValue[mType].title ? customInsertValue[mType].title : null}
              mouseEnterDelay={0.3}
            >
              <div class="item">
                <div class={cls}>
                  <button
                    type="button"
                    data-role="customInsertValue"
                    value=""
                    class="ql-customInsertValue hide"
                  />
                </div>
              </div>
            </Tooltip>
          </Popover>
        )

        tooltip = customInsertValue[mType].title || ''
      } else {
        switch (mType) {
          case 'link': {
            const linkCls = classNames('action ql-link', {
              [`${iconPrefix}`]: true,
              [`${iconPrefix}-richeditor-link`]: true
            })
            value = <button class={linkCls} key={key}/>
            tooltip = '超链接'
            break
          }
          case 'bold': {
            const boldCls = classNames('action ql-bold', {
              [`${iconPrefix}`]: true,
              [`${iconPrefix}-richeditor-bold`]: true
            })
            value = <button class={boldCls} key={key}/>
            tooltip = '粗体'
            break
          }
          case 'italic': {
            const italicCls = classNames('action ql-italic', {
              [`${iconPrefix}`]: true,
              [`${iconPrefix}-richeditor-tilt`]: true
            })
            value = <button class={italicCls} key={key}/>
            tooltip = '斜体'
            break
          }
          case 'underline': {
            const underlineCls = classNames('action ql-underline', {
              [`${iconPrefix}`]: true,
              [`${iconPrefix}-richeditor-underline`]: true
            })
            value = <button class={underlineCls} key={key}/>
            tooltip = '下划线'
            break
          }
          case 'color': {
            const colorCls = classNames('action custom-color', {
              [`${iconPrefix}`]: true,
              [`${iconPrefix}-richeditor-color`]: true
            })
            let colorHTML = this.defaultColors()
            if (Array.isArray(mValue) && mValue.length) {
              colorHTML = mValue.map(function (color, index) {
                return (
                  <button
                    class="color-item"
                    key={'custom_color_' + index}
                    value={color}
                    title={color}
                    style={{ backgroundColor: color }}
                  />
                )
              })
            }
            const content = (
              <div class="color-con" onClick={(e) => this.$emit('handleFormatColor', e)}>
                {colorHTML}
              </div>
            )

            value = (
              <Popover
                trigger="click"
                overlayClassName={`${prefixCls}-color-popover`}
                content={content}
                title={null}
                key={key}
                placement={popoverPlacement}
                getPopupContainer={getPopupContainer}
              >
                <Tooltip
                  trigger="hover"
                  placement={tooltipPlacement}
                  title="文字颜色"
                  mouseEnterDelay={0.3}
                >
                  <div class="item">
                    <div class={colorCls}>
                      <button type="button" data-role="color" value="" class="ql-color hide"/>
                    </div>
                  </div>
                </Tooltip>
              </Popover>
            )

            // value = <div className="item"><select className="ql-color" /></div>
            // value = (
            //   <div className="custom-color" key={key}>
            //     <ColorPicker
            //       className={"custom-color-picker"}
            //       enableHistory={true}
            //       enableAlpha={false}
            //       onClose={this.handleColorSelect.bind(this)}
            //     >
            //       <button className="ql-customColor" />
            //     </ColorPicker>
            //   </div>
            // )
            tooltip = '文字颜色'
            break
          }
          case 'align': {
            if (typeof mValue === 'string') {
              let alignIconType = 'richeditor-align-lef'
              tooltip = '居左'

              if (mValue === 'right') {
                alignIconType = 'richeditor-align-rig'
                tooltip = '居右'
              } else if (mValue === 'center') {
                alignIconType = 'richeditor-align-mid'
                tooltip = '居中'
              } else if (mValue === 'justify') {
                alignIconType = 'richeditor-align-all'
                tooltip = '两端对齐'
              }

              const alignCls = classNames('action ql-align', {
                [`${iconPrefix}`]: true,
                [`${iconPrefix}-${alignIconType}`]: true
              })
              value = <button type="button" class={alignCls} value={mValue} key={key}/>
            }
            // else if (mValue instanceof Array && mValue.length) {
            //   value = (
            //     <div className="item" key={key}>
            //       <select className="ql-align">
            //         <option />
            //         {
            //           mValue.map((val, idx) => {
            //             return <option key={key+'_option_'+idx} value={val} />
            //           })
            //         }
            //       </select>
            //     </div>
            //   )
            //   tooltip = '对齐'
            // } else {
            //   value = <div className="item" key={key}><select className="ql-align" /></div>
            //   tooltip = '对齐'
            // }
            break
          }
          case 'list': {
            let listIconType = 'richeditor-list'
            tooltip = '无序列表'

            if (mValue === 'ordered') {
              listIconType = 'richeditor-numberlis'
              tooltip = '有序列表'
            }

            const listCls = classNames('action ql-list', {
              [`${iconPrefix}`]: true,
              [`${iconPrefix}-${listIconType}`]: true
            })

            value = <button type="button" class={listCls} value={mValue} key={key}/>
            break
          }
          case 'emoji': {
            const emojiCls = classNames('action custom-emoji', {
              [`${iconPrefix}`]: true,
              [`${iconPrefix}-richeditor-expressio`]: true
            })
            let content = (
              <div class="emoji-ctner">
                <div class="emoji-con" onClick={(e) => this.$emit('handleInsertEmoji', e)}>
                  {this.defaultEmojis()}
                </div>
              </div>
            )
            if (customEmoji && customEmoji.length) {
              const tabPanes = [
                <a-tab-pane tab="默认表情" key="emoji_default">
                  <div class="emoji-ctner">
                    <div class="emoji-con" onClick={(e) => this.$emit('handleInsertEmoji', e)}>
                      {this.defaultEmojis()}
                    </div>
                  </div>
                </a-tab-pane>
              ]

              customEmoji.forEach((item, index) => {
                tabPanes.push(
                  <a-tab-pane tab={item.name} key={'custom_emoji_' + index}>
                    <div class="emoji-ctner">
                      <div class="emoji-con" onClick={(e) => this.$emit('handleInsertEmoji', e)}>
                        {this.genCustomEmoji(item.data)}
                      </div>
                    </div>
                  </a-tab-pane>
                )
              })

              content = (
                <a-tabs defaultActiveKey="emoji_default" size="small">
                  {tabPanes}
                </a-tabs>
              )
            }

            value = (
              <Popover
                trigger="click"
                overlayClassName={`${prefixCls}-emoji-popover`}
                content={content}
                title={null}
                key={key}
                placement={popoverPlacement}
                getPopupContainer={getPopupContainer}
              >
                <Tooltip
                  trigger="hover"
                  placement={tooltipPlacement}
                  title="插入表情"
                  mouseEnterDelay={0.3}
                >
                  <div class="item">
                    <div class={emojiCls}>
                      <button type="button" data-role="emoji" value="" class="ql-emoji hide"/>
                    </div>
                  </div>
                </Tooltip>
              </Popover>
            )
            tooltip = '插入表情'
            break
          }
          case 'image': {
            const imageCls = classNames('action ql-image', {
              [`${iconPrefix}`]: true,
              [`${iconPrefix}-richeditor-picture`]: true
            })
            value = <button class={imageCls} key={key}/>
            tooltip = '插入图片'
            break
          }
          case 'attachment': {
            const cls = classNames('action ql-attachment', {
              [`${iconPrefix}`]: true,
              [`${iconPrefix}-richeditor-annexx`]: true
            })
            value = <button class={cls} key={key}/>
            tooltip = '插入附件'
            break
          }
          case 'size': {
            const sizeCls = classNames('action custom-size', {
              [`${iconPrefix}`]: true,
              [`${iconPrefix}-richeditor-size`]: true
            })

            this.curSizeList = this.defaultSizes
            if (Array.isArray(mValue) && mValue.length) {
              this.curSizeList = mValue
            }

            const content = (
              <div class="size-con" key="custom_size_content" onClick={this.handleSizeItemClick}>
                {
                  this.curSizeList && this.curSizeList.map((size, index) => {
                    const sizeItemCls = classNames('size-item', {
                      active: size && (this.curSize === size.trim())
                    })

                    return (
                      <button
                        class={sizeItemCls}
                        key={'custom_size_' + index}
                        value={size}
                        style={{ fontSize: size }}
                      >
                        {size}
                      </button>
                    )
                  })
                }
              </div>
            )

            value = (
              <Popover
                trigger="click"
                overlayClassName={`${prefixCls}-size-popover`}
                content={content}
                title={null}
                key={key}
                visible={this.sizePopoverVisible}
                placement={popoverPlacement}
                getPopupContainer={getPopupContainer}
                onVisibleChange={this.handleSizePopoverVisibleChange}
              >
                <Tooltip
                  trigger="hover"
                  placement={tooltipPlacement}
                  title="文字大小"
                  mouseEnterDelay={0.3}
                >
                  <div class="item">
                    <div class={sizeCls}/>
                  </div>
                </Tooltip>
              </Popover>
            )

            tooltip = '文字大小'

            break
          }
          case 'lineheight': {
            const sizeCls = classNames('action custom-line-height', {
              [`${iconPrefix}`]: true,
              [`${iconPrefix}-richeditor-line-height`]: true
            })

            this.curLineHeightList = this.defaultLineHeight
            if (Array.isArray(mValue) && mValue.length) {
              this.curLineHeightList = mValue
            }

            const content = (
              <div class="size-con" key="custom_size_content" onClick={this.handleLineHeightItemClick}>
                {
                  this.curLineHeightList && this.curLineHeightList.map((size, index) => {
                    const sizeItemCls = classNames('line-height-item', {
                      active: size && (this.curLineHeight === (size.trim()) * 1)
                    })

                    return (
                      <button
                        class={sizeItemCls}
                        key={'custom_size_' + index}
                        value={size}
                        style={{ lineHeight: size }}
                      >
                        {size}
                      </button>
                    )
                  })
                }
              </div>
            )

            value = (
              <Popover
                trigger="click"
                overlayClassName={`${prefixCls}-size-popover`}
                content={content}
                title={null}
                key={key}
                visible={this.lineHeightPopoverVisible}
                placement={popoverPlacement}
                getPopupContainer={getPopupContainer}
                onVisibleChange={this.handleLineHeightPopoverVisibleChange}
              >
                <Tooltip
                  trigger="hover"
                  placement={tooltipPlacement}
                  title="行高"
                  mouseEnterDelay={0.3}
                >
                  <div class="item">
                    <div class={sizeCls}/>
                  </div>
                </Tooltip>
              </Popover>
            )

            // tooltip = '行高'

            break
          }
          case 'clean': {
            const cleanCls = classNames('action ql-clean', {
              [`${iconPrefix}`]: true,
              [`${iconPrefix}-richeditor-clear`]: true
            })

            value = <button class={cleanCls} key={key}/>
            tooltip = '清除格式'
            break
          }
          case 'formatPainter': {
            const cls = classNames('action ql-formatPainter', {
              [`${iconPrefix}`]: true,
              'ql-active': this.formatPainterActive,
              [`${iconPrefix}-richeditor-brushx`]: true
            })
            value = <button class={cls} key={key} onClick={this.handleFormatPainterClick}/>
            tooltip = '格式刷'
            break
          }
          case 'strike': {
            value = <button class="action ql-strike" key={key}/>
            tooltip = '删除线'
            break
          }
          case 'blockquote': {
            value = <button class="action ql-blockquote" key={key}/>
            tooltip = '块引用'
            break
          }
          case 'code-block': {
            value = <button class="action ql-code-block" key={key}/>
            tooltip = '代码块'
            break
          }
          case 'script': {
            value = <button type="button" class="action ql-script" value={mValue} key={key}/>
            if (mValue === 'super') {
              tooltip = '上脚标'
            } else {
              tooltip = '下脚标'
            }

            break
          }
          case 'indent': {
            value = <button type="button" class="action ql-indent" value={mValue} key={key}/>

            if (mValue === '-1') {
              tooltip = '减少缩进'
            } else {
              tooltip = '增加缩进'
            }

            break
          }
          case 'direction': {
            value = <button type="button" class="action ql-direction" value={mValue} key={key}/>
            tooltip = '文字方向'
            break
          }
          case 'background': {
            // value = <div className="item" key={key}><select className="ql-background" /></div>
            const backgroundCls = classNames('action custom-background', {
              [`${iconPrefix}`]: true,
              [`${iconPrefix}-richeditor-fontbkcol`]: true
            })
            let backgroundHTML = this.defaultBackgrounds()
            if (Array.isArray(mValue) && mValue.length) {
              backgroundHTML = mValue.map(function (color, index) {
                return (
                  <button
                    class="background-item"
                    key={'custom_background_' + index}
                    value={color}
                    title={color}
                    style={{ backgroundColor: color }}
                  />
                )
              })
            }
            const content = (
              <div class="background-con" onClick={(e) => this.$emit('handleFormatBackground', e)}>
                {backgroundHTML}
              </div>
            )

            value = (
              <Popover
                trigger="click"
                overlayClassName={`${prefixCls}-background-popover`}
                content={content}
                title={null}
                key={key}
                placement={popoverPlacement}
                getPopupContainer={getPopupContainer}
              >
                <Tooltip
                  trigger="hover"
                  placement={tooltipPlacement}
                  title="背景色"
                  mouseEnterDelay={0.3}
                >
                  <div class="item">
                    <div class={backgroundCls}>
                      <button type="button" data-role="background" value="" class="ql-background hide"/>
                    </div>
                  </div>
                </Tooltip>
              </Popover>
            )

            tooltip = '背景色'
            break
          }
          case 'video': {
            value = <button type="button" class="action ql-video" value={mValue} key={key}/>
            tooltip = '插入视频'
            break
          }
          // case 'header': {
          //   if (typeof mValue === 'string' || typeof mValue === 'number') {
          //     value = <button type="button" className="ql-header" value={mValue} key={key}/>
          //   } else if (mValue instanceof Array && mValue.length){
          //     value = (
          //       // <div className="item" key={key}>
          //         <select className="ql-header" defaultValue="normal">
          //           {
          //             mValue.map((val, idx) => <option key={key+'_option_'+idx} value={val} />)
          //           }
          //           <option value="normal" />
          //         </select>
          //       // </div>
          //     )
          //   }
          //   tooltip = '标题'
          //   break
          // }
          // case 'font': {
          //   value = <select className="ql-font" />
          //   tooltip = '字体'
          //   break
          // }
          default: {
            break
          }
        }
      }

      const mTypesHasPopover = ['background', 'color', 'emoji', 'size']
      if (value && (mTypesHasPopover.indexOf(mType) < 0) && !(mType in customInsertValue)) {
        value = (
          <Tooltip
            key={key}
            trigger="hover"
            placement={tooltipPlacement}
            title={tooltip}
            mouseEnterDelay={0.3}
          >
            <div class="item">{value}</div>
          </Tooltip>
        )
      }

      return value
    },
    genToolbar (toolbar) {
      const result = []
      toolbar.forEach((item, index) => {
        // 分组展示的项目
        if (item instanceof Array) {
          const grpItems = item.map((mType, subindex) => {
            return this.getModuleHTML(mType, 'toolbar_' + index + '_sub_' + subindex)
          })

          result.push(
            <div class="toolbar-grp" key={'toolbar_' + index}>
              {grpItems}
            </div>
          )
        } else { // 单个展示的项目
          result.push(
            this.getModuleHTML(item, 'toolbar_' + index)
          )
        }
      })

      return result
    }
  }
}
</script>
