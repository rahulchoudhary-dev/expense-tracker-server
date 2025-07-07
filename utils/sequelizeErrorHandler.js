const { ValidationError, UniqueConstraintError } = require("sequelize");

const handleSequelizeError = (error) => {
  console.log("e", error);
  let err = new Error("Internal Server Error");
  err.statusCode = 500;

  if (error instanceof ValidationError) {
    err.message = "Validation error";
    err.statusCode = 400;
    err.details = error.errors.map((e) => e.message);
  } else if (error instanceof UniqueConstraintError) {
    err.message = "Unique constraint failed";
    err.statusCode = 409;
    err.details = error.errors.map((e) => e.message);
  } else if (error.message) {
    err.message = error.message;
  }

  return err;
};

module.exports = handleSequelizeError;
