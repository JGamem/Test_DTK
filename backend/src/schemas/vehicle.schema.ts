import Joi from 'joi';

export const createVehicleSchema = Joi.object({
    brand: Joi.string().required().min(2).max(100),
    model: Joi.string().required().min(1).max(100),
    year: Joi.number().required().min(1900).max(new Date().getFullYear() + 1),
    color: Joi.string().required().min(2).max(50),
    location: Joi.string().min(2).max(100).optional()
});

export const updateVehicleSchema = Joi.object({
    brand: Joi.string().min(2).max(100).optional(),
    model: Joi.string().min(1).max(100).optional(),
    year: Joi.number().min(1900).max(new Date().getFullYear() + 1).optional(),
    color: Joi.string().min(2).max(50).optional(),
    location: Joi.string().min(2).max(100).optional()
});