'use babel'

import Component from './LinterDockItemComponent'
import autobind from 'autobind-decorator'
import { CompositeDisposable, Disposable, Emitter } from 'atom'
import { raise } from './utils'

const ON = {
  BEGIN:  'lint-start',
  UPDATE: 'lint-update',
  FINISH: 'lint-end',
  REDRAW: 'redraw',
}


const decoration = {
  type: 'highlight',
  class: 'lint-annotation error',
  onlyNonEmpty: true,
}

export default class LinterGUI {

  static DEFAULT_LOCATION = 'right'

  constructor () {

    this.emitter       = new Emitter()
    this.subscriptions = new CompositeDisposable()

    let observe = observeEditor(editor => this.dispatch(ON.REDRAW, editor))
    let setup   = editor => createMarkerLayer.call(this, editor)

    this.subscriptions.add(observe)
    this.onRedraw(setup)
  }

  destroy () {
    this.subscriptions.dispose()
  }

  dispose () {
    this.destroy()
  }

  get name () {
    return 'Linter Trace Annotations UI'
  }

  on        = (eventName, handler) => this.subscriptions.add(this.emitter.on(eventName, (...args) => handler.call(this, ...args)))
  onRedraw  = (callback) => this.on(ON.REDRAW, data => callback(data))
  onUpdate  = (callback) => this.on(ON.UPDATE, data => callback(data))
  onStart   = (callback) => this.on(ON.BEGIN, ({ linter, path }) => callback(path, linter))
  onEnd     = (callback) => this.on(ON.FINISH, ({ linter, path }) => callback(path, linter))

  requestUpdate = (scope, linter) => this.update({ scope, linter })

  @autobind
  update (changes={ added: 0, removed: 0, messages: 0 }) {
    if (changes.added || changes.messages || changes.removed)
      this.dispatch(ON.UPDATE, changes)
  }

  @autobind
  didBeginLinting (linter, path) {
    this.dispatch(ON.BEGIN, { linter, path })
  }

  @autobind
  didFinishLinting (linter, path) {
    this.requestUpdate(path || 'global', linter)
    this.dispatch(ON.FINISH, { linter, path })
  }

  @autobind
  render (props) {
    this.update(props)
  }

  dispatch = (event, data={}) => event ? this.emitter.emit(event, data) : raise(`Trying to dispatch an event without a name, {{data}}`, { data })

}

let layer

function observeEditor (delegate) {
  return atom.workspace.observeActiveTextEditor(editor => delegate(editor))
}

function createMarkerLayer (editor) {
  console.info(this, ...arguments)

  if (layer && !layer.destroyed)
    layer.destroy()

  layer = editor.addMarkerLayer()
  layer.onDidDestroy(clearLayerMarkers)
  editor.decorateMarkerLayer(layer, decoration)
  this.onUpdate(({ messages=[]}) => annotate(editor, layer, ...messages))
}

function annotate (editor, layer, ...messages) {

  clearLayerMarkers(layer)

  for (let message of messages) {
    let rn = rangeForMessage(message)
    let marker = layer.markBufferRange(rn, { ...message })
    let decor = { ...decoration, class: message.severity }
    editor.decorateMarker(marker, decor)
    console.info(marker, decor)
  }

  console.info(layer.getMarkers())

}


function clearLayerMarkers (layer) {
  if (layer && !layer.destroyed)
    layer.getMarkers().forEach(marker => marker.destroy())
}


function rangeForMessage (message) {
  return message.location.position
}
