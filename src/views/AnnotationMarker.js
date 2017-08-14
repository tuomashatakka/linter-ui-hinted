'use babel'

import { TextEditor } from 'atom'
import AnnotatedRange from './AnnotatedRange'

export default class AnnotationMarker {

  static decorations = {
    class: 'lint-annotation-overlay',
    type:  'overlay',
  }

  static getContent ({ severity, excerpt }) { return `<strong>${severity}</strong><p>${excerpt}</p>` }

  constructor (textEditor) {

    if (!(textEditor instanceof TextEditor))
      throw new ReferenceError(`AnnotationMarker's constructor must be called with a TextEditor instance as its first argument`)

    this.editor = textEditor
    this.activeItemChangeSubscription = atom.workspace.onDidChangeActivePaneItem(() => this.destroy())
    this.selectionChangeSubscription  = this.editor.onDidChangeSelectionRange(({ selection }) => this.didChangeSelection(selection))
    console.warn("AnnotationMarker overlay applied", this)  // eslint-disable-line
  }

  decorateEditor () {
    if (this.marker)
      this.marker.destroy()

    let decals   = AnnotationMarker.decorations
    let position = getHead(this.editor)

    if (!position)
      throw new TypeError(`Could not resolve a marker for the current cursor position while creating a new AnnotationMarker`)

    decals.item     = this.item
    this.marker     = this.editor.markBufferPosition(position)
    this.decoration = this.editor.decorateMarker(this.marker, decals)
  }

  show (message) {
    this.decorateEditor()
    this.item.setAttribute('class', 'message ' + message.severity)
    this.item.innerHTML = AnnotationMarker.getContent(message)
  }

  hide () {
    this.item.classList.add('hidden')
    this.item.innerHTML = ""
  }

  didChangeSelection (selection) {
    let intersects = marker => selection.intersectsBufferRange(marker.getBufferRange())
    let marker     = getAnnotatedRanges(this.editor).find(intersects)

    if (marker)
      this.show(marker.getProperties())
    else
      this.hide()
  }

  destroy () {
    console.warn("Destroying AnnotationMarker", this)  // eslint-disable-line
    if (this.marker)
      this.marker.destroy()
    this.activeItemChangeSubscription.dispose()
  }

  get item () {
    this._item = this._item || document.createElement('div')
    return this._item
  }

}

function getHead (editor) {
  let cursor   = editor.getLastCursor()
  let { marker } = cursor
  if (marker)
    return marker.getHeadBufferPosition()
}

function getAnnotatedRanges (textEditor) {
  return textEditor.findMarkers({ type: AnnotatedRange.type })
}
