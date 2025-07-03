const { default: slugify } = require("slugify");

const convertToSlug = (param) => {
  const slug = slugify(param, {
    locale: true,
    strict: true,
    trim: true,
    lower: true,
  });
  return slug;
};

module.exports = convertToSlug;
