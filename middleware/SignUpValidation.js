
const { body, validationResult } = require("express-validator");

exports.SignUpValidation = [
  body("Email", "please put a valid email").isEmail(),
  body("Password", "Please provide a password with more than 8 characters")
  .isLength({ min: 8 })
  .matches(/^[A-Z]/).withMessage("Password must start with a capital letter") // Contraseña empieza con mayúscula
  .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain at least one symbol"), // Contiene al menos un símbolo
];

exports.login = [body("Email", "please put a valid email").isEmail()];

exports.validation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};