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
