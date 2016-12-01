const Report = require('../lib/report')
const utils = require('../lib/utils')
const {uniq, pick} = require('lodash')
const repos = require('repos-using-electron').filter(repo => !repo.fork)
const registry = require('all-the-packages')
const Package = require('nice-package')
const electronNpmPackages = require('electron-npm-packages')
const MAX_RESULTS = 500
const topDeps = utils.getTopDependencies(repos).slice(0, MAX_RESULTS)
const topDevDeps = utils.getTopDevDependencies(repos).slice(0, MAX_RESULTS)
const allPackageNames = uniq(topDeps.map(d => d.name).concat(topDevDeps.map(d => d.name)))
const packageData = {}

const desirablePackageProps = [
  'name',
  'description',
  // 'dependencies',
  // 'devDependencies',
  'dependents',
  'devDependents',
  'totalDeps',
  'downloadsInLastMonth',
  'repository',
  'keywords',
  'author',
  'owners'
]

registry
  .on('package', function (pkg) {
    process.stdout.write('.')
    if (pkg && pkg.name && allPackageNames.includes(pkg.name)) {
      console.log(pkg.name)
      packageData[pkg.name] = new Package(pkg)
    }
  })
  .on('end', finish)

// finish()

function finish () {
  // Add extra package metadata to dep lists
  topDeps.forEach(dep => Object.assign(dep, packageData[dep.name]))
  topDevDeps.forEach(dep => Object.assign(dep, packageData[dep.name]))

  new Report({
    title: 'Popular App Dependencies',
    description: 'A list of the top npm packages most often listed as `dependencies` in Electron apps.',
    collection: topDeps.map(pkg => pick(pkg, desirablePackageProps))
  }).save()

  new Report({
    title: 'Popular App Development Dependencies',
    description: 'A list of the top npm packages most often listed as `devDependencies` in Electron apps.',
    collection: topDevDeps.map(pkg => pick(pkg, desirablePackageProps))
  }).save()

  new Report({
    title: 'Prolific GitHub Contributors',
    description: 'GitHub users that have contributed to the most Electron-related repositories.',
    collection: utils.getTopContributors(repos).slice(0, MAX_RESULTS)
  }).save()

  new Report({
    title: 'Popular Low-level Dependencies',
    description: 'Electron-related npm packages that are frequently depended on by other npm packages.',
    collection: electronNpmPackages
      .map(pkg => pick(pkg, desirablePackageProps))
      .map(utils.convertDepListToCount)
      .sort((a, b) => b.totalDeps - a.totalDeps)
      .slice(0, MAX_RESULTS)
  }).save()

  // 'Popular Low-level Development Dependencies'

  new Report({
    title: 'Most-downloaded npm Packages',
    description: 'Electron-related npm packages that are downloaded a lot.',
    collection: electronNpmPackages
      .map(pkg => pick(pkg, desirablePackageProps))
      .map(utils.convertDepListToCount)
      .sort((a, b) => b.downloadsInLastMonth - a.downloadsInLastMonth)
      .slice(0, MAX_RESULTS)
  }).save()
}
