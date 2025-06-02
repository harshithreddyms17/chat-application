import { body, validationResult } from 'express-validator';

export const passwordValidation = body('password')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
  .matches(/[0-9]/).withMessage('Password must contain at least one number')
  .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character')
  .matches(/^\S*$/).withMessage('Password must not contain spaces');

export const passwordChangeValidation = [
body('oldPassword')
    .notEmpty().withMessage('Old password is required'),
passwordValidation
];

const fullNameValidation = body('fullName')
  .isLength({ min: 8}).withMessage('Full name must be at least 8 characters long')

const signupValidation = [
  body('email')
    .isEmail().withMessage('Email is not valid')
    .normalizeEmail(),
  passwordValidation,
  fullNameValidation,
];

const validate = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      errors: result.array().map(err => ({ field: err.param, message: err.msg })),
    });
  }
  next();
};


export {
  signupValidation,
  validate
};
