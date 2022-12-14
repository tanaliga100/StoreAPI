import Grid from "@mui/material/Grid";
const Products = require("../models/product");
const getAllProductsStatic = async (req, res) => {
  const allProducts = await Products.find({})
    .sort("name")
    .select("name price company")
    .limit(10)
    .skip(5);
  console.log("allProducts", allProducts);
  res.status(200).json({
    allProducts,
    nbHits: allProducts.length,
  });
};
const getAllProducts = async (req, res) => {
  console.log(req.query);
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
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = page - 1 * limit;
  result = result.skip(skip).limit(limit);
  const products = await result;
  console.log("products", products);
  res.status(200).json({
    nbHits: products.length,
    products,
  });
};
module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
