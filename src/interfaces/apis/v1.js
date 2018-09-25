const Router = require('koa-router');


const router = new Router({
  prefix: '/api/v1',
});

router
  .use('/', (ctx, next) => next())


module.exports = router;