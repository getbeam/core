import path from 'path';

export default function render() {
  return (req, res, next) => {
    res.marko = (viewPath, opts) => {
      require(path.resolve(req.app.get('views'), `${viewPath}.marko`))
        .render(opts, res);
    };
    next();
  };
}
