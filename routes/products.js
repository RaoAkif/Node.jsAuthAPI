const router = require("express").Router();
const productController = require("../controllers/productController")

// Register
router.route("/")
  .post(productController.createProduct)
  .get(productController.getAllProducts)

// Login
router.route("/:id")
  .get(productController.getProductById)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct)

module.exports = router;
