'use babel'

import { TextEditor } from 'atom'

export default class AnnotatedRange {

  static type = 'annotation'

  static decorations = {
    type: 'highlight',
    class: 'lint-annotation',
    // onlyNonEmpty: true,
  }

  constructor (textEditor, props={}) {

    // TODO: Contain the highlight markers on a dedicated layer
    // let layer  = this.getLayer(textEditor)
    // let marker = layer.markBufferRange(range, { ...message })

    this.message = props

    if (!(textEditor instanceof TextEditor))
      throw new ReferenceError(`AnnotatedRange's constructor must be called with a TextEditor instance as its first argument`)

    let range   = this.properties.location.position
    this.marker = textEditor.markBufferRange(range, this.properties)

    if (!this.marker)
      throw new TypeError(`Could not resolve a marker for the current cursor position while creating a new AnnotatedRange`)

    this.decoration = textEditor.decorateMarker(this.marker, this.decor)
    this.activeItemChangeSubscription = textEditor.onDidDestroy(() => this.destroy())
    // this.activeItemChangeSubscription = atom.workspace.onDidChangeActivePaneItem(() => this.destroy())
  }

  get properties () {
    return {
      invalidate: 'never',
      type: AnnotatedRange.type,
      ...this.message
    }
  }

  get decor () {
    return {
      type:  AnnotatedRange.decorations.type,
      class: [ AnnotatedRange.decorations.class, this.message.severity ].join(' ')
    }
  }

  destroy () {
    this.marker.destroy()
    this.decoration.destroy()
    this.activeItemChangeSubscription.dispose()
  }

}
