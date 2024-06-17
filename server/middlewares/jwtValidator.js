const jwt = require("jsonwebtoken");

const jwtValidator = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(token)
  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.params.userId = decoded.email;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = jwtValidator;
