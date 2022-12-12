const Products = require("../models/product");
const getAllProductsStatic = async (req, res) => {
  const allProducts = await Products.find({});
  console.log("allProducts", allProducts);
  res.status(200).json({
    allProducts,
    nbHits: allProducts.length,
  });
};
const getAllProducts = async (req, res) => {
  const { name, featured, company } = req.query;
  const queryObject = { ...req.query };
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  console.log("res", queryObject);
  const products = await Products.find(queryObject);
  res.status(200).json({
    products,
    nbHits: products.length,
  });
};
module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
