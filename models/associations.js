const ContactSupport = require("./contactSupport");
const Expense = require("./expense");
const ExpenseAttachment = require("./expenseAttachments");
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

Expense.hasMany(ExpenseAttachment, {
  as: "attachments",
  foreignKey: "expenseId",
  onDelete: "CASCADE",
});

ExpenseAttachment.belongsTo(Expense, {
  as: "expense",
  foreignKey: "expenseId",
});

// Each ContactSupport entry belongs to one User
ContactSupport.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  as: "user", // use 'user' to reference the parent
});

// A User can have many contact support requests
User.hasMany(ContactSupport, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  as: "supportRequests", // meaningful alias
});
