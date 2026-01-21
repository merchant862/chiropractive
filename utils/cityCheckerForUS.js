function isValidUSCity(city) 
{
  if (!city) return false;

  const name = city.trim();
  if (name.length < 2 || name.length > 50) return false;

  const CITY_REGEX = /^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$/;
  return CITY_REGEX.test(name);
}

module.exports = 
{
  isValidUSCity
};
