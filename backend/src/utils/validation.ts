import Joi from 'joi';
import { AppError } from './app-error';

export const validate = async (
    schema: Joi.ObjectSchema,
    data: any
): Promise<void> => {
    try {
        await schema.validateAsync(data, { abortEarly: false });
    } catch (error) {
        if (error instanceof Joi.ValidationError) {
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join(', ');
            throw new AppError(errorMessage, 400);
        }
        throw error;
    }
};