const Joi = require('Joi')

module.exports.campgroundSchemajoi = Joi.object({
    campground: Joi.object({
      title: Joi.string().required(),
      price: Joi.number().required().min(0),
      description: Joi.string().required(),
      location: Joi.string().required(),
      image: Joi.string().required()
  }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(0).max(10)
    }).required()
})