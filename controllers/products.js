const Products = require("../models/product");
const getAllProductsStatic = async (req, res) => {
  const allProducts = await Products.find({}).select("name price");
  console.log("allProducts", allProducts);
  res.status(200).json({
    allProducts,
    nbHits: allProducts.length,
  });
};
const getAllProducts = async (req, res) => {
  const { name, featured, company, sort, fields } = req.query;
  const queryObject = {};
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
  let result = Products.find(queryObject);

  console.log("results await", result);
  // SORT
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }
  // FIELDS
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }
  const products = await result;
  res.status(200).json({
    nbHits: products.length,
    products,
  });
};
module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
