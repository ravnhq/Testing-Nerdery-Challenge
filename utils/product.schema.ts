import Joi from 'joi';

const createProductSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    description: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    tags: Joi.array().items(Joi.string()).length(1).required(),
    price: Joi.number().min(0).precision(2).required(),
});

export {
    createProductSchema,
}