const {compact, flatten} = require('lodash')
const tally = require('count-array-values')
const fetchPackage = require('fetch-nice-package')

function cleanNames (names) {
  return compact(flatten(names))
}

module.exports = {
  getTopDependencies: (repos) => {
    const names = repos.map(repo => repo.pkg.depNames)
    return tally(cleanNames(names), 'name', 'dependents')
  },

  getTopDevDependencies: (repos) => {
    const names = repos.map(repo => repo.pkg.devDepNames)
    return tally(cleanNames(names), 'name', 'devDependents')
  },

  getTopContributors: (repos) => {
    const names = repos.map(repo => repo.contributors)
    return tally(cleanNames(names), 'user', 'repos')
  }
}
