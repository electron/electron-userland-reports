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
  'author'
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
    title: 'Top Dependencies in Apps',
    description: 'npm packages that are used most often as `dependencies` in Electron apps',
    collection: topDeps.map(package => pick(package, desirablePackageProps))
  }).save()

  new Report({
    title: 'Top Development Dependencies in Apps',
    description: 'npm packages that are used most often as `devDependencies` in Electron apps',
    collection: topDevDeps.map(package => pick(package, desirablePackageProps))
  }).save()

  new Report({
    title: 'Top GitHub Contributors',
    description: 'GitHub users that have contributed to the most Electron repositories',
    collection: utils.getTopContributors(repos).slice(0, MAX_RESULTS)
  }).save()

  new Report({
    title: 'Electron-specific packages most-depended-on by other npm packages',
    description: 'Electron-specific npm packages that are depended on by other npm packages',
    collection: electronNpmPackages
      .map(package => pick(package, desirablePackageProps))
      .map(utils.convertDepListToCount)
      .sort((a, b) => b.totalDeps - a.totalDeps)
      .slice(0, MAX_RESULTS)
  }).save()

  new Report({
    title: 'Most-downloaded Electron-specific npm Packages',
    description: 'Electron-specific npm packages that are depended on by other npm packages',
    collection: electronNpmPackages
      .map(package => pick(package, desirablePackageProps))
      .map(utils.convertDepListToCount)
      .sort((a, b) => b.downloadsInLastMonth - a.downloadsInLastMonth)
      .slice(0, MAX_RESULTS)
  }).save()
}
