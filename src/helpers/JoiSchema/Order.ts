import Joi from "joi";

export const CreateOrder = Joi.object({
// includes all possible order fields as defined in the orders table
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
    client_id: Joi.number().min(1).required().messages({
        "number.base": "client_id must be a number",
        "number.min": "client_id must be greater than or equal to 1",
        "any.required": "client_id is required",
    }),
    group_id: Joi.number().min(1).allow(null).optional().messages({
        "number.base": "group_id must be a number",
        "number.min": "group_id must be greater than or equal to 1",
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
    broker_order_id: Joi.string().optional().messages({
        "string.base": "broker_order_id must be a string",
    }),
    filled_quantity: Joi.number().min(0).optional().messages({
        "number.base": "filled_quantity must be a number",
        "number.min": "filled_quantity must be greater than or equal to 0",
    }),
    average_fill_price: Joi.number().min(0).optional().messages({
        "number.base": "average_fill_price must be a number",
        "number.min": "average_fill_price must be greater than or equal to 0",
    }),
    close_price: Joi.number().min(0).optional().messages({
        "number.base": "close_price must be a number",
        "number.min": "close_price must be greater than or equal to 0",
    }),
    fees: Joi.number().min(0).optional().messages({
        "number.base": "fees must be a number",
        "number.min": "fees must be greater than or equal to 0",
    }),
    closed_at: Joi.string().allow('').optional().messages({
        "string.base": "closed_at must be a string",
    }),
    status: Joi.string()
        .valid('PENDING','OPEN','PARTIAL_FILLED','FILLED','CANCELLED','REJECTED','EXPIRED')
        .required()
        .messages({
            "string.base": "status must be a string",
            "any.only": "status must be a valid order status",
            "any.required": "status is required",
        }),
    created_at: Joi.string().required().messages({
        "string.base": "created_at must be a string",
        "any.required": "created_at is required",
    }),
    updated_at: Joi.string().required().messages({
        "string.base": "updated_at must be a string",
        "any.required": "updated_at is required",
    }),
})