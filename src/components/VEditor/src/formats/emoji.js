import Quill from 'quill'

const Embed = Quill.import('blots/embed')

class EmojiBlot extends Embed {
  static create (value) {
    const node = super.create()
    console.log(value)
    if (value.type === 'defaultEmoji') {
      node.setAttribute('class', 'portrait_icon')
      node.setAttribute('data-id', value.id)
    } else if (value.type === 'customEmoji') {
      node.setAttribute('class', 'custom_icon')
    }

    node.setAttribute('data-type', value.type)
    node.setAttribute('alt', value.alt)
    node.setAttribute('src', value.src)
    node.setAttribute('width', value.width)
    node.setAttribute('height', value.height)
    return node
  }

  static formats (node) {
    return {
      id: node.getAttribute('data-id'),
      type: node.getAttribute('data-type'),
      alt: node.getAttribute('alt'),
      src: node.getAttribute('src'),
      width: node.getAttribute('width'),
      height: node.getAttribute('height')
    }
  }

  static value (node) {
    return {
      id: node.getAttribute('data-id'),
      type: node.getAttribute('data-type'),
      alt: node.getAttribute('alt'),
      src: node.getAttribute('src'),
      width: node.getAttribute('width'),
      height: node.getAttribute('height')
    }
  }
}

EmojiBlot.blotName = 'emoji'
EmojiBlot.tagName = 'img'

export default EmojiBlot
