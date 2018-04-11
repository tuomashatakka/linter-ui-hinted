'use babel'
// @flow

import { Range, TextEditor } from 'atom'

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

    this.marker = textEditor.markBufferRange(this.position, this.properties)

    if (!this.marker)
      throw new TypeError(`Could not resolve a marker for the current cursor position while creating a new AnnotatedRange`)

    this.decoration = textEditor.decorateMarker(this.marker, this.decor)
    this.subscription = textEditor.onDidDestroy(() => this.destroy())
    // this.activeItemChangeSubscription = atom.workspace.onDidChangeActivePaneItem(() => this.destroy())
  }

  get position () {
    let { range, location } = this.message
    if (location && location.position)
      return location.position
    if (range)
      return range
    return new Range([0, 0], [1, 0])
  }

  get properties () {
    return {
      invalidate: 'never',
      type: AnnotatedRange.type,
      ...this.message
    }
  }

  get type () {
    let type = this.message.severity || this.message.type || 'error'
    return type.toLowerCase()
  }

  get decor () {
    return {
      type:  AnnotatedRange.decorations.type,
      class: [ AnnotatedRange.decorations.class, this.type ].join(' ')
    }
  }

  destroy () {
    this.marker.destroy()
    this.decoration.destroy()
    this.subscription.dispose()
  }

}
