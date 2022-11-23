const jsonwebtoken = require('jsonwebtoken');

const AuthError401 = require('../errors/authError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new AuthError401('Необходима авторизация 1'));
  }

  let payload;

  try {
    payload = jsonwebtoken.verify(token, 'yandex');
  } catch (err) {
    return next(new AuthError401('Необходима авторизация 2'));
  }

  req.user = payload;
  return next();
};
