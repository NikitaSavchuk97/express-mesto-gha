module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка 1' : message,
    });

  next();
};

module.exports = (err, req, res, next) => {
  const { statusCode = 404, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 404 ? 'Такой страницы не существует' : message,
    });

  next();
};
