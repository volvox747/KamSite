//* This file is used to define the differnt types of schemas 

const Joi = require('joi');

//@ validating form using Joi module
//@ defining a schema or making a model of how the input data to be validated
  const validationSchema = Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.string().required().min(0),
    image: Joi.string().required(),
    description: Joi.string().required().length(60).min(10)
  });


module.exports=validationSchema;