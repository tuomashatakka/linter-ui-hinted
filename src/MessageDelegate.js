'use babel'
import autobind from 'autobind-decorator'
import AnnotatedRange from './views/AnnotatedRange'
import AnnotationMarker from './views/AnnotationMarker'
import LinterEventsInterface from './LinterEventsInterface'


function contains (haystack, needle) {
  return haystack.find(item => item.key === needle.key) ? true : false
}


export default class MessageDelegate extends LinterEventsInterface {

  static DECORATION = {
    type: 'highlight',
    class: 'lint-annotation',
    onlyNonEmpty: true,
  }

  constructor () {
    super()
    this.overlay = null
    this.annotations = []

    let activeEditorSubscription = atom.workspace.observeActiveTextEditor(this.renderOverlay)

    this.subscriptions.add(activeEditorSubscription)
  }

  getAnnotationByMessage (message) {
    let annotation = this.annotations.find(annotation =>
      annotation.message.key === message.key)
    return annotation
  }

  clearAnnotationForMessage (message) {
    let annotation = this.getAnnotationByMessage(message)
    if (annotation)
      annotation.destroy()
  }

  /**
   * Render a popup overlay in the active text editor.
   * The details for a linter message are displayed on
   * the rendered overlay whenever the cursor is on any
   * error.
   * @method renderOverlay
   */

  @autobind
  renderOverlay (editor) {
    if (this.overlay)
      this.overlay.destroy()

    if (!editor)
      return

    this.overlay = new AnnotationMarker(editor)
    this.renderMessages(...this.getMessagesRelatedTo(editor))
  }

  /**
   * Render the given messages into the given editor, or the
   * current editor if no editor instance is given
   * @method renderMessages
   * @param  {TextEditor} editor   Editor into which the highlight markers
   *                               should be displayed in
   * @param  {Array}      messages A list of messages that will be rendered.
   *                               If no messages are provided, relatedMessages
   *                               are used
   */

  renderMessages (...messages) {
    let editor = this.editor

    this.annotations.forEach(annotation =>
      annotation.destroy())

    for (let message of messages) {
      // this.clearAnnotationForMessage(message)
      let marker = new AnnotatedRange(editor, message)
      this.annotations.push(marker)
    }
  }

  /**
   * Remove highlight markers
   * @method removeMarkers
   * @param  {Array}      keys An array of keys of the messages that should be
   *                           deleted
   */

