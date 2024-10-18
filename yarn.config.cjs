module.exports = {
  async constraints({ Yarn }) {
    // get the root-level package.json's version
    // then update all the packages' versions

    /* The line below returns something like

    {
      cwd: '.',
      ident: '@meer-js/monorepo',
      manifest: {
        version: '6.6.7'
      …

     */
    const projectRootMonorepo = Yarn.workspace()
    const rootVersion = projectRootMonorepo.manifest.version
    
    // run through and update workspace package versions
    for (const workspace of Yarn.workspaces()) {
      // could skip the root package but who cares i guess

      workspace.set('version', rootVersion)
    }
  },
}
