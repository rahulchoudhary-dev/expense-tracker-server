const User = require("./user");
const userMedia = require("./userMedia");

User.hasOne(userMedia, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

userMedia.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
