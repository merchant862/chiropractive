function sanitizeProductName(name) 
{
  if (typeof name !== 'string') return null;

  const trimmed = name.trim();

  if (trimmed.length === 0 || trimmed.length > 100) return null;

  const safeRegex = /^[a-zA-Z0-9\s\-]+$/;

  if (!safeRegex.test(trimmed)) return null

  return trimmed;
}

module.exports = sanitizeProductName;