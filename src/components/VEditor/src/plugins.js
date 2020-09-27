import Quill from './quill'
import CustomSizeBlot from './formats/size.js'
import EmojiBlot from './formats/emoji.js'
import LinkBlot from './formats/link.js'
import ImageBlot from './formats/image.js'
import VideoBlot from './formats/video.js'
import ImageDrop from './modules/imageDrop.js'
import FileDrop from './modules/fileDrop.js'
import MentionBlot from './formats/mention'
import Mention from './modules/mention'
import './formats/lineHeight'

Quill.register(EmojiBlot)
Quill.register(LinkBlot)
Quill.register(ImageBlot)
Quill.register(CustomSizeBlot)
Quill.register(VideoBlot)
Quill.register(MentionBlot)
Quill.register('modules/imageDrop', ImageDrop, true)
Quill.register('modules/fileDrop', FileDrop, true)
Quill.register('modules/mention', Mention)
