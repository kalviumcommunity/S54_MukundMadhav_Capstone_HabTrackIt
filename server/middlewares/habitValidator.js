const joi = require("joi");

const habitValidationSchema = joi.object({
  title: joi.string().min(3).required(),
  type: joi.string().valid("good", "bad").required(),
});

const habitValidator = (req, res, next) => {
  const { error } = habitValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ error: errorMessages });
  }
  next();
};

module.exports = habitValidator;
