import Quill from '../quill'
const Parchment = Quill.import('parchment')
const lineHeightList = [
  '1.0',
  '1.2',
  '1.4',
  '1.6',
  '1.8',
  '2.0',
  '2.4',
  '2.6',
  '2.8',
  '3.0',
  '4.0',
  '5.0'
]
const lineHeightConfig = {
  scope: Parchment.Scope.INLINE,
  whitelist: lineHeightList
}

const lineHeightStyle = new Parchment.Attributor.Style(
  'lineheight',
  'line-height',
  lineHeightConfig
)
Parchment.register(lineHeightStyle)

Quill.register({ 'formats/lineHeight': lineHeightStyle }, true)

export default lineHeightStyle
