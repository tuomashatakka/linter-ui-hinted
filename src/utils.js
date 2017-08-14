'use babel'

export function raise (message='', vars={}, ...flags) {
  const replacer = (src, name) => {
    let assign = ''
    if (name in vars)
      assign = vars[name]
    try { assign = JSON.stringify(assign, null, 2) }
    catch (e) { atom.notifications.addFatalError('Could not throw an Error') }
    return assign
  }

  if ('exit' in flags)
    process.exit(1)

  else
    throw new Error(message.replace(/\{\{\s*(\w+)\s*\}\}/img, replacer))
}
