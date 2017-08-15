'use babel'

import { TextEditor } from 'atom'
import AnnotatedRange from './AnnotatedRange'

export default class AnnotationMarker {

  static getContent = getOverlayTemplate
  static decorations = {
    class: 'lint-annotation-overlay',
    type:  'overlay',
  }


  constructor (textEditor) {

    if (!(textEditor instanceof TextEditor))
      throw new ReferenceError(`AnnotationMarker's constructor must be called with a TextEditor instance as its first argument`)

    this.editor = textEditor
    // this.activeItemChangeSubscription = atom.workspace.onDidChangeActivePaneItem(() => this.destroy())
    this.activeItemChangeSubscription = this.editor.onDidChangePath(() => this.destroy())
    this.selectionChangeSubscription  = this.editor.onDidChangeSelectionRange(({ selection }) => this.didChangeSelection(selection))
  }

  didChangeSelection (selection) {
    let intersects = marker => selection.intersectsBufferRange(marker.getBufferRange())
    let marker     = getAnnotatedRanges(this.editor).find(intersects)

    if (marker)
      this.show(marker.getProperties())
    else
      this.hide()
  }

  decorateEditor () {
    if (this.marker)
      this.marker.destroy()

    let decals   = AnnotationMarker.decorations
    let position = getHead(this.editor)

    if (!position)
      throw new TypeError(`Could not resolve a marker for the current cursor position while creating a new AnnotationMarker`)

    decals.item     = this.item
    this.marker     = this.editor.markBufferPosition(position, { invalidate: 'touch' })
    this.decoration = this.editor.decorateMarker(this.marker, decals)
  }

  show (message) {
    this.decorateEditor()
    this.item.setAttribute('class', 'message ' + message.severity)
    this.item.innerHTML = AnnotationMarker.getContent(message)
  }

  hide () {
    // this.item.innerHTML = ""
    this.item.classList.add('hidden')
  }

  destroy () {
    if (this.marker)
      this.marker.destroy()
    this.activeItemChangeSubscription.dispose()
    this.selectionChangeSubscription.dispose()
  }

  get item () {
    if (!this._item)
      this._item = document.createElement('div')
    return this._item
  }
}


function getOverlayTemplate ({ severity, excerpt }) {
  return `
    <h4 class='severity'>${severity}</h4>
    <article class='excerpt'>${excerpt}</article>`
}

function getHead (editor) {
  if (!editor)
    return null
  let { marker } = editor.getLastCursor()
  return marker ? marker.getHeadBufferPosition() : null
}

export function getAnnotatedRanges (textEditor) {
  return textEditor.findMarkers({ type: AnnotatedRange.type })
}
