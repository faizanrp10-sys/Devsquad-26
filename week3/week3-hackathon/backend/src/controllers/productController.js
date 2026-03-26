const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const {
      category, flavor, origin, qualities, caffeine, allergens,
      organic, rating, minPrice, maxPrice, sort, page = 1, limit = 12, search
    } = req.query;

    const query = {};

    if (category) {
      const cats = category.split(',');
      query.category = { $in: cats };
    }
    if (flavor) {
      const flavors = flavor.split(',');
      query.flavor = { $in: flavors };
    }
    if (origin) {
      const origins = origin.split(',');
      query.origin = { $in: origins };
    }
    if (qualities) {
      const quals = qualities.split(',');
      query.qualities = { $in: quals };
    }
    if (caffeine) {
      const caffs = caffeine.split(',');
      query.caffeine = { $in: caffs };
    }
    if (allergens) {
      const allergenList = allergens.split(',');
      query.allergens = { $all: allergenList };
    }
    if (organic === 'true') query.organic = true;
    if (rating) query.rating = { $gte: Number(rating) };
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const sortOptions = {};
    if (sort) {
      const [field, order] = sort.split(':');
      sortOptions[field] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({
      products,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get distinct values for filter sidebar
exports.getFilterOptions = async (req, res) => {
  try {
    const [categories, origins, flavors, qualities, caffeines, allergens] = await Promise.all([
      Product.distinct('category'),
      Product.distinct('origin'),
      Product.distinct('flavor'),
      Product.distinct('qualities'),
      Product.distinct('caffeine'),
      Product.distinct('allergens'),
    ]);
    res.json({ categories, origins, flavors, qualities, caffeines, allergens });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get related products (same category, excluding current)
exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);
    res.json(related);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
