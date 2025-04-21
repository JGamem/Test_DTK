import Joi from 'joi';

export const createGroupSchema = Joi.object({
    name: Joi.string().required().min(2).max(100),
    description: Joi.string().optional()
});

export const vehicleGroupSchema = Joi.object({
    vehicleId: Joi.string().required().uuid(),
    groupId: Joi.string().required().uuid()
});