'use babel'
import autobind from 'autobind-decorator'
import AnnotatedRange from './views/AnnotatedRange'
import AnnotationMarker from './views/AnnotationMarker'

export default class LinterEventsInterface {

  constructor () {
    this.messages = new Map()
    this.annotations = []
    this.overlay = null

    atom.workspace.observeActiveTextEditor(this.renderOverlay)
  }

  didBeginLinting (/* linter, path */) { }
  didFinishLinting (/* linter, path */) { }

  @autobind
  render ({ messages }) {
    this.clear()
    messages.forEach(message => this.messages.set(message.key, message))
    this.renderMarkers()
  }

  get relatedMessages () {
    const editor   = atom.workspace.getActiveTextEditor()
    const path     = editor ? editor.getPath() : null
    const messages = [...this.messages.values()]
    const messageInActiveEditor = message  => path && message.location.file === path
    return messages.filter(messageInActiveEditor)
  }

  @autobind
  renderOverlay (editor) {
    if (this.overlay)
      this.overlay.destroy()
    this.overlay = new AnnotationMarker(editor)
    this.renderMarkers()
  }

  removeMarkers (...keys) {
    for (let annotation of this.annotations) {
      if (keys.indexOf(annotation.message.key) > -1)
        annotation.destroy()
    }
  }

  renderMarkers (...messages) {

    const editor = atom.workspace.getActiveTextEditor()

    if (messages.length === 0)
      messages = this.relatedMessages

    this.annotations.forEach(annotation =>
      annotation.destroy())

    for (let message of messages) {
      let marker = new AnnotatedRange(editor, message)
      this.annotations.push(marker)
    }
  }

  clear () {
    this.messages.clear()
  }
}
