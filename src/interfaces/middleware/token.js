module.exports = async (ctx, next) => {
  try {
    if (ctx.path.match(/\/api\/v1\/(auth|users)/i)) {
      if (ctx.method == 'POST') {
        return next();
      }
    }
    const AuthService = ctx.scope.resolve('AuthService');

    // get token
    let token = ctx.headers['authorization'] || ctx.query['token'];
    if (!token) {
      return ctx.throw(401, 'User token is require!');
    }
    const verifyContent = AuthService.verifyToken(token);
    // set user info
    ctx.state.user = verifyContent.data;
    return next();
  } catch (error) {
    throw error;
  }
};