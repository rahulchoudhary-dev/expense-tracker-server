const { errorResponse } = require("../utils/responseHandler");
const { verifyAccessToken } = require("../utils/tokenUtils");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, 401, "Authorization Bearer token is required.");
  }
  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
