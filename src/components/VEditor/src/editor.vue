<template>
  <!--formatPainterActive={this.state.formatPainterActive}
  saveSelectionFormat={this.handleSaveSelectionFormat}
  unsaveSelectionFormat={this.handleUnsaveSelectionFormat}-->
  <div class="quill-editor-container">
    <a-modal
      :title="linkModalTitle"
      :class="`${prefixCls}-link-modal`"
      :visible="showLinkModal"
      @ok="handleLinkModalOk"
      @cancel="handleLinkModalCancel"
      destroyOnClose
    >
      <span class="text">超链接地址</span>
      <a-input
        ref="linkModalInputRef"
        :style="{ width: '434px' }"
        :defaultValue="defaultInputLink"
      />
      <div class="tip" v-if="insertLinkTip">{{ insertLinkTip }}</div>
    </a-modal>

    <a-modal
      title="插入图片"
      class="`${prefixCls}-image-modal`"
      :visible="showImageModal"
      :footer="null"
      @Cancel="handleImageModalCancel"
    >
      <a-button type="primary" @click="handlePickLocalImage">选择本地图片</a-button>
      <div class="tip" v-if="insertImageTip">{{ insertImageTip }}</div>
    </a-modal>

    <a-modal
      title="插入视频"
      :class="`${prefixCls}-video-modal`"
      :visible="showVideoModal"
      v-bind="videoFooter"
      @ok="handleVideoModalOk"
      @cancel="handleVideoModalCancel"
    >
      <a-radio-group
        :style="{marginBottom: '24px'}"
        @change=handleVideoTypeChange
        :value="curVideoType"
      >
        <a-radio value="video_local" v-if="isSupportCustomInsertVideo">本地视频</a-radio>
        <a-radio value="video_link">视频链接</a-radio>
      </a-radio-group>

      <template v-if="curVideoType === 'video_local'">
        <a-button
          :style="{ display: 'block' }"
          type="primary"
          @click="handlePickLocalVideo"
        >选择本地视频</a-button>
        <div class="tip" v-if="insertVideoTip">{{ insertVideoTip }}</div>
      </template>
      <a-input
        v-else
        ref="videoModalInputRef"
        :style="{ width: '434px' }"
        placeholder="请输入视频链接URL"
      />
    </a-modal>

    <a-modal
      title="插入附件"
      :class="`${prefixCls}-image-modal`"
      :visible="showAttachmentModal"
      :footer="null"
      @cancel="handleAttachmentModalCancel"
    >
      <a-button type="primary" @click="handlePickLocalFile">选择本地文件</a-button>
      <div className="tip" v-if="insertAttachmentTip">{{ insertAttachmentTip }}</div>
    </a-modal>

    <div class="fishd-richeditor" ref="container">
      <slot name="toolbar">
        <custom-toolbar
          ref="toolBarRef"
          class="editor-head"
          id="editorHead"
          :toolbar="toolbar"
          :customEmoji="customEmoji"
          :customLink="customLink"
          :customInsertValue="customInsertValue"
          @handleInsertEmoji="handleInsertEmoji"
          @handleFormatColor="handleFormatColor"
          @handleFormatBackground="handleFormatBackground"
          @handleFormatSize="handleFormatSize"
          @handleInsertValue="handleInsertValue"
          :popoverPlacement="popoverPlacement"
          :tooltipPlacement="tooltipPlacement"
          @getPopupContainer="getPopupContainer"
          :getCurrentSize="getCurrentSize"
          :formatPainterActive="formatPainterActive"
          @saveSelectionFormat="handleSaveSelectionFormat"
          @unsaveSelectionFormat="handleUnsaveSelectionFormat"
        />
      </slot>
      <div ref="editor" class="editor-body"></div>
    </div>
  </div>
</template>

<script>
import Quill from './quill'
import CustomToolbar from './toolbar'
import CustomSizeBlot from './formats/size.js'
import EmojiBlot from './formats/emoji.js'
import LinkBlot from './formats/link.js'
import ImageBlot from './formats/image.js'
import VideoBlot from './formats/video.js'
import ImageDrop from './modules/imageDrop.js'
import FileDrop from './modules/fileDrop.js'
import PlainClipboard from './modules/plainClipboard.js'
import { Button, Input, message, Modal, Radio } from 'ant-design-vue'
import editorMixin from './editorMixin'
import Vue from 'vue'

