'use babel'

import { TextEditor } from 'atom'

export default class AnnotatedRange {

  static type = 'annotation'

  static getDecorations ({ severity }) {
    return {
      type: 'highlight',
      class: 'lint-annotation ' + severity,
      // onlyNonEmpty: true,
    }
  }

  constructor (textEditor, props={}) {
    this.message = props

    if (!(textEditor instanceof TextEditor))
      throw new ReferenceError(`AnnotatedRange's constructor must be called with a TextEditor instance as its first argument`)

    // let layer  = this.getLayer(textEditor)
    // let marker = layer.markBufferRange(range, { ...message })
    let range   = this.properties.location.position
    let decals  = AnnotatedRange.getDecorations(this.properties)
    this.marker = textEditor.markBufferRange(range, this.properties)

    if (!this.marker)
      throw new TypeError(`Could not resolve a marker for the current cursor position while creating a new AnnotatedRange`)

    this.decoration = textEditor.decorateMarker(this.marker, decals)
    // this.activeItemChangeSubscription = atom.workspace.onDidChangeActivePaneItem(() => this.destroy())
    this.activeItemChangeSubscription = textEditor.onDidChangePath(() => this.destroy())
  }

  get properties () {
    return {
      invalidate: 'never',
      type: AnnotatedRange.type,
      ...this.message
    }
  }

  destroy () {
    this.marker.destroy()
    this.activeItemChangeSubscription.dispose()
  }

}
