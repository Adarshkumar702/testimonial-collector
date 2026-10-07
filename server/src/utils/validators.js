const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email.trim());
};

const isValidSlug = (slug) => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return typeof slug === 'string' && slugRegex.test(slug.trim());
};

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

module.exports = {
  isValidEmail,
  isValidSlug,
  slugify
};
