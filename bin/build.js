const Report = require('../lib/report')
const utils = require('../lib/utils')
const {uniq} = require('lodash')

// Datasets
const repos = require('repos-using-electron').filter(repo => !repo.fork && !repo.formerFork)
const electronNpmPackages = require('electron-npm-packages')
const topDeps = utils.getTopDependencies(repos).slice(0, Report.MAX_RESULTS)
const topDevDeps = utils.getTopDevDependencies(repos).slice(0, Report.MAX_RESULTS)

// Collect package metadata from the npm registry
const registry = require('all-the-packages')
const Package = require('nice-package')
const allPackageNames = uniq(topDeps.map(d => d.name).concat(topDevDeps.map(d => d.name)))
const registryData = {}

registry
  .on('package', function (pkg) {
    process.stdout.write('.')
    if (pkg && pkg.name && allPackageNames.includes(pkg.name)) {
      console.log(pkg.name)
      registryData[pkg.name] = new Package(pkg)
    }
  })
  .on('end', finish)

function finish () {
  // Add registry metadata to package lists
  topDeps.forEach(pkg => Object.assign(pkg, registryData[pkg.name]))
  topDevDeps.forEach(pkg => Object.assign(pkg, registryData[pkg.name]))

  new Report({
    title: 'Popular App Dependencies',
    description: 'A list of the top npm packages most often listed as `dependencies` in Electron apps.',
    collectionType: 'Package',
    collection: topDeps
  }).save()

  new Report({
    title: 'Popular App Development Dependencies',
    description: 'A list of the top npm packages most often listed as `devDependencies` in Electron apps.',
    collectionType: 'Package',
    collection: topDevDeps
  }).save()

  new Report({
    title: 'Prolific GitHub Contributors',
    description: 'GitHub users that have contributed to the most Electron-related repositories.',
    collectionType: 'GithubUser',
    collection: utils.getTopContributors(repos)
  }).save()

  new Report({
    title: 'Popular Low-level Dependencies',
    description: 'Electron-related npm packages that are frequently depended on by other npm packages.',
    collectionType: 'Package',
    collection: electronNpmPackages.sort((a, b) => b.totalDeps - a.totalDeps)
  }).save()

  new Report({
    title: 'Most-downloaded npm Packages',
    description: 'Electron-related npm packages that are downloaded a lot.',
    collectionType: 'Package',
    collection: electronNpmPackages.sort((a, b) => b.downloadsInLastMonth - a.downloadsInLastMonth)
  }).save()

  new Report({
    title: 'Prolific Package Authors',
    description: 'npm users who maintain numerous Electron-related packages.',
    collectionType: 'npmUser',
    collection: utils.getTopPackageAuthors(electronNpmPackages)
  }).save()

  // TODO: 'Popular Low-level Development Dependencies'
  // TODO: 'Popular New Packages'
  // TODO: 'Popular New Apps'
  // TODO: 'Apps with Many Contributors'
}
