'use strict'

const validate = require('revalidator').validate
const path = require('path')
const fs = require('fs')
const pick = require('lodash').pick

module.exports = class Report {
  constructor (props) {
    Object.assign(this, props)

    switch (this.collectionType) {
      case 'Package':
        this.cleanPackages()
        break
    }

    this.collection = this.collection.slice(0, Report.MAX_RESULTS)
    this.createdAt = new Date()

    return this
  }

  get valid () {
    return validate(this, schema).valid
  }

  get validationErrors () {
    return validate(this, schema).errors
  }

  save () {
    if (!this.valid) return console.error(this.validationErrors)

    fs.writeFileSync(
      path.join(__dirname, `../reports/${this.slug}.json`),
      JSON.stringify(this, null, 2)
    )
  }

  cleanPackages () {
    const desiredProps = [
      'name',
      'description',
      'dependents',
      'devDependents',
      'totalDeps',
      'downloadsInLastMonth',
      'repository',
      'keywords',
      'author',
      'owners'
    ]

    this.collection = this.collection.map(pkg => {
      // Get rid of unwanted metadata
      pkg = pick(pkg, desiredProps)

      // Don't need the names. A count will do.
      if (Array.isArray(pkg.dependents)) {
        pkg.dependents = pkg.dependents.length
      }

      // Don't need the names. A count will do.
      if (Array.isArray(pkg.devDependents)) {
        pkg.devDependents = pkg.devDependents.length
      }

      return pkg
    })
  }

  static get MAX_RESULTS () {
    return 500
  }
}

const schema = {
  properties: {
    slug: {
      type: 'string',
      required: true,
      allowEmpty: false
    },
    title: {
      type: 'string',
      required: true,
      allowEmpty: false
    },
    description: {
      type: 'string',
      required: true,
      allowEmpty: false
    },
    collectionType: {
      required: true,
      enum: ['Package', 'Repository', 'GithubUser', 'npmUser']
    },
    collection: {
      required: true,
      type: ['array', 'object']
    },
    createdAt: {
      required: true,
      allowEmpty: false
    }
  }
}
