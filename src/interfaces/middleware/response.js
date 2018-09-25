module.exports = response;

async function response(ctx, next) {
  const logger = ctx.scope.resolve('logger');
  try {
    await next();
    if (!ctx.body) {
      return ctx.throw(403, 'Request invalid');
    }
    return ctx.body = responseSuccess(ctx.body, ctx.state);
  } catch (error) {
    logger.error(`response middelware ${error.message}`);
    let { status, message } = responseError(error, ctx);
    ctx.status = status;
    return ctx.body = { code: status, message };
  }
}

/**
 * response data
 *
 * @param {*} data
 * @param {*} { meta }
 * @returns
 */
function responseSuccess(data, { meta }) {
  let body = {
    status: 200,
    message: 'success',
  };

  if (meta) {
    body.meta = meta;
  }

  if (data) {
    body.data = data;
  }
  return body;
}

/**
 * response error
 * @param {any} error
 */
function responseError(error) {
  try {
    let status = error.statusCode || error.status;
    let message = error.message;
    let name = error.name;

    if (error.isJoi) {
      status = 400;
      message = error.details[0]['message'];
    }

    if (name && name == 'JsonWebTokenError') {
      status = 401;
      message = 'Token invalid';
    }

    if (name == 'Error') {
      status = 403;
    }

    if (!status || status == 500) {
      status = 500;
      message = 'Oppps! some thing went wrong';
    }

    return { status, message };
  } catch (error) {
    throw error;
  }
}