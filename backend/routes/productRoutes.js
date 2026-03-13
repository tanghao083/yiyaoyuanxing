const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth, adminAuth } = require('../middleware/auth');

// 获取所有商品
router.get('/', auth, productController.getAllProducts);

// 获取单个商品
router.get('/:id', auth, productController.getProductById);

// 添加商品
router.post('/', adminAuth, productController.addProduct);

// 更新商品
router.put('/:id', adminAuth, productController.updateProduct);

// 删除商品
router.delete('/:id', adminAuth, productController.deleteProduct);

// 搜索商品
router.get('/search', auth, productController.searchProducts);

module.exports = router;