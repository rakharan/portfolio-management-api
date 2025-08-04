import Joi from "joi";

export const AssetId = Joi.number().min(0).messages({
    "number.base": "asset_id must be a number",
    "number.min": "asset_id must be greater than or equal to 1",
})