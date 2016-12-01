const {compact, flatten} = require('lodash')
const tally = require('count-array-values')

module.exports = {
  getTopDependencies: (repos) => {
    const names = repos.map(repo => repo.pkg.depNames)
    return tally(compact(flatten(names)), 'name', 'dependents')
  },

  getTopDevDependencies: (repos) => {
    const names = repos.map(repo => repo.pkg.devDepNames)
    return tally(compact(flatten(names)), 'name', 'devDependents')
  },

  getTopContributors: (repos) => {
    const names = repos.map(repo => repo.contributors)
    return tally(compact(flatten(names)), 'user', 'repos')
  },

  getTopPackageAuthors: (packages) => {
    const blacklist = ['paperelectron', 'electronifie']
    var names = packages
      .filter(pkg => Array.isArray(pkg.owners))
      .map(pkg => pkg.owners.map(owner => owner.name))

    names = compact(flatten(names))
      .filter(name => !blacklist.includes(name))

    return tally(names, 'handle', 'packages')
      .filter(user => user.packages > 2)
      .map(user => {
        try {
          const profile = require(`electron-npm-packages/authors/${user.handle}.json`)
          Object.assign(user, profile)
        } catch (e) {
          // no npm profile found for user. oh well.
        }
        return user
      })
  }
}
