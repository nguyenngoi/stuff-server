module.exports = logger;

/**
 * log all request
 *
 * @param {*} ctx
 * @param {*} next
 * @returns {object}
 */
async function logger(ctx, next) {
  try {
    const start = Date.now();
    const { query, params, headers, method, url } = ctx;
    const data = {
      url,
      query,
      params,
      method,
      headers,
      body: ctx.request.body,
      ip: ctx.request.header['x-real-ip'],
    };
    await next();
    const time = Date.now() - start;
    ctx.set('X-Response-Time', `${time}ms`);
    data.time = time;
    data.response = ctx.body;

    // save log

    return data;
  } catch (error) {
    throw error;
  }
}