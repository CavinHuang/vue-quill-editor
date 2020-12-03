<template>
  <div class="home" style="margin: 20px">
    <rich-text
      v-model="content"
      placeholder="请输入内容"
      :supportFontTag="true"
    />
    <h1>自定义文字大小</h1>
    <rich-text
      v-model="content"
      placeholder="请输入内容oooooo"
      :supportFontTag="true"
      :toolbar="demo2.toolbar"
    />
    <h1>定制文字颜色</h1>
    <rich-text
      v-model="content"
      placeholder="请输入内容oooooo"
      :supportFontTag="true"
      :toolbar="demo3.toolbar"
    />
    <h1>定制表情包</h1>
    <rich-text
      v-model="content"
      placeholder="请输入内容oooooo"
      :supportFontTag="true"
      :customEmoji="demo4.customEmoji"
    />
    <h1>扩展插入文本功能</h1>
    <rich-text
      v-model="content"
      placeholder="请输入内容oooooo"
      :supportFontTag="true"
      :toolbar="demo5.toolbar"
      :customInsertValue="demo5.customInsertValue"
    />
    <h1>扩展添加超链接功能</h1>
    <rich-text
      v-model="content"
      placeholder="请输入内容oooooo"
      :supportFontTag="true"
      :toolbar="demo6.toolbar"
      :customLink="demo6.customLink"
    />
    <h1>自定义插入图片</h1>
    <rich-text
      v-model="content"
      placeholder="请输入内容oooooo"
      :loading="loading"
      :supportFontTag="true"
      :toolbar="demo7.toolbar"
      :customInsertImage="demo7.customInsertImage"
    />
    <h1>自定义拖入/粘贴图片</h1>
    <rich-text
      v-model="content"
      placeholder="请输入内容oooooo"
      :loading="loading"
      :customDropImage="demo8.customDropImage"
    />
    <h1>自定义插入视频</h1>
    <rich-text
      v-model="content"
      placeholder="请输入内容oooooo"
      :customInsertVideo="demo9.customInsertVideo"
      :loading="loading"
      :videoTagAttrs="{ 'data-test-default': 'test-default' }"
    />
    <h1>自定义插入附件</h1>
    <rich-text
      v-model="content"
      placeholder="请输入内容oooooo"
      :customInsertAttachment="demo10.customInsertAttachment"
      insertAttachmentTip="支持docx、xlsx、pdf、pptx等常见文件格式，单个文件大小不得超过10M。"
      :loading="loading"
      :videoTagAttrs="{ 'data-test-default': 'test-default' }"
    />
    <h1>拖拽编辑器改变大小</h1>
    <rich-text
      v-model="content"
      placeholder="请输入内容oooooo"
      :resizable="true"
    />
    <h1>支持使用 font 标签</h1>
    <rich-text
      v-model="fontContent"
      placeholder="请输入内容oooooo"
      :supportFontTag="true"
    />
    <h1>插入不可编辑的文本</h1>
    <button type="button" :style="{marginBottom: 10}" @click="handleInsertText">插入文本</button>
    <rich-text
      v-model="fontContent"
      placeholder="请输入内容oooooo"
      @init="editorInit"
    />
    <h1>支持粘贴纯文本</h1>
    <rich-text
      v-model="demo12.content"
      placeholder="请输入内容oooooo"
      :pastePlainText="true"
    />
    <h1>支持提及（@功能）</h1>
    <div style="margin-top:5px">
      <a-button @click="showMenu()">展示@列表</a-button>
      <a-button @click="addMention()">手动增加一个at成员</a-button>
    </div>
    <rich-text
      v-model="demo13.content"
      placeholder="提交功能"
      :options="demo13.options"
      @init="demo13Init"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import RichText from '@/components/VEditor/src/editor.vue'
import { message } from '@/components/Message/index.js'
const advancedValues = [
  { id: '1', value: 'Manuel Neuer', team: 'Bayern Munich' },
  { id: '2', value: 'Robert Lewandowski', team: 'Bayern Munich' },
  { id: '3', value: 'Thomas Muller', team: 'Bayern Munich' },
  { id: '4', value: 'Roman Burki', team: 'Borussia Dortmund' },
  { id: '5', value: 'Jadon Sancho', team: 'Borussia Dortmund' },
  { id: '6', value: 'Marco Reus', team: 'Borussia Dortmund' },
  { id: '7', value: 'Alexander Nubel', team: 'Schalke 04' },
  { id: '8', value: 'Bastian Oczipka', team: 'Schalke 04' },
  { id: '9', value: 'Weston McKennie', team: 'Schalke 04' }
]

