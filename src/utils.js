'use babel'
import AnnotatedRange from './views/AnnotatedRange'

export function getCurrentEditor () {
  return atom.workspace.getActiveTextEditor()
}

export function getHeadForCurrentEditor () {
  return getHead(getCurrentEditor())
}

export function getHead (editor) {
  if (!editor)
    return null
  return editor.getCursorBufferPosition()
  // let { marker } = editor.getLastCursor()
  // return marker ? marker.getHeadBufferPosition() : null
}

export function getAnnotatedRanges (textEditor) {
  return textEditor.findMarkers({ type: AnnotatedRange.type })
}

export function getPathForMessage (message = {}) {
  let { location, filePath } = message
  if (location)
    return location.file
  else if (filePath)
    return filePath
  else
    return ''
}

export function filterMessagesByEditor (editor, ...messages) {
  const messageInEditor = message  => getPathForMessage(message) === path
  let path     = editor ? editor.getPath() : null
  return messages.filter(messageInEditor)
}

export function editorIsVisible (editor) {
  if (editor.isDestroyed())
    return false
  let { display } = getComputedStyle(editor.getElement())
  return display !== 'none'
}


// function provideOverlayToActiveEditor (editor) {
//
// }


// const linterURI = uri => 0 === 'linter://'.indexOf(uri)


// function registerOpener (viewClass) {
//   let op = function(uri) {
//     if (linterURI(uri))
//       return new viewClass(uri)
//   }
//
//   return atom.workspace.addOpener(op)
// }
//
//
// /**
//  * Registers a new view provider to the global view registry. Also assigns
//  *
//  * @method registerViewProvider
//  *
//  * @param  {constructor}             model A class for the model that a view is registered for
//  * @param  {constructor}             view  Bound view's constructor
//  *
//  * @return {Disposable}             A disposable for the registered view provder
//  */
//
//  function registerViewProvider (model, view) {
//
//   if (!(view.item &&
//         view.getItem ||
//        (view.prototype && view.prototype.getItem)))
//     throw new Error("The view " + view.name + " should implement a getItem method")
//
//   model.prototype.getElement = function () {
//     if (this.element)
//       return this.element
//   }
//
//   const provideView = (/*obj*/) => {
//     return new view()
//     // let v          = new view()
//     // v.model        = obj
//     // obj.view       = v
//     // return typeof v.getItem === 'function' ? v.getItem() : v.item
//   }
//
//   return atom.views.addViewProvider(model, provideView)
// }
