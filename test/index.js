const reports = require('..')
const expect = require('chai').expect

describe('reports', () => {
  it('is an array of valid Report objects', () => {
    expect(Array.isArray(reports)).to.equal(true)
    expect(reports.length).to.be.above(4)
    expect(reports.every(report => report.constructor.name === 'Report')).to.equal(true)
    expect(reports.every(report => report.valid)).to.equal(true)
  })
})