  removeMarkers (...keys) {
    for (let annotation of this.annotations) {
      if (!keys.length || keys.indexOf(annotation.message.key) > -1)
        annotation.destroy()
    }
  }

}

  // /**
  //  * Starts listening
  //  * @method applyOverlayListener
  //  * @param  {TextEditor} editor The target TextEditor instance
  //  */
  //
  // @autobind
  // applyOverlayListener (editor) {
  //   this._editor = editor
  //
  //   let layer    = this.getLayer(editor)
  //   if (!layer)
  //     return
  //
  //   let handler = ({ selection }) => {
  //     if (editor.element.style.display === 'none')
  //       return
  //     let markers = layer.getMarkers()
  //     let intersects = range =>
  //       selection.intersectsBufferRange(range)
  //     let active = markers.find(marker =>
  //       intersects(marker.getBufferRange()))
  //     return active ?
  //       this.showDetails(active.getProperties()) :
  //       this.hideDetails()
  //   }
  //
  //   if (this.selectionObserve)
  //     this.selectionObserve.dispose()
  //   this.selectionObserve = editor.onDidChangeSelectionRange(handler)
  //   // this.subscriptions.add(subscription)
  //   // layer.onDidDestroy(subscription.dispose)
  // }
  //
  // setCurrentEditor (editor) {
  //   if (this.annotationsLayer)
  //     this.annotationsLayer.destroy()
  //   this._current = editor || atom.workspace.getActiveTextEditor()
  // }
  //
  // clearLayerMarkers (layer) {
  //   if (!layer && this.editor)
  //       layer = this.editor.linterAnnotationsLayer
  //
  //   if (layer && !layer.destroyed)
  //     layer.getMarkers()
  //       .filter(marker => !marker.destroyed)
  //       .forEach(marker => marker.destroy())
  // }
  //
  // mark (message, editor) {
  //   let range  = message.location.position
  //   let layer  = this.getLayer(editor)
  //   let marker = layer.markBufferRange(range, { ...message })
  //   let decor  = {
  //     type: 'highlight',
  //     class: 'lint-annotation ' + message.severity,
  //     onlyNonEmpty: true,
  //   }
  //   editor.decorateMarker(marker, decor)
  // }
  //
  // showDetails (message) {
  //   this.hideDetails()
  //   this.detailsOverlay = new AnnotationMarker(this.editor, message)
  //   // if (!editor)
  //   //   return
  //   //
  //   // let content = `
  //   //   <strong>${severity}</strong>
  //   //   ${excerpt}`
  //   //
  //   // let overlayElement = document.createElement('div')
  //   // overlayElement.classList.add('message', severity)
  //   // overlayElement.innerHTML = content
  //   //
  //   // let cursor = editor.getLastCursor()
  //   // let marker = assertMarker(cursor)
  //   // if (!marker)
  //   //   return
  //   //
  //   // let decor  = {
  //   //   type:  'overlay',
  //   //   item:  overlayElement,
  //   //   class: 'lint-annotation-overlay'
  //   // }
  //   // let decoration = editor.decorateMarker(marker, decor)
  // }
  //
  // hideDetails () {
  //   if (this.detailsOverlay)
  //     this.detailsOverlay.destroy()
  // }
  //
  // getLayer (editor) {
  //
  //   if (!this._current)
  //     return
  //
  //   if (!this.annotationsLayer)
  //     this.applyLayer(editor)
  //   return editor.linterAnnotationsLayer
  // }
  //
  // applyLayer (editor) {
  //
  //   if (typeof editor === 'string')
  //     getEditorForPath(name)
  //
  //   if (editor && (!this.annotationsLayer || this.annotationsLayer.destroyed)) {
  //    let layer = editor.addMarkerLayer()
  //    editor.decorateMarkerLayer(layer, this.constructor.DECORATION)
  //    this.annotationsLayer = layer
  //   }
  // }
  //
  // update ({ messages }) {
  //   if (!messages)
  //     messages = []
  //   this.messages = messages.filter(msg => msg.location.file )
  //   this.clearLayerMarkers()
  //   let messagesByFilename = GROUP_BY.filename(messages)
  //
  //   for (let name in messagesByFilename) {
  //     let editor = getEditorForPath(name)
  //     this.applyLayer(editor)
  //     messagesByFilename[name]
  //       .forEach(msg =>
  //         this.mark(msg, editor))
  //   }
  //
  //   if (!messages.length) {
  //     // this.editor.linterAnnotationsLayer.destroy()
  //     this.clearLayerMarkers()
  //   }
  // }



// function keyFor (marker) {
//   if (marker) {
//     if (marker.getProperties)
//       return marker.getProperties().key
//     if (marker.key)
//       return marker.key
//   }
//   throw new TypeError(`keyFor called for object that is neither a linter message or a DisplayMarker instance`)
// }

// function getEditorForPath (name) {
//   let editors = atom.workspace.getTextEditors()
//   return editors.find(ed => name === ed.getPath())
// }

// function assertMarker (cursor={}) {
//   let { marker } = cursor
//   return marker
// }
//
// function getMarkerForMessage (message) {
//   let editor = atom.workspace.getActiveTextEditor()
//   if (!editor)
//     return null
//   let q = keyFor(message)
//   return editor.getMarkers().find(marker => keyFor(marker) === q)
// }

// function createTooltip (root, content) {
//   let tooltipElement   = document.createElement('div')
//   let tooltipOptions   = {
//     trigger: 'manual',
//     item:    tooltipElement,
//   }
//   tooltipElement.innerHTML = content
//
//   function getTooltip () {
//     return atom.tooltips
//       .findTooltips(root)
//       .find(tooltip => tooltip.options.item == tooltipElement)
//   }
//   return {
//     subscription: atom.tooltips.add(root, tooltipOptions),
//     item: getTooltip(),
//   }
// }


// displayTooltip (marker) {
//   let properties = marker ? marker.getProperties() : {}
//   let content    = properties ? properties.excerpt : ''
//   let editor     = atom.workspace.getActiveTextEditor()
//   let tooltip    = createTooltip(editor.element, content)
//
//   if (!tooltip)
//     return
//
//   // Hide open tooltips
//   while (this._tooltips.length) {
//     this._tooltips.pop().hide()
//   }
//
//   if (marker)
//     tooltip.item.show()
//   else
//     tooltip.item.hide()
//
//   this._tooltips.push(tooltip.item)
//   this.subscriptions.add(tooltip.subscription)
// }
