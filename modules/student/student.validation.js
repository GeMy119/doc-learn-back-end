import Joi from "joi";

const signUpValidationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required(),
  role: Joi.string(),
  password: Joi.string()
    .required(),
  id: Joi.string().required(),
  year: Joi.string().required(),
  university: Joi.string().required(),
  faculty: Joi.string().required(),
  agreeToTerms: Joi.boolean().required()
});

const signInSchem = Joi.object({
  id: Joi.string().min(14).max(14).required(),
  password: Joi.string()
    .min(8)
    .required(),
});

export { signUpValidationSchema, signInSchem };
