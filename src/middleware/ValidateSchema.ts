import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import { Category, categoryOptions, Receipt, ReceiptId } from '../models/Receipt';
import { isValidObjectId } from 'mongoose';

//! Validating only for post for now
export const ValidateSchema = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);
            next();
        } catch (error) {
            console.error('Validation Failed ', error);
            return res.status(422).json({ error });
        }
    };
};

export const ValidateReceiptIdSchema = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.receiptId;
        try {
            // await schema.validateAsync(req.params.receptId);
            if (isValidObjectId(id)) {
                console.log('is valid', isValidObjectId(id));
                next();
            } else {
                console.error('Validation Failed ', isValidObjectId(id));
                return res.status(422).json({ message: `Unable to process receipt id :${id}` });
            }
        } catch (error) {
            console.error('Validation Failed ', error, req);
            return res.status(422).json({ error });
        }
    };
};
export const Schemas = {
    receipts: {
        create: Joi.object<Receipt>({
            cost: Joi.number().required(),
            time: Joi.date().iso().required(),
            title: Joi.string().required(),
            category: Joi.string()
                .valid(...Object.values(Category))
                .required()
        }),
        readById: Joi.object<ReceiptId>({
            receiptId: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required()
        }),
        deleteById: Joi.object<ReceiptId>({
            receiptId: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required()
        })
    }
};
