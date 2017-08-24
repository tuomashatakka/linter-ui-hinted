'use babel'

import { TextEditor, CompositeDisposable } from 'atom'
import { getAnnotatedRanges, getHead, editorIsVisible } from '../utils'


function destroyInactive (item) {
  if (item != this.editor || editorIsVisible(this.editor))
    return
  this.destroy()
}


function getOverlayTemplate ({ severity, excerpt }) {
  return `
    <h4 class='severity'>${severity}</h4>
    <article class='excerpt'>${excerpt}</article>`
}


export default class AnnotationMarker {

  static getContent = getOverlayTemplate

  static decorations = {
    class: 'lint-annotation-overlay',
    type:  'overlay',
  }

  constructor (textEditor) {

    if (!(textEditor instanceof TextEditor))
      throw new ReferenceError(`AnnotationMarker's constructor must be called with a TextEditor instance as its first argument`)

    const boundDidChangeSelection = ({ selection }) => this.didChangeSelection(selection)
    const boundDestroyInactive    = destroyInactive.bind(this)
    const subscriptions = [
      textEditor.onDidChangeSelectionRange(boundDidChangeSelection),
      atom.workspace.onDidChangeActivePaneItem(boundDestroyInactive),
      // this.editor.onDidChangePath(() => this.destroy()),
    ]

    this.editor = textEditor
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(...subscriptions)
  }

  didChangeSelection (selection) {
    let intersects = marker => selection.intersectsBufferRange(marker.getBufferRange())
    let marker     = getAnnotatedRanges(this.editor).find(intersects)

    if (marker)
      this.show(marker.getProperties())
    else
      this.hide()
  }

  decorateEditor (editor) {
    if (this.marker)
      this.marker.destroy()

    let position = getHead(editor)
    if (!position)
      throw new TypeError(`Could not resolve a marker for the current cursor position while creating a new AnnotationMarker`)

    let decals  = { ...AnnotationMarker.decorations, item: this.item }
    this.marker = this.editor.markBufferPosition(position, { invalidate: 'touch' })
    this.editor.decorateMarker(this.marker, decals)
  }

  show (message) {
    if (!message)
      return
    this.decorateEditor(this.editor)
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
    this.subscriptions.dispose()
  }

  get item () {
    if (!this._item)
      this._item = document.createElement('div')
    return this._item
  }
}
