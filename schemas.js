//* This file is used to define the differnt types of schemas 

//@ Importing a validation tool 'JOI' which is easy when compared to writing custome or manually validations
//@ This tool was introduced as it is easy to validate rather than writing custom validations
const Joi = require('joi');

//@ validating form using Joi module
//@ defining a schema or making a model of how the input data to be validated
  const campgroundValidationSchema = Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.string().required().min(0),
    image: Joi.string().required(),
    description: Joi.string().required().min(10)
  });

  //@ validating review form using Joi module
  
  const reviewValidationSchema=Joi.object({
    body:Joi.string().required(),
    rating:Joi.number().required()
  })

module.exports={campgroundValidationSchema,reviewValidationSchema};