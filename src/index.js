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
    const configSubscription = atom.config.observe(`${packageName}.style`, setHighlightStyling)

    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(
      configSubscription
      // registerMarkersVisibilityObserver,
      // registerOverlayVisibilityObserver,
    )
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

const registerMarkersVisibilityObserver = () => registerVisibilityObserver('markers')

function registerVisibilityObserver (name, subscription) {

  const descriptor = `linter-ui-hinted.${name}Enabled`
  return atom.config.observe(descriptor, (state) => {
    let term = state ? 'disable' : 'enable'
    if (subscription && !subscription.disposed)
      subscription.dispose()

    subscription = atom.commands.add(
      'atom-text-editor', command,
      () => atom.config.set(descriptor, state))
  })
}

let visibilitySubscriptions = new CompositeDisposable()

function reissueVisibilitySubscriptions () {
  visibilitySubscriptions.dispose()
  visibilitySubscriptions = new CompositeDisposable()
  visibilitySubscriptions.add(
    registerVisibilityToggleCommand('markers'),
    registerVisibilityToggleCommand('overlay')
  )
}

const registerVisibilityToggleCommand = name => {
  let command = `linter-ui-hinted:${name}-markers`
  return atom.commands.add('atom-text-editor', command, () => toggleVisibility(name))
}

const toggleVisibility = (name) => {
  const descriptor = `linter-ui-hinted.${name}Enabled`
  let state = atom.config.get(descriptor)
  atom.config.set(descriptor, !state)
}


function setHighlightStyling (style) {
  document.body.setAttribute('highlight-style', style)
}
