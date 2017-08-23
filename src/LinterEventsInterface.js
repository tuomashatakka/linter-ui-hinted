'use babel'
import autobind from 'autobind-decorator'

function getPathForMessage (message = {}) {
  let { location, filePath } = message
  if (location)
    return location.file
  else if (filePath)
    return filePath
  else
    return ''
}

export default class LinterEventsInterface {

  constructor () {
    this.messages = new Map()
  }

  didBeginLinting (/* linter, path */) { }
  didFinishLinting (/* linter, path */) { }

  @autobind
  render ({ messages }) {
    this.clear()
    messages.forEach(message => this.messages.set(message.key, message))
    this.renderMessages()
  }

  get name () {
    return "Linter overlay"
  }

  get editor () {
    return atom.workspace.getActiveTextEditor()
  }

  /**
   * Get the linter messages related to the currently active editor
   * @method relatedMessages
   * @return {Array} A listing of all messages referring to the active text editor
   */

  get relatedMessages () {
    const editor   = atom.workspace.getActiveTextEditor()
    const path     = editor ? editor.getPath() : null
    const messages = [...this.messages.values()]
    console.log(messages)
    const messageInActiveEditor = message  => getPathForMessage(message) === path
    return messages.filter(messageInActiveEditor)
  }

  /**
   * Remove all messages
   * @method clear
   */

   @autobind
  clear () {
    this.messages.clear()
  }

  @autobind
  dispose () {
    this.subscriptions.dispose()
  }

  @autobind
  destroy () {
    this.dispose()
  }
}
