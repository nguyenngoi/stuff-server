const Router = require('koa-router');
const UserController = require('./user.ctrl');

const router = new Router();
router
  .get('/', UserController.getAll)
  .get('/:user_id', UserController.getDetail)
  // .put('/:user_id', UserController.update)
  // .delete('/:user_id', UserController.del)
  .post('/', UserController.create);


module.exports = router.routes();