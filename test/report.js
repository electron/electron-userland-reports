const Report = require('../lib/report')
const expect = require('chai').expect

describe('Report class', () => {
  const goodParams = {
    slug: 'githubbers',
    title: 'Prolific GitHubbers',
    description: 'Users on GitHub who work on lots of Electron apps.',
    collection: ['sally', 'bob', 'haxor'],
    collectionType: 'GithubUser'
  }
  const report = new Report(goodParams)

  it('is valid if all required metadata is present', () => {
    expect(report.valid).to.equal(true)
  })

  it('requires a slug', () => {
    const report = new Report(Object.assign({}, goodParams, {slug: null}))
    expect(report.valid).to.equal(false)
    expect(report.validationErrors.length).to.equal(1)
    expect(report.validationErrors[0].property).to.equal('slug')
  })

  it('requires a title', () => {
    const report = new Report(Object.assign({}, goodParams, {title: null}))
    expect(report.valid).to.equal(false)
    expect(report.validationErrors.length).to.equal(1)
    expect(report.validationErrors[0].property).to.equal('title')
  })

  it('requires a description', () => {
    const report = new Report(Object.assign({}, goodParams, {description: null}))
    expect(report.valid).to.equal(false)
    expect(report.validationErrors.length).to.equal(1)
    expect(report.validationErrors[0].property).to.equal('description')
  })

  it('requires a collection', () => {
    const report = new Report(Object.assign({}, goodParams, {collection: 'bogus'}))
    expect(report.valid).to.equal(false)
    expect(report.validationErrors.length).to.equal(1)
    expect(report.validationErrors[0].property).to.equal('collection')
  })

  it('requires a collectionType', () => {
    const report = new Report(Object.assign({}, goodParams, {collectionType: 'wrongo'}))
    expect(report.valid).to.equal(false)
    expect(report.validationErrors.length).to.equal(1)
    expect(report.validationErrors[0].property).to.equal('collectionType')
  })
})
