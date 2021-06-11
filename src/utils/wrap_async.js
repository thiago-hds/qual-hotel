// wrapper para lidar com erros em async functions
module.exports = func => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