export default {
  name: 'Home',
  components: {
    RichText
  },
  data () {
    return {
      content: '',
      fontContent:
        '<p><font color="#26BD71" size="5">这是一段font标签的富文本</font></p><p><br></p>',
      loading: false,
      demo2: {
        toolbar: [['link', 'bold', 'italic', 'underline'], [{ size: ['32px', '24px', '18px'] }], ['color'], [{ align: '' }, { align: 'center' }, { align: 'right' }], [{ list: 'ordered' }, { list: 'bullet' }], ['emoji'], ['image'], ['clean', 'formatPainter']]
      },
      demo3: {
        toolbar: [['link', 'bold', 'italic', 'underline'], ['size'], [{ color: ['#000', '#333', 'red', 'green', 'blue'] }], [{ align: '' }, { align: 'center' }, { align: 'right' }], [{ list: 'ordered' }, { list: 'bullet' }], ['emoji'], ['image'], ['clean', 'formatPainter']]
      },
      demo4: {
        customEmoji: [{
          name: '自定义表情1',
          data: [
            {
              id: 0,
              className: 'e0',
              url: '//nos.netease.com/ysf/3df2280d2319678a091138b0bbba82fe',
              title: 'pic1'
            },
            {
              id: 1,
              className: 'e1',
              url: '//nos.netease.com/ysf/080b89be8a980ab9951a1b0de643d939',
              title: 'pic2'
            },
            {
              id: 2,
              className: 'e2',
              url: '//nos.netease.com/ysf/260c0731b07b2933fe04f1a4d629450c',
              title: 'pic3'
            },
            {
              id: 3,
              className: 'e3',
              url: '//nos.netease.com/ysf/3df2280d2319678a091138b0bbba82fe',
              title: 'pic4'
            },
            {
              id: 4,
              className: 'e4',
              url: '//nos.netease.com/ysf/080b89be8a980ab9951a1b0de643d939',
              title: 'pic5'
            },
            {
              id: 5,
              className: 'e5',
              url: '//nos.netease.com/ysf/260c0731b07b2933fe04f1a4d629450c',
              title: 'pic6'
            }
          ]
        }]
      },
      demo5: {
        toolbar: [
          ['link', 'bold', 'italic', 'underline'], ['size'], ['color'],
          [{ align: '' }, { align: 'center' }, { align: 'right' }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['emoji'], ['image'], ['clean', 'formatPainter'], ['myValue']
        ],
        customInsertValue: {
          myValue: {
            className: 'my-value',
            title: '插入变量',
            editable: false,
            showSearch: true,
            option: [
              // eslint-disable-next-line no-template-curly-in-string
              { value: '${value1}', title: 'LongLongLongLongLongLongLongLongLongLongLongTitle1' },
              // eslint-disable-next-line no-template-curly-in-string
              { value: '${value2}', title: 'Title2' },
              // eslint-disable-next-line no-template-curly-in-string
              { value: '${value3}', title: 'Title3', editable: true },
              // eslint-disable-next-line no-template-curly-in-string
              { value: '${value4}', title: 'Title4' },
              // eslint-disable-next-line no-template-curly-in-string
              { value: '${value5}', title: 'Title5' },
              // eslint-disable-next-line no-template-curly-in-string
              { value: '${value6}', title: 'Title6' },
              // eslint-disable-next-line no-template-curly-in-string
              { value: '${value7}', title: 'Title7' },
              // eslint-disable-next-line no-template-curly-in-string
              { value: '${value8}', title: 'Title8' },
              // eslint-disable-next-line no-template-curly-in-string
              { value: '${value9}', title: 'Title9' },
              // eslint-disable-next-line no-template-curly-in-string
              { value: '${value10}', title: 'Title10', editable: true }
            ]
          }
        }
      },
      demo6: {
        toolbar: [['link', 'bold', 'italic', 'underline'], ['size'], ['color'], [{ align: '' }, { align: 'center' },
          { align: 'right' }], [{ list: 'ordered' }, { list: 'bullet' }], ['emoji'], ['image'], ['clean', 'formatPainter'], ['mylink']],
        customLink: {
          mylink: {
            className: 'my-link',
            title: '自定义超链接',
            url: 'https://nsfi.github.io/ppfish-components/#/home'
          }
        }
      },
      demo7: {
        toolbar: [['link', 'bold', 'italic', 'underline'], ['size'], ['color'], [{ align: '' }, { align: 'center' },
          { align: 'right' }], [{ list: 'ordered' }, { list: 'bullet' }], ['emoji'], ['image'], ['clean', 'formatPainter'], ['mylink']],
        customInsertImage: (callback) => {
          this.loading = true

          // 模拟上传图片至服务器并设置图片URL的异步过程
          setTimeout(() => {
            const imageUrl = '//nos.netease.com/ysf/3df2280d2319678a091138b0bbba82fe'
            const params = {
              src: imageUrl,
              alt: 'image alt',
              title: 'image title',
              width: 200,
              height: 100,
              'data-test': 'test'
            }
            callback(params)
            this.loading = false
          }, 1000)
        }
      },
      demo8: {
        customDropImage: (files, callback) => {
          // 排除非图片类型的文件
          const imgFiles = [].filter.call(files, (file) => {
            return (file.type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp|vnd\.microsoft\.icon)/i))
          })

          if (!(imgFiles && imgFiles.length)) return

          this.loading = true

          ;[].forEach.call(imgFiles, (file, index) => {
            // 模拟上传图片至服务器并设置图片URL的异步过程
            setTimeout(() => {
              const imageUrl = '//nos.netease.com/ysf/3df2280d2319678a091138b0bbba82fe'
              const params = {
                src: imageUrl,
                alt: 'image alt',
                title: 'image title' + index,
                width: 200,
                height: 100,
                'data-test': 'test'
              }
              callback(params)

              if (index === (imgFiles.length - 1)) {
                this.loading = false
              }
            }, 1000)
          })
        }
      },
      demo9: {
        customInsertVideo: (callback) => {
          this.loading = true

          // 模拟上传视频获取URL的异步过程
          setTimeout(() => {
            const params = {
              src: 'https://www.runoob.com/try/demo_source/mov_bbb.mp4',
              'data-test': 'test'
            }
            callback(params)
            this.loading = false
          }, 1000)
        }
      },
      demo10: {
        customInsertAttachment: (callback) => {
          this.loading = true

          // 模拟上传文件至服务器并设置URL的异步过程
          setTimeout(() => {
            const files = [{
              name: '普通文件.doc',
              type: 'other',
              url: '//nos.netease.com/ysf/3df2280d2319678a091138b0bbba82fe'
            }, {
              name: '普通文件.pdf',
              type: 'other',
              url: '//nos.netease.com/ysf/3df2280d2319678a091138b0bbba82fe'
            }, {
              name: '图片文件.jpg',
              type: 'image',
              url: '//nos.netease.com/ysf/3df2280d2319678a091138b0bbba82fe'
            }, {
              name: '视频文件.mp4',
              type: 'video',
              url: '//nos.netease.com/ysf/3df2280d2319678a091138b0bbba82fe'
            }, {
              name: '普通文件.txt',
              type: 'other',
              url: '//nos.netease.com/ysf/3df2280d2319678a091138b0bbba82fe'
            }]
            callback(files)

            this.loading = false
          }, 1000)
        }
      },
      demo11: {
        editor: null
      },
      demo12: {
        content:
          '<p>它的设计原则是<span style="color: rgb(204, 51, 229);">简洁、直接、</span><strong style="color: rgb(204, 51, 229);"><u>优雅和</u></strong><strong><u>适应性。</u></strong></p><p><br></p><p>欢迎使用<img height="24" width="24" src="//qiyukf.com/sdk/res/portrait/emoji/new_emoji_25.png" alt="[玫瑰]" data-type="defaultEmoji" data-id="emoticon_emoji_132" class="portrait_icon"></p>'
      },
      demo13: {
        editor: null,
        content:
          '<span class="mention" data-index="3" data-denotation-char="@" data-id="3" data-value="Thomas Muller">﻿<span contenteditable="false"><span class="ql-mention-denotation-char">@</span>Thomas Muller</span>﻿</span>',
        options: {
          modules: {
            mention: {
              allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
              mentionDenotationChars: ['@', '#'],
              positioningStrategy: 'fixed',
              renderItem: (data) => {
                if (data.disabled) {
                  return `<div style="height:24px;line-height:24px;font-size:10px;background-color:#ccc;margin:0 -20px;padding:4px">${data.value}</div>`
                }
                return data.value
              },
              renderLoading: () => {
                return 'Loading...'
              },
              source: function (searchTerm, renderList, mentionChar) {
                let matches = []

                if (searchTerm.length === 0) {
                  matches = advancedValues
                } else {
                  for (let i = 0; i < advancedValues.length; i++) {
                    if (~advancedValues[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())) {
                      matches.push(advancedValues[i])
                    }
                  }
                }

                // create group header items
                const matchesWithGroupHeaders = []
                let currentTeam
                for (let i = 0; i < matches.length; i++) {
                  const match = matches[i]
                  if (currentTeam !== match.team) {
                    matchesWithGroupHeaders.push({
                      id: match.team,
                      value: match.team,
                      disabled: true
                    })
                    currentTeam = match.team
                  }
                  matchesWithGroupHeaders.push(match)
                }
                matches = matchesWithGroupHeaders
                renderList(matches, searchTerm)
              }
            }
          }
        }
      }
    }
  },
  methods: {
    editorInit (editor) {
      this.demo11.editor = editor
      console.log(editor)
    },
    handleInsertText () {
      const quill = this.demo11.editor
      if (!quill) return

      const range = quill.getSelection()

      if (!range) {
        message.warning('编辑器处于未聚焦状态')
        return
      }

      if (range.length > 0) {
        quill.deleteText(range.index, range.length)
      }

      quill.insertText(range.index, '【自定义文本】', {
        customAttr: { editable: false }
      })
    },
    demo13Init (editor) {
      this.demo13.editor = editor
    },
    showMenu () {
      this.demo13.editor.getModule('mention').openMenu('@')
    },
    addMention () {
      this.demo13.editor.getModule('mention').insertItem(
        {
          denotationChar: '@',
          id: '123abc',
          value: 'Hello World'
        },
        true
      )
    }
  }
}
</script>
