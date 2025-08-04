import Joi from "joi";

export const CreateOrder = Joi.object({
// portfolio_id, asset_id, side, order_type, quantity, limit_price, status, broker_order_id, filled_quantity, average_fill_price, created_at, updated_at
    portfolio_id: Joi.number().min(1).required().messages({
        "number.base": "portfolio_id must be a number",
        "number.min": "portfolio_id must be greater than or equal to 1",
        "any.required": "portfolio_id is required",
    }),
    asset_id: Joi.number().min(1).required().messages({
        "number.base": "asset_id must be a number",
        "number.min": "asset_id must be greater than or equal to 1",
        "any.required": "asset_id is required",
    }),
    side: Joi.string().valid('buy', 'sell').required().messages({
        "string.base": "side must be a string",
        "any.only": "side must be either 'buy' or 'sell'",
        "any.required": "side is required",
    }),
    order_type: Joi.string().valid('market', 'limit').required().messages({
        "string.base": "order_type must be a string",
        "any.only": "order_type must be either 'market' or 'limit'",
        "any.required": "order_type is required",
    }),
    quantity: Joi.number().min(0).required().messages({
        "number.base": "quantity must be a number",
        "number.min": "quantity must be greater than or equal to 0",
        "any.required": "quantity is required",
    }),
    limit_price: Joi.number().min(0).required().messages({
        "number.base": "limit_price must be a number",
        "number.min": "limit_price must be greater than or equal to 0",
        "any.required": "limit_price is required",
    }),
    status: Joi.string().valid('submitted', 'working', 'filled', 'cancelled', 'rejected').required().messages({
        "string.base": "status must be a string",
        "any.only": "status must be one of 'submitted', 'working', 'filled', 'cancelled', or 'rejected'",
        "any.required": "status is required",
    }),
    broker_order_id: Joi.number().min(0).required().messages({
        "number.base": "broker_order_id must be a number",
        "number.min": "broker_order_id must be greater than or equal to 0",
        "any.required": "broker_order_id is required",
    }),
})