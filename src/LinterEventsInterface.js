'use babel'
import autobind from 'autobind-decorator'
import AnnotatedRange from './views/AnnotatedRange'
import AnnotationMarker from './views/AnnotationMarker'

export default class LinterEventsInterface {

  constructor () {
    this.messages = new Map()
    this.annotations = []
    this.overlay = null
  }

  @autobind
  didBeginLinting (/* linter, path */) {
  }

  @autobind
  didFinishLinting (/* linter, path */) {
    // this.update({ linter, path })
  }

  @autobind
  render ({ messages }) {
    const editor = atom.workspace.getActiveTextEditor()
    const path   = editor ? editor.getPath() : null
    const addMessage = message => this.messages.set(message.key, message)
    const messageInActiveEditor = message  => path && message.location.file === path
    const relatedMessages = messages.filter(messageInActiveEditor)

    this.clear()
    this.renderMarkers(...relatedMessages)
    this.renderOverlay(editor)
    relatedMessages.map(addMessage)
  }

  clear () {
    this.annotations.forEach(annotation => annotation.destroy())
    this.messages.clear()
    if (this.overlay)
      this.overlay.destroy()
  }

  renderOverlay (editor) {
    this.overlay = new AnnotationMarker(editor)
  }

  renderMarkers (...messages) {
    for (let message of messages) {
      let marker = renderMarker(message)
      this.annotations.push(marker)
    }
  }
}

function renderMarker (annotation) {
  const editor = atom.workspace.getActiveTextEditor()
  return new AnnotatedRange(editor, annotation)
}
