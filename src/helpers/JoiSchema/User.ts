import Joi from "joi"

export const UserId = Joi.number().min(0).messages({
    "number.base": "user_id must be a number",
    "number.min": "user_id must be greater than or equal to 1",
})

export const Password = Joi.string()
    .min(12)
    .max(64)
    .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]+$"))
    .required()
    .messages({
        "any.required": "Password is required",
        "string.pattern.base": "Password contains invalid characters",
        "string.min": "Password must be at least 12 characters long",
        "string.max": "Password must be no more than 64 characters long",
    });


export const Name = Joi.string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z ]+$/)
    .messages({
        "any.required": "name is required",
        "string.min": "name must be at least 3 characters long",
    })

export const Email = Joi.string()
    .pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)
    .required()
    .messages({
        "any.required": "Email is required",
        "string.pattern.base": "Email must be a valid email",
    })

export const Register = Joi.object({
    first_name: Name.required(),
    last_name: Name.required(),
    email: Email,
    password: Password,
    group_id: Joi.number().valid(3).required().messages({
        "any.required": "group_id is required",
    }),
}).options({ abortEarly: false })

export const Login = Joi.object({
    email: Email,
    password: Password,
}).options({ abortEarly: false })

export const GetUserProfile = UserId

export const UpdateUserProfile = Joi.object({
    id: UserId.required().messages({
        "any.required": "user_id is required",
    }),
    email: Email,
    name: Name,
}).options({ abortEarly: false })

export const ChangePassword = Joi.object({
    id: UserId.required().messages({
        "any.required": "Id is required",
    }),
    oldPassword: Password,
    newPassword: Password,
}).options({ abortEarly: false })

export const VerifyEmail = Joi.string().required()

export const UpdateClientProfile = Joi.object({
    user_id: UserId.required().messages({
        "any.required": "user_id is required",
    }),
    first_name: Name.optional().allow(null, ""),
    last_name: Name.optional().allow(null, ""),
    phone: Joi.string().allow(null, ""),
    risk_tolerance: Joi.string().valid("conservative", "moderate", "aggressive").allow(null, ""),
    investment_experience: Joi.string().valid("beginner", "intermediate", "experienced").allow(null, ""),
    annual_income: Joi.number().allow(null, ""),
    net_worth: Joi.number().allow(null, ""),
    investment_goals: Joi.string().allow(null, ""),
    date_of_birth: Joi.string().allow(null, ""),
})
