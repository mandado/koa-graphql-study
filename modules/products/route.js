const Router = require('koa-router');
const router = Router({
    prefix: '/products'
});

const ProductController = require('./controller');

router.get('/', ProductController.index);
router.post('/', ProductController.create);
router.get('/:id', ProductController.show);
router.put('/:id', ProductController.update);
router.delete('/:id', ProductController.remove);

module.exports = router;