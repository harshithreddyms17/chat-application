import {body, validationResult} from 'express-validator';

const passwordValidation = body('password')
    .isLength({min: 8}).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character')
    .matches(/^\S*$/).withMessage('Password must not contain spaces');

const fullNameValidation = body('fullName')
    .isLength({min: 4}).withMessage('Full name must be at least 3 characters long')
    .matches(/^\S*$/).withMessage('Full name must not contain spaces')

exports.signupValidation = [
    body('email')
        .isEmail().withMessage('Email is not valid')
        .normalizeEmail(),
    passwordValidation,
    fullNameValidation,
];

exports.validate = (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        errors: result.array().map(err => ({ field: err.param, message: err.msg })),
      });
    }
    next();
  };