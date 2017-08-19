'use babel';
/* global describe, beforeEach, it, expect */

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('linter-ui-hinted', function () {

  let activationPromise
  let pack

  beforeEach(() => {
    activationPromise = atom.packages.activatePackage('linter-ui-hinted')
  })

  describe('packMain', () => {

      it('activates successfully', () => {
      waitsForPromise(() => {
        return activationPromise;
      });
      runs(() => {
        pack = atom.packages.getActivePackage('linter-ui-hinted')
          console.log(pack)
          expect(pack).toExist()
      })
      });

      it('has the provideLinterUI method', () => {
        expect(pack.provideLinterUI).toExist()
      });

      it('provides the MessageDelegate instance on provideLinterUI call', () => {
        const manager = pack.mainModule.provideLinterUi()
        expect(manager.constructor.name).toEqual('MessageDelegate')
        // jasmine.attachToDOM(workspaceElement);
        // expect(workspaceElement.querySelector('.linter-ui-docks')).not.toExist();
        // This is an activation event, triggering it causes the package to be
        // activated.
        // atom.commands.dispatch(workspaceElement, 'linter-ui-docks:toggle');
        // waitsForPromise(() => {
        //   return activationPromise;
        // });
        //
        // runs(() => {
        //   // Now we can test for view visibility
        //   let linterUiDocksElement = workspaceElement.querySelector('.linter-ui-docks');
        //   expect(linterUiDocksElement).toBeVisible();
        //   atom.commands.dispatch(workspaceElement, 'linter-ui-docks:toggle');
        //   expect(linterUiDocksElement).not.toBeVisible();
        // });
      });
    });
});
