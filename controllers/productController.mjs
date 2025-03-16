import Product from "../models/product.mjs"; 

const getProductPage = async (req, res) => {
  try {
    const products = await Product.find();
    const categories = [...new Set(products.map((product) => product.category))];

    // Giả sử bạn có logic phân trang, ví dụ:
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 10;
    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    res.render("product", {
      categories,
      products: paginatedProducts,
      user: req.session.user, // Truyền biến user vào view
      currentPage,
      totalPages
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error fetching products");
  }
};

const getProductDetail = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("single_product", {
      product,
      user: req.session.user // Truyền biến user vào view
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).send("Error fetching product details");
  }
};

export { getProductDetail, getProductPage };

