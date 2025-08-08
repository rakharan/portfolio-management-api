import Joi from "joi";

export const CreateOrder = Joi.object({
// portfolio_id, asset_id, side, order_type, quantity, price, broker_order_id, optional fields
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
    side: Joi.string().valid('BUY', 'SELL').required().messages({
        "string.base": "side must be a string",
        "any.only": "side must be either 'BUY' or 'SELL'",
        "any.required": "side is required",
    }),
    order_type: Joi.string().valid('MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT').required().messages({
        "string.base": "order_type must be a string",
        "any.only": "order_type must be one of 'MARKET', 'LIMIT', 'STOP', or 'STOP_LIMIT'",
        "any.required": "order_type is required",
    }),
    quantity: Joi.number().min(0).required().messages({
        "number.base": "quantity must be a number",
        "number.min": "quantity must be greater than or equal to 0",
        "any.required": "quantity is required",
    }),
    price: Joi.number().min(0).optional().messages({
        "number.base": "price must be a number",
        "number.min": "price must be greater than or equal to 0",
    }),
    stop_loss: Joi.number().min(0).optional().messages({
        "number.base": "stop_loss must be a number",
        "number.min": "stop_loss must be greater than or equal to 0",
    }),
    take_profit: Joi.number().min(0).optional().messages({
        "number.base": "take_profit must be a number",
        "number.min": "take_profit must be greater than or equal to 0",
    }),
    order_value: Joi.number().min(0).optional().messages({
        "number.base": "order_value must be a number",
        "number.min": "order_value must be greater than or equal to 0",
    }),
    notes: Joi.string().allow('').optional().messages({
        "string.base": "notes must be a string",
    }),
    expires_at: Joi.string().allow('').optional().messages({
        "string.base": "expires_at must be a string",
    }),
    broker_order_id: Joi.number().min(0).required().messages({
        "number.base": "broker_order_id must be a number",
        "number.min": "broker_order_id must be greater than or equal to 0",
        "any.required": "broker_order_id is required",
    }),
})