import '../style/index.less'
const isEqual = require('lodash/isEqual')

Quill.register(EmojiBlot)
Quill.register(LinkBlot)
Quill.register(ImageBlot)
Quill.register(CustomSizeBlot)
Quill.register(VideoBlot)
Quill.register('modules/imageDrop', ImageDrop, true)
Quill.register('modules/fileDrop', FileDrop, true)

Vue.use(Modal).use(Input).use(Button).use(Radio)

const getImageSize = function (url, callback) {
  const newImage = document.createElement('img')
  newImage.onload = function () {
    callback(this.width, this.height)
  }
  newImage.src = url
}

export default {
  components: {
    CustomToolbar
  },
  mixins: [editorMixin],
  props: {
    customEmoji: {
      type: Array,
      default: () => []
    },
    customLink: {
      type: Object,
      default: () => {}
    },
    customInsertValue: {
      type: Object,
      default: () => {}
    },
    defaultValue: {
      type: String,
      default: ''
    },
    insertLinkTip: {
      type: String,
      default: ''
    },
    insertImageTip: {
      type: String,
      default: ''
    },
    insertVideoTip: {
      type: String,
      default: ''
    },
    insertAttachmentTip: {
      type: String,
      default: ''
    },
    popoverPlacement: {
      type: String,
      default: 'top'
    },
    tooltipPlacement: {
      type: String,
      default: 'bottom'
    },
    getPopupContainer: {
      type: Function,
      default: () => document.body
    },
    defaultFontSize: {
      type: String,
      default: '14px'
    },
    prefixCls: {
      type: String,
      default: 'fishd-richeditor'
    },
    onClickToolbarBtn: {
      type: Function,
      default: () => {
        return function () {
        }
      }
    },
    onSelectionChange: {
      type: Function,
      default: () => {
        return function () {
        }
      }
    },
    customInsertImage: {
      type: [Boolean, Function],
      default: false
    },
    customInsertVideo: {
      type: [Boolean, Function],
      default: false
    },
    customInsertAttachment: {
      type: [Boolean, Function],
      default: false
    },
    customDropImage: {
      type: [Boolean, Function],
      default: false
    },
    customDropFile: {
      type: [Boolean, Function],
      default: false
    },
    fileDrop: {
      type: Boolean,
      default: false
    },
    imageDrop: {
      type: Boolean,
      default: false
    },
    pastePlainText: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    supportFontTag: {
      type: Boolean,
      default: false
    },
    toolbar: {
      type: Array,
      default: () => {
        return [
          ['link', 'bold', 'italic', 'underline'],
          ['color', 'background'],
          [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
          ['size'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['emoji'],
          ['image'],
          ['video'],
          ['attachment'],
          ['strike'],
          ['blockquote'],
          ['code-block'],
          [{ script: 'sub' }, { script: 'super' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ direction: 'rtl' }],
          ['clean', 'formatPainter']
        ]
      }
    },
    videoTagAttrs: {
      type: Object,
      default: () => ({})
    },
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    options: {
      type: Object,
      default: () => ({}),
      required: false
    }
  },
  data () {
    return {
      editorInstance: null,
      lastValue: this.value,
      loading: false,
      showLinkModal: false,
      showVideoModal: false,
      showImageModal: false,
      showAttachmentModal: false,
      toolbarCtner: null,
      curRange: null,
      defaultInputLink: 'http://',
      linkModalTitle: '插入超链接',
      formatPainterActive: false,
      handlers: null,
      currentValue: '',
      isSupportCustomInsertVideo: true,
      currentVideoType: '',
      defaultVideoType: 'video_link',
      prevSelectionFormat: null,
      selection: null,
      lastDeltaChangeSet: null,
      generation: 0
    }
  },
  computed: {
    curVideoType: {
      get: function () {
        return this.currentVideoType || 'video_link'
      },
      set: function (value) {
        this.currentVideoType = value
      }
    },
    editorValue: {
      get: function () {
        if (this.supportFontTag) {
          return this.formatFontTag(this.value)
        }
        return this.value
      },
      set: function (value) {
        this.currentValue = value
      }
    },
    videoFooter: {
      get: function () {
        const videoFooter = {}
        if (this.curVideoType === 'video_local') {
          videoFooter.footer = null
        }
        return videoFooter
      }
    }
  },
  created () {
    // 粘贴时将富文本转为纯文本
    if (this.pastePlainText) {
      Quill.register('modules/clipboard', PlainClipboard, true)
    }
    if (this.customInsertVideo && (typeof this.customInsertVideo === 'function')) {
      this.isSupportCustomInsertVideo = true
      this.curVideoType = 'video_local'
    }
    this.handlers = {
      link: (value, fromAction) => {
        const { onClickToolbarBtn } = this
        if (typeof onClickToolbarBtn === 'function' && onClickToolbarBtn('link') === false) {
          return
        }

        const quill = this.editorInstance
        const range = quill.getSelection()

        if (range && range.length !== 0) {
          // 附件不能设置超链接
          const [link] = quill.scroll.descendant(LinkBlot, range.index)
          if (link && link.domNode.dataset.qlLinkType === 'attachment') {
            return
          }

          this.editorValue = quill.getRawHTML()
          this.showLinkModal = true
          this.defaultInputLink = 'http://'
          this.curRange = range

          // 点击编辑链接触发
          if (fromAction) {
            this.defaultInputLink = value
            this.linkModalTitle = '编辑超链接'
          } else {
            this.linkModalTitle = '插入超链接'
          }
        } else {
          message.error('没有选中文本')
        }
      },
      video: (value) => {
        const { onClickToolbarBtn } = this
        if (typeof onClickToolbarBtn === 'function' && onClickToolbarBtn('video') === false) {
          return
        }

        const quill = this.editorInstance
        this.editorValue = quill.getRawHTML()
        this.showVideoModal = true
        this.curRange = quill.getSelection()
      },
      emoji: (value) => {
        const quill = this.editorInstance
        const range = quill.getSelection()
        const mValue = JSON.parse(value)

        quill.insertEmbed(range.index, 'emoji', {
          type: mValue.type,
          alt: mValue.alt,
          src: mValue.src && mValue.src.trim(),
          width: mValue.width,
          height: mValue.height,
          id: mValue.id
        })
        quill.setSelection(range.index + 1)
      },
      image: () => {
        const { onClickToolbarBtn } = this
        if (typeof onClickToolbarBtn === 'function' && onClickToolbarBtn('image') === false) {
          return
        }

        const quill = this.editorInstance
        this.editorValue = quill.getRawHTML()
        this.showImageModal = true
        this.curRange = quill.getSelection()
      },
      attachment: () => {
        const { onClickToolbarBtn } = this
        if (typeof onClickToolbarBtn === 'function' && onClickToolbarBtn('attachment') === false) {
          return
        }

        const quill = this.editorInstance
        this.editorValue = quill.getRawHTML()
        this.showAttachmentModal = true
        this.curRange = quill.getSelection()
      },
      clean: () => {
        const { parchment: Parchment } = Quill.imports
        const quill = this.editorInstance
        const range = quill.getSelection()

        if (range == null) return
        if (range.length === 0) {
          const formats = quill.getFormat()
          Object.keys(formats).forEach((name) => {
            // Clean functionality in existing apps only clean inline formats
            if (Parchment.query(name, Parchment.Scope.INLINE) != null) {
              quill.format(name, false)
            }
          })
        } else {
          quill.removeFormat(range, Quill.sources.USER)
        }
      },
      // 处理定制的插入值
      customInsertValue: (value) => {
        const quill = this.getEditor()
        const range = quill.getSelection()
        const mValue = JSON.parse(value)

        if (!range) return

        if (mValue.editable === false) {
          quill.insertText(range.index, mValue.value, {
            customAttr: { editable: false }
          })
        } else {
          quill.insertText(range.index, mValue.value)
        }
      }
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      const _this = this
      const { placeholder, fileDrop, customDropFile, imageDrop, customDropImage, pastePlainText } = this
      if (this.editorInstance) return false
      if (this.$refs.editor && this.$refs.toolBarRef.$el) {
        const moduleOpts = {
          bounds: this.$refs.container,
          modules: {
            toolbar: {
              container: this.$refs.toolBarRef.$el,
              handlers: this.handlers
            }
          },
          theme: 'snow',
          placeholder: placeholder
        }

        // fileDrop 为 true 时，使 imageDrop 失效
        if (fileDrop && customDropFile) {
          // customDropFile 自定义文件上传逻辑，必选
          moduleOpts.modules.fileDrop = {
            customDropFile
          }
        } else if (imageDrop) {
          // customDropImage 不存在时，将图片文件转为 dataUrl 格式
          moduleOpts.modules.imageDrop = {
            customDropImage
          }
        }

        if (pastePlainText) {
          moduleOpts.modules.clipboard = {
            pastePlainText: true
          }
        }

        const editorOptions = Object.assign({}, moduleOpts, this.options)
        this.editorInstance = new Quill(this.$refs.editor, editorOptions)

        this.editorInstance.getHTML = function () { return _this.formatOutputHTML(this.editorInstance.root.innerHTML) }
        this.editorInstance.getRawHTML = function () { return _this.editorInstance.root.innerHTML }
        this.editorInstance.isEmptyContents = function () { return _this.isEmptyContents(this.editorInstance) }
        this.hookEditor(this.editorInstance)
        this.setEditorContents(this.editorInstance, this.editorValue)
        this.$emit('init', this.editorInstance)
      }
    },
    formatFontTag (value) {
      if (!value) return value

      const fontTagStart = /(<\s*?)font(\s+)(.*?)(>)/gi
      const fontTagEnd = /(<\s*?\/\s*?)font(\s*?>)/gi

      value = value.replace(fontTagStart, ($0, $1, $2, $3, $4) => {
        let tagStyle = ' style="'
        let tagAttr = ' '
        $3.replace(/(\w+-?\w+)\s*=\s*["']\s*(.*?)\s*["']/gi, ($0, $1, $2) => {
          const key = $1; const value = $2

          switch (key) {
            case 'color': {
              tagStyle += 'color:' + value + ';'
              break
            }
            case 'size': {
              // font标签size属性的value是数字类型，取值范围是[1,7]。
              const size2pxMap = {
                1: '12px',
                2: '13px',
                3: '16px',
                4: '18px',
                5: '24px',
                6: '32px',
                7: '48px'
              }
              let sizeWithUnit = this.defaultFontSize
              const val = value && value.trim()

              // value非数字或不在[1,7]范围内时，取默认字体大小
              if (!/^\d+$/.test(val) || (parseInt(val) > 7) || (parseInt(val) < 1)) {
                sizeWithUnit = this.defaultFontSize
              } else {
                sizeWithUnit = size2pxMap[val] || this.defaultFontSize
              }
              tagStyle += 'font-size:' + sizeWithUnit + ';'
              break
            }
            case 'face': {
              tagStyle += 'font-family:' + value + ';'
              break
            }
            default: {
              tagAttr += key + '=' + value
              break
            }
          }
        })
        tagStyle += '"'
        return $1 + 'span' + $2 + tagStyle + tagAttr + $4
      })

      return value.replace(fontTagEnd, '$1span$2')
    },
    handleInsertEmoji (e) {
      const toolbarCtner = this.$refs.toolBarRef.$el
      const target = e.target
      const clsList = target.classList.value
      if (
        (clsList.indexOf('emoji-item') > -1 || clsList.indexOf('emoji-extend-item') > -1) &&
          target.hasAttribute('value')
      ) {
        let el = toolbarCtner.querySelector('button.ql-emoji[data-role="emoji"]')
        if (el === null) {
          el = document.createElement('button')
          toolbarCtner.querySelector('.custom-emoji').appendChild(el)
        }
        el.setAttribute('type', 'button')
        el.setAttribute('data-role', 'emoji')
        el.setAttribute('value', target.getAttribute('value'))
        el.classList.add('ql-emoji', 'hide')
        el.click()
      }
    },
    handleFormatColor (e) {
      const toolbarCtner = this.$refs.toolBarRef.$el
      const target = e.target

      if (target.classList.value.indexOf('color-item') > -1 && target.hasAttribute('value')) {
        let el = toolbarCtner.querySelector('button.ql-color[data-role="color"]')
        if (el == null) {
          el = document.createElement('button')
          toolbarCtner.querySelector('.custom-color').appendChild(el)
        }

        el.setAttribute('type', 'button')
        el.setAttribute('data-role', 'color')
        el.setAttribute('value', target.getAttribute('value'))
        el.classList.add('ql-color', 'hide')
        el.click()
      }
    },
    handleFormatBackground (e) {
      const toolbarCtner = this.$refs.toolBarRef.$el
      const target = e.target

      if (target.classList.value.indexOf('background-item') > -1 && target.hasAttribute('value')) {
        let el = toolbarCtner.querySelector('button.ql-background[data-role="background"]')
        if (el == null) {
          el = document.createElement('button')
          toolbarCtner.querySelector('.custom-background').appendChild(el)
        }

        el.setAttribute('type', 'button')
        el.setAttribute('data-role', 'background')
        el.setAttribute('value', target.getAttribute('value'))
        el.classList.add('ql-background', 'hide')
        el.click()
      }
    },
    handleFormatSize (value) {
      const quill = this.editorInstance
      quill && quill.format('customAttr', {
        fontSize: value
      })
    },
    getCurrentSize () {
      const quill = this.editorInstance
      if (!quill) return null

      const formats = quill.getFormat()
      const customAttr = formats && formats.customAttr
      const customAttrType = Object.prototype.toString.call(customAttr)

      if (!customAttr) return this.defaultFontSize

      if (customAttrType === '[object Object]') {
        return customAttr.fontSize || this.defaultFontSize
      }

      if (customAttrType === '[object Array]') {
        const len = customAttr.length
        if (len) {
          const fontSize = customAttr[0].fontSize
          let hasMultiFontSize = false
          for (let i = 0; i < len; i++) {
            // 选中的富文本有多种字体大小时不高亮字号
            if (customAttr[i].fontSize !== fontSize) {
              hasMultiFontSize = true
              break
            }
          }

          if (hasMultiFontSize) {
            return null
          } else {
            return fontSize
          }
        } else {
          return this.defaultFontSize
        }
      }
      return null
    },
    handleInsertValue () {},
    handleLinkModalOk () {
      const el = this.$refs.linkModalInputRef.$el
      const val = el.value.trim()

      if (val) {
        if (val.length > 1000) {
          message.error('链接地址不得超过1000个字')
          return
        }

        const quill = this.editorInstance
        quill.formatText(this.curRange, 'link', {
          // type: 'default',
          url: val
        }, 'user')
        quill.setSelection(this.curRange) // 设置超链接后恢复选区

        this.editorValue = quill.getRawHTML()
        this.showLinkModal = false
        this.defaultInputLink = 'http://'
      } else {
        message.error('链接地址不得为空')
      }
    },
    handleLinkModalCancel () {
      this.showLinkModal = false
      this.defaultInputLink = 'http://'
    },
    handlePickLocalImage () {
      const { customInsertImage } = this
      const quill = this.editorInstance
      let fileInput = this.$refs.toolBarRef.$el.querySelector('input.ql-image[type=file]')
      const handleInsertImage = (info) => {
        if (info.src === undefined) {
          message.error('请设置图片源地址')
          return
        }

        info.src = info.src && info.src.trim()

        const range = this.curRange ? this.curRange : quill.getSelection(true)
        if (info.width === undefined || info.height === undefined) {
          getImageSize(info.src, (naturalWidth, naturalHeight) => {
            info.width = naturalWidth
            info.height = naturalHeight

            quill.insertEmbed(range.index, 'myImage', info)
            quill.setSelection(range.index + 1, 'silent')

            this.editorValue = quill.getRawHTML()
            this.curRange = null
          })
        } else {
          quill.insertEmbed(range.index, 'myImage', info)
          quill.setSelection(range.index + 1, 'silent')

          this.editorValue = quill.getRawHTML()
          this.curRange = null
        }
      }

      const getImageCb = (imgList) => {
        if (Array.isArray(imgList)) {
          imgList.forEach((imgInfo) => {
            handleInsertImage(imgInfo)
          })
        } else {
          handleInsertImage(imgList)
        }
      }

      this.showImageModal = false

      if (customInsertImage && (typeof customInsertImage === 'function')) {
        customInsertImage(getImageCb)
      } else {
        if (fileInput == null) {
          fileInput = document.createElement('input')
          fileInput.setAttribute('type', 'file')
          fileInput.setAttribute('accept', 'image/jpg, image/jpeg, image/png, image/gif, image/bmp')
          fileInput.setAttribute('multiple', 'multiple')
          fileInput.classList.add('ql-image')
          fileInput.addEventListener('change', () => {
            if (fileInput.files != null && fileInput.files.length) {
              for (let i = 0, len = fileInput.files.length; i < len; i++) {
                const reader = new FileReader()
                reader.onload = (e) => {
                  getImageCb({ src: e.target.result })
                  fileInput.value = ''
                }
                reader.readAsDataURL(fileInput.files[i])
              }
            }
          })
          this.$refs.toolBarRef.$el.appendChild(fileInput)
        }
        fileInput.click()
      }
    },
    handleImageModalCancel () {
      this.showImageModal = false
      this.curRange = null
    },
    handleVideoModalOk () {
      let val = null

      if (this.$refs.videoModalInputRef) {
        val = this.$refs.videoModalInputRef.input.value.trim()
      }

      if (val) {
        if (val.length > 1000) {
          message.error('视频链接不得超过1000个字')
          return
        }

        if (val.indexOf('//') < 0) {
          message.error('视频链接URL格式错误')
          return
        }

        const quill = this.editorInstance
        const range = this.curRange ? this.curRange : quill.getSelection(true) // 获取选区前先聚焦
        const { videoTagAttrs } = this

        this.insertVideo(range.index, {
          ...videoTagAttrs,
          src: val
        })

        this.$refs.videoModalInputRef && (this.$refs.videoModalInputRef.input.value = '')

        this.editorValue = quill.getRawHTML()
        this.showVideoModal = false
        this.curRange = null
      } else {
        message.error('视频链接URL不得为空')
      }
    },
    handleVideoModalCancel () {
      if (this.$refs.videoModalInputRef) {
        this.$refs.videoModalInputRef.input.value = ''
      }

      this.curVideoType = 'video_link'
      this.showVideoModal = false
      this.curRange = null
    },
    handleVideoTypeChange (e) {
      this.curVideoType = e.target.value || this.defaultVideoType
    },
    handlePickLocalVideo () {
      const { customInsertVideo, videoTagAttrs } = this
      const quill = this.editorInstance // 获取选区前先聚焦
      let fileInput = this.$refs.toolBarRef.$el.querySelector('input.ql-video[type=file]')

      const handleVideoInsert = (info) => {
        if (info.src === undefined) {
          message.error('请设置视频源地址')
          return
        }

        info.src = info.src && info.src.trim()

        const range = this.curRange ? this.curRange : quill.getSelection(true)
        this.insertVideo(range.index, {
          ...videoTagAttrs,
          ...info
        })
      }

      const getVideoCb = (videoList) => {
        if (Array.isArray(videoList)) {
          videoList.forEach((videoInfo) => {
            handleVideoInsert(videoInfo)
          })
        } else {
          handleVideoInsert(videoList)
        }

        this.editorValue = quill.getRawHTML()
        this.curRange = null
      }
      this.showVideoModal = false

      if (customInsertVideo && (typeof customInsertVideo === 'function')) {
        customInsertVideo(getVideoCb)
      } else {
        if (fileInput == null) {
          fileInput = document.createElement('input')
          fileInput.setAttribute('type', 'file')
          fileInput.setAttribute('accept', 'video/*')
          // fileInput.setAttribute('multiple', 'multiple')
          fileInput.classList.add('ql-video')
          fileInput.addEventListener('change', () => {
            if (fileInput.files != null && fileInput.files.length) {
              for (let i = 0, len = fileInput.files.length; i < len; i++) {
                const reader = new FileReader()
                reader.onload = (e) => {
                  getVideoCb({ src: e.target.result })
                  fileInput.value = ''
                }
                reader.readAsDataURL(fileInput.files[i])
              }
            }
          })
          this.$refs.toolBarRef.$el.appendChild(fileInput)
        }
        fileInput.click()
      }
    },
    insertVideo (rangeIndex, attrs) {
      const quill = this.editorInstance
      const prevChar = quill.getText(rangeIndex - 1, 1)
      const nextChar = quill.getText(rangeIndex + 1, 1)
      let videoNode = document.createElement('video')

      videoNode.onerror = () => {
        message.error('视频无法播放')
      }
      videoNode.src = attrs.src && attrs.src.trim()
      videoNode = null

      if ((rangeIndex > 0) && (prevChar !== '\n')) {
        // 在一行的中间插入视频
        if (nextChar && (nextChar !== '\n')) {
          quill.insertText(rangeIndex, '\n') // 插入视频前换行，避免丢失文字
          quill.insertEmbed(rangeIndex + 1, 'myVideo', attrs)
          quill.setSelection(rangeIndex + 1, 'silent')
        } else {
          // 在一行的末尾插入视频
          quill.insertEmbed(rangeIndex + 1, 'myVideo', attrs)
          quill.insertText(rangeIndex + 2, '\n') // 插入视频后换行，避免丢失光标
          quill.setSelection(rangeIndex + 2, 'silent')
        }
      } else {
        // 一行的开头插入视频
        quill.insertEmbed(rangeIndex, 'myVideo', attrs)
        quill.setSelection(rangeIndex + 1, 'silent')
      }
    },
    handlePickLocalFile () {
      const { customInsertAttachment } = this
      const quill = this.editorInstance
      let fileInput = this.$refs.toolBarRef.$el.querySelector('input.ql-attachment[type=file]')

      const handleInsertFile = (file) => {
        if (!file || !file.url || !file.name) {
          message.error('文件信息读取失败')
          return
        }

        const range = this.curRange ? this.curRange : quill.getSelection(true)
        if (!range) return

        // 继承列表的样式
        const curFormat = quill.getFormat(range)
        const listFormat = {}

        if (curFormat && curFormat.list) {
          listFormat.list = curFormat.list
        }

        const displayFileName = '[文件] ' + file.name
        const contentsDelta = [
          {
            insert: displayFileName,
            attributes: {
              ...listFormat,
              link: {
                type: 'attachment',
                url: file.url && file.url.trim(),
                name: file.name
              }
            }
          },
          {
            insert: '\n',
            attributes: {
              ...listFormat
            }
          }
        ]

        // 在开头插入时不能使用retain
        if (range.index > 0) {
          contentsDelta.unshift({ retain: range.index })
        }

        // 插入附件
        quill.updateContents(contentsDelta, 'silent')
        quill.setSelection(range.index + displayFileName.length + 1, 'silent')
      }

      const getFileCb = (fileList) => {
        if (Array.isArray(fileList)) {
          fileList.sort((a, b) => {
            // 单次插入多个不同类型的文件时，按”视频 -> 图片 -> 其他文件“的顺序排列
            const order = ['other', 'image', 'video']
            return order.indexOf(b.type) - order.indexOf(a.type)
          }).forEach((file) => {
            handleInsertFile(file)
            this.editorValue = quill.getRawHTML()
            this.curRange = null
          })
        } else {
          handleInsertFile(fileList)
          this.editorValue = quill.getRawHTML()
          this.curRange = null
        }
      }
      this.showAttachmentModal = false
      if (customInsertAttachment && (typeof customInsertAttachment === 'function')) {
        customInsertAttachment(getFileCb)
      } else {
        if (fileInput == null) {
          fileInput = document.createElement('input')
          fileInput.setAttribute('type', 'file')
          fileInput.setAttribute('multiple', 'multiple')
          fileInput.classList.add('ql-attachment')
          fileInput.addEventListener('change', () => {
            if (fileInput.files != null && fileInput.files.length) {
              for (let i = 0, len = fileInput.files.length; i < len; i++) {
                const reader = new FileReader()
                reader.onload = (e) => {
                  getFileCb({ url: e.target.result, name: fileInput.files[i].name })
                  fileInput.value = ''
                }
                reader.readAsDataURL(fileInput.files[i])
              }
            }
          })
          this.$refs.toolBarRef.$el.appendChild(fileInput)
        }
        fileInput.click()
      }
    },
    handleAttachmentModalCancel () {
      this.showAttachmentModal = false
      this.curRange = null
    },
    onEditorChangeSelection (nextSelection, source, editor) {
      // let { toolbarCtner } = this.state;
      const { onSelectionChange } = this
      onSelectionChange && onSelectionChange(nextSelection, source, editor)

      const quill = this.editorInstance
      if (!quill) return

      // 格式刷
      if (this.prevSelectionFormat && nextSelection) {
        // 清除当前选区的格式
        quill.removeFormat(nextSelection.index, nextSelection.length)

        // 设置当前选区的格式
        Object.keys(this.prevSelectionFormat).forEach((name) => {
          quill.format(name, this.prevSelectionFormat[name])
        })

        // 取消格式刷高亮
        this.formatPainterActive = false

        // 重置保存的格式
        this.prevSelectionFormat = null
      }

      const tooltip = quill.theme && quill.theme.tooltip
      if (!tooltip) return

      // 光标定位到超链接上时展示tooltip
      if (nextSelection && nextSelection.length === 0 && source === 'user') {
        const [link, offset] = quill.scroll.descendant(LinkBlot, nextSelection.index)
        if (link != null) {
          // 附件的超链接不可编辑
          if (link.domNode.dataset.qlLinkType === 'attachment') {
            return
          }

          tooltip.linkRange = new Range(nextSelection.index - offset, link.length())
          this.linkRange = tooltip.linkRange // 保存到当前实例，在编辑/删除超链接的事件回调中使用
          const preview = LinkBlot.formats(link.domNode).url
          tooltip.preview.textContent = preview
          tooltip.preview.setAttribute('href', preview)
          // 需要在显示后设置位置
          this.handleShowTooltip(tooltip.root)
          this.handleTooltipPosition(tooltip, quill.getBounds(tooltip.linkRange))
          return
        }
      }
      this.handleHideTooltip(tooltip.root)
    },
    handleShowTooltip (root) {
      if (!root) return
      root.classList.remove('ql-editing')
      root.classList.remove('ql-hidden')
      root.classList.remove('custom-hide')
      root.classList.add('custom-show')
    },
    handleHideTooltip (root) {
      if (!root) return
      root.classList.remove('custom-show')
      root.classList.add('ql-hidden')
      root.classList.add('custom-hide')
    },
    handleTooltipPosition (tooltip, reference) {
      const left = reference.left + reference.width / 2 - tooltip.root.offsetWidth / 2
      // root.scrollTop should be 0 if scrollContainer !== root
      const top = reference.bottom + tooltip.quill.root.scrollTop
      tooltip.root.style.left = left + 'px'
      tooltip.root.style.top = top + 'px'
      tooltip.root.classList.remove('ql-flip')
      const containerBounds = tooltip.boundsContainer.getBoundingClientRect()
      const rootBounds = tooltip.root.getBoundingClientRect()
      let shift = 0; const offset = 15
      if (rootBounds.right > containerBounds.right) {
        shift = containerBounds.right - rootBounds.right
        tooltip.root.style.left = (left + shift - offset) + 'px'
      }
      if (rootBounds.left < containerBounds.left) {
        shift = containerBounds.left - rootBounds.left
        tooltip.root.style.left = (left + shift + offset) + 'px'
      }
      if (rootBounds.bottom > containerBounds.bottom) {
        const height = rootBounds.bottom - rootBounds.top
        const verticalShift = reference.bottom - reference.top + height
        tooltip.root.style.top = (top - verticalShift) + 'px'
        tooltip.root.classList.add('ql-flip')
      }
      return shift
    },
    handleSaveSelectionFormat () {
      const quill = this.editorInstance
      if (!quill) return null

      this.prevSelectionFormat = quill.getFormat()

      // 格式刷高亮
      this.formatPainterActive = true
    },
    handleUnsaveSelectionFormat () {
      if (this.prevSelectionFormat) {
        this.prevSelectionFormat = null
      }

      // 取消格式刷高亮
      this.formatPainterActive = false
    },
    getEditorContents () {
      return this.editorValue
    },
    /*
      True if the value is a Delta instance or a Delta look-alike.
      */
    isDelta: function (value) {
      return value && value.ops
    },
    /*
      Special comparison function that knows how to compare Deltas.
      */
    isEqualValue: function (value, nextValue) {
      if (this.isDelta(value) && this.isDelta(nextValue)) {
        return isEqual(value.ops, nextValue.ops)
      } else {
        return isEqual(value, nextValue)
      }
    },
    onEditorChangeText (value, delta, source, editor) {
      const currentContents = this.getEditorContents()

      // We keep storing the same type of value as what the user gives us,
      // so that value comparisons will be more stable and predictable.
      const nextContents = this.isDelta(currentContents)
        ? editor.getContents()
        : editor.getRawHTML()

      if (!this.isEqualValue(nextContents, currentContents)) {
        // Taint this `delta` object, so we can recognize whether the user
        // is trying to send it back as `value`, preventing a likely loop.
        this.editorValue = nextContents
        this.lastDeltaChangeSet = delta

        // 初次生成ReactQuill时toolbar未完成，需要再次生成ReactQuill，避免onChange多次调用
        if (this.generation !== 0) {
          this.$emit('change', value, delta, source, editor)
        }
      }
    },
    focus: function () {
      this.editorInstance.focus()
      this.$emit('focus', this.editorInstance)
    },
    blur: function () {
      this.setEditorSelection(this.editorInstance, null)
      this.$emit('blur', this.editorInstance)
    }
  }
}
</script>
