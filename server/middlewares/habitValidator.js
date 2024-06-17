const joi = require("joi");

const habitValidationSchema = joi.object({
  title: joi.string().min(3).required(),
  type: joi.string().valid("good", "bad").required(),
  user: joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),   //Regex Pattern for mongoose Id
  score: joi.number().default(0),
  status: joi.boolean().default(false)
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
