const validate = require('revalidator').validate
const titlecase = require('ap-style-title-case')

module.exports = class Report {
  constructor (props) {
    Object.assign(this, props)
    if (this.title) this.title = titlecase(this.title)
    return this
  }

  get valid () {
    return validate(this, schema).valid
  }

  get validationErrors () {
    return validate(this, schema).errors
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
