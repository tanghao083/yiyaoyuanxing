const { Product } = require('../models');
const { Op } = require('sequelize');

const productController = {
  // 获取所有商品
  async getAllProducts(req, res) {
    try {
      const products = await Product.findAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  // 获取单个商品
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  // 添加商品
  async addProduct(req, res) {
    try {
      const { code, name, spec, manufacturer, packaging, stock, purchasePrice, qualificationId } = req.body;
      
      // 检查商品编码是否已存在
      const existingProduct = await Product.findOne({ where: { code } });
      if (existingProduct) {
        return res.status(400).json({ error: 'Product code already exists' });
      }
      
      const product = await Product.create({
        code,
        name,
        spec,
        manufacturer,
        packaging,
        stock,
        purchasePrice,
        qualificationId
      });
      
      res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  // 更新商品
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { code, name, spec, manufacturer, packaging, stock, purchasePrice, qualificationId, status } = req.body;
      
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      // 检查商品编码是否已被其他商品使用
      if (code !== product.code) {
        const existingProduct = await Product.findOne({ where: { code } });
        if (existingProduct) {
          return res.status(400).json({ error: 'Product code already exists' });
        }
      }
      
      product.code = code;
      product.name = name;
      product.spec = spec;
      product.manufacturer = manufacturer;
      product.packaging = packaging;
      product.stock = stock;
      product.purchasePrice = purchasePrice;
      product.qualificationId = qualificationId;
      if (status !== undefined) {
        product.status = status;
      }
      
      await product.save();
      res.json({ message: 'Product updated successfully', product });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  // 删除商品
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      await product.destroy();
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  // 搜索商品
  async searchProducts(req, res) {
    try {
      const { name, spec, manufacturer } = req.query;
      const where = {};
      
      if (name) {
        where.name = { [Op.like]: `%${name}%` };
      }
      if (spec) {
        where.spec = { [Op.like]: `%${spec}%` };
      }
      if (manufacturer) {
        where.manufacturer = { [Op.like]: `%${manufacturer}%` };
      }
      
      const products = await Product.findAll({ where });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = productController;