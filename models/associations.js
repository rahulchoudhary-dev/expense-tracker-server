const User = require("./user");
const userMedia = require("./userMedia");

User.hasOne(userMedia, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  as: "userMedia",
});

userMedia.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
