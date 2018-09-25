module.exports = (ctx, next) => {
  ctx.state = {
    ...ctx.state,
    ...ctx.request.query,
    ...ctx.request.params,
    ...ctx.request.body,
  };
  return next();
};