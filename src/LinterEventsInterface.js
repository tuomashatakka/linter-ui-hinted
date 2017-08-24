'use babel'
import autobind from 'autobind-decorator'
import { CompositeDisposable } from 'atom'
import { filterMessagesByEditor } from './utils'

export default class LinterEventsInterface {

  constructor () {
    this.messages = new Map()
    this.subscriptions = new CompositeDisposable()
  }

  @autobind
  registerMessage (message) {
    this.messages.set(message.key, message)
  }

  @autobind
  render ({ messages }) {
    // Clear the old messages
    this.clear()

    // Cache the new results
    messages.forEach(this.registerMessage)

    // Render all messages
    this.renderMessages(...this.relatedMessages)
  }

  /**
   * Get the linter messages related to the given editor
   * @method getMessagesRelatedTo
   * @return {Array} A listing of all messages referring to the editor
   */

  getMessagesRelatedTo (editor) {
    return filterMessagesByEditor(editor, ...this.messages.values())
  }

  /**
   * Get the linter messages related to the currently active editor
   * @method relatedMessages
   * @return {Array} A listing of all messages referring to the active text editor
   */

  get relatedMessages () {
  return this.getMessagesRelatedTo(this.editor)
  }

  get editor () {
    return atom.workspace.getActiveTextEditor()
  }

  get name () {
    return "Linter overlay"
  }

  /**
   * Remove all messages
   * @method clear
   */

   @autobind
  clear (editor=null) {
    if (!editor)
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

  didBeginLinting (/* linter, path */) {
  }

  didFinishLinting (/* linter, path */) {
  }

  renderMessages () {
    throw new Error("Subclasses must implement the renderMessages method")
  }

}
