const Report = require('../lib/report')
const expect = require('chai').expect

describe('Report class', () => {
  const goodParams = {
    title: 'Good Report',
    description: 'This report is valid. Yay!',
    collection: ['some', 'kinda', 'data']
  }
  const report = new Report(goodParams)

  it('is valid if all required metadata is present', () => {
    expect(report.valid).to.equal(true)
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

  it('converts titles to AP-style titlecase', () => {
    const report = new Report(Object.assign({}, goodParams, {title: 'why sunless tanning is A hot trend'}))
    expect(report.title).to.equal('Why Sunless Tanning Is a Hot Trend')
  })
})
