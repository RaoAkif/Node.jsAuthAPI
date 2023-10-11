const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc Create a New Product
// @route POST /products
// @access Private
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      actual_price,
      discounted_price,
      category,
      description,
      quantity,
      size,
      color,
      images,
    } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        actual_price,
        discounted_price,
        category,
        description,
        quantity,
        size,
        color,
        images: {
          create: images,
        },
      },
    });

    res.json(newProduct);
  } catch (error) {
    next(error);
  }
};

// @desc Get All Products
// @route GET /products
// @access Public
const getAllProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    next(error);
  }
}

// @desc Get a Product by ID
// @route GET /products/:id
// @access Public
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        images: true,
      },
    });

    res.json(product);
  } catch (error) {
    next(error);
  }
}

// @desc Update a Product
// @route PUT /products/:id
// @access Private
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      actual_price,
      discounted_price,
      category,
      description,
      quantity,
      size,
      color,
      images,
    } = req.body;

    const updatedProduct = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        actual_price,
        discounted_price,
        category,
        description,
        quantity,
        size,
        color,
        images: {
          upsert: images,
        },
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
}

// @desc Delete a Product
// @route DELETE /products/:id
// @access Private
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    res.json(deletedProduct);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
