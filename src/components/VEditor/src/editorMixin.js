/* eslint quotes:0 */
import Quill from './quill'

export default {
  methods: {
    hookEditor: function (editor) {
      // Expose the editor on change events via a weaker,
      // unprivileged proxy object that does not allow
      // accidentally modifying editor state.
      const unprivilegedEditor = this.makeUnprivilegedEditor(editor)

      this.handleTextChange = function (delta, oldDelta, source) {
        if (this.onEditorChangeText) {
          this.onEditorChangeText(
            editor.root.innerHTML, delta, source,
            unprivilegedEditor
          )
        }
      }.bind(this)

      this.handleSelectionChange = function (range, oldRange, source) {
        if (this.onEditorChangeSelection) {
          console.log('1111111111')
          this.onEditorChangeSelection(
            range, source,
            unprivilegedEditor
          )
        }
      }.bind(this)

      this.handleEditorChange = function (eventType, rangeOrDelta, oldRangeOrOldDelta, source) {
        if (eventType === Quill.events.SELECTION_CHANGE) {
          console.log('+++++++')
          this.handleSelectionChange(rangeOrDelta, oldRangeOrOldDelta, source)
        }

        if (eventType === Quill.events.TEXT_CHANGE) {
          this.handleTextChange(rangeOrDelta, oldRangeOrOldDelta, source)
        }
      }.bind(this)

      editor.on('editor-change', this.handleEditorChange)
    },

    unhookEditor: function (editor) {
      editor.off('editor-change')
    },

    setEditorReadOnly: function (editor, value) {
      value ? editor.disable() : editor.enable()
    },

    /*
    Replace the contents of the editor, but keep
    the previous selection hanging around so that
    the cursor won't move.
    */
    setEditorContents: function (editor, value) {
      const sel = editor.getSelection()

      if (typeof value === 'string') {
        editor.setContents(editor.clipboard.convert(value))
      } else {
        editor.setContents(value)
      }

      if (sel && editor.hasFocus()) this.setEditorSelection(editor, sel)
    },

    setEditorSelection: function (editor, range) {
      if (range) {
        // Validate bounds before applying.
        const length = editor.getLength()
        range.index = Math.max(0, Math.min(range.index, length - 1))
        range.length = Math.max(0, Math.min(range.length, (length - 1) - range.index))
      }
      editor.setSelection(range)
    },

    setEditorTabIndex: function (editor, tabIndex) {
      if (editor.editor && editor.editor.scroll && editor.editor.scroll.domNode) {
        editor.editor.scroll.domNode.tabIndex = tabIndex
      }
    },

    /*
    Returns an weaker, unprivileged proxy object that only
    exposes read-only accessors found on the editor instance,
    without any state-modificating methods.
    */
    makeUnprivilegedEditor: function (editor) {
      const e = editor; const _this = this
      return {
        getLength: function () { return e.getLength.apply(e, arguments) },
        getText: function () { return e.getText.apply(e, arguments) },
        getHTML: function () { return _this.formatOutputHTML(e.root.innerHTML) },
        getRawHTML: function () { return e.root.innerHTML },
        getContents: function () { return e.getContents.apply(e, arguments) },
        getSelection: function () { return e.getSelection.apply(e, arguments) },
        getBounds: function () { return e.getBounds.apply(e, arguments) },
        isEmptyContents: function () { return _this.isEmptyContents(e) }
      }
    },
    formatOutputHTML (value) {
      if (!value) return value
      // 移除HTML标签上的contenteditable属性
      return value.replace(/(<[^&<>]+)(contenteditable\s*=\s*['"]\w*['"])([^&<>]*>)/gi, '$1$3')
    },
    /* 检查输入的内容是否全部为空字符（空格、回车符、制表符） */
    isEmptyContents (editor) {
      const delta = editor.getContents()
      if (delta && delta.ops && Array.isArray(delta.ops)) {
        for (let i = 0; i < delta.ops.length; i++) {
          const obj = delta.ops[i]
          // eslint-disable-next-line no-prototype-builtins
          if (!obj.hasOwnProperty('insert')) return false

          // 设置了项目符号时判为非空
          // eslint-disable-next-line no-prototype-builtins
          if (obj.hasOwnProperty('attributes')) {
            const attrs = obj.attributes || {}; const list = attrs.list
            if (list) return false
          }

          // 输入内容包含非空字符时判为非空
          const insert = obj.insert
          if (typeof insert !== 'string') return false

          const insertChars = [...insert]
          if (!insertChars.length) continue

          const notEmpty = insertChars.some((val) => {
            return val !== '' && val !== ' ' && val !== '\t' && val !== '\n' && val !== '\ufeff'
          })
          if (notEmpty) return false
        }
        return true
      }
      return false
    }
  }
}
