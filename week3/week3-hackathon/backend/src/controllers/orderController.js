const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  const { items, totalAmount, shippingAddress } = req.body;
  try {
    // 1. Validate stock and prices
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product ${item.product} not found` });

      const variant = product.variants.find(v => v.name === item.variantName);
      if (!variant) return res.status(404).json({ message: `Variant ${item.variantName} not found` });

      if (variant.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name} (${item.variantName})` });
      }

      if (variant.price !== item.price) {
        return res.status(400).json({ message: `Price mismatch for ${product.name}` });
      }
    }

    // 2. Reduce stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      const variant = product.variants.find(v => v.name === item.variantName);
      variant.stock -= item.quantity;
      await product.save();
    }

    // 3. Create order
    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress,
    });
    const savedOrder = await order.save();

    // 4. Clear cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
