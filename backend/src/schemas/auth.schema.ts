import Joi from 'joi';

export const loginSchema = Joi.object({
    username: Joi.string().required().min(3).max(30),
    password: Joi.string().required().min(6)
});

export const registerSchema = Joi.object({
    username: Joi.string().required().min(3).max(30),
    password: Joi.string().required().min(6),
    email: Joi.string().email().required()
});