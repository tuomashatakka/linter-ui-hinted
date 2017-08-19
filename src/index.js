'use babel'

import { CompositeDisposable, Disposable } from 'atom'
import MessageDelegate from './MessageDelegate'

let manager

let removeLayer = () => new Disposable(() => manager ? manager.destroy() : null)

export default {

  subscriptions: null,

  config: require('./configuration.json'),

  activate () {
    // TODO: Register view providers for annotation views
    // this.subscriptions.add(registerOpener(AnnotationOverlay))
    // this.subscriptions.add(registerViewProvider(AnnotationOverlay, LinterGUIView))
    const packageName = require('../package.json').name

    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.config.observe(`${packageName}.style`, setHighlightStyling))
  },

  deactivate () {
    this.subscriptions.dispose()
  },

  provideLinterUI () {
    // TODO: Contain the highlight markers on a dedicated layer
    // let annotationsLayer = new AnnotationOverlay()

    manager = new MessageDelegate()
    this.subscriptions.add(removeLayer())
    return manager
  }

}

function setHighlightStyling (style) {
  document.body.setAttribute('highlight-style', style)
}
