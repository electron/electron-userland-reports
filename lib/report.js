const validate = require('revalidator').validate
const titlecase = require('ap-style-title-case')
const path = require('path')
const fs = require('fs')

module.exports = class Report {
  constructor (props) {
    Object.assign(this, props)
    if (this.title) this.title = titlecase(this.title)
    return this
  }

  get basename () {
    return this.title.toLowerCase().replace(/[\s-]/g, '_')
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
      path.join(__dirname, `../reports/${this.basename}.json`),
      JSON.stringify(this, null, 2)
    )
  }
}

const schema = {
  properties: {
    title: {
      type: 'string',
      required: true,
      allowEmpty: false
    },
    description: {
      type: 'string',
      required: true,
      minLength: 5
    },
    collection: {
      required: true,
      type: ['array', 'object']
    }
  }
}
