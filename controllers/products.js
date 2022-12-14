const Products = require("../models/product");
const getAllProductsStatic = async (req, res) => {
  const allProducts = await Products.find({ price: { $lt: 120 } })
    .sort("name")
    .select("name price company rating featured");
  console.log("allProducts", allProducts);
  res.status(200).json({
    allProducts,
    nbHits: allProducts.length,
  });
};
const getAllProducts = async (req, res) => {
  const { name, featured, company, sort, fields, numericFilters } = req.query;
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
  let result = Products.find(queryObject);

  // SORT
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }
  // NUMERIC FILTERS
  if (numericFilters) {
    // console.log("numericFilters", numericFilters);
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }
  console.log("queryObject", queryObject);
  // FIELDS
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const products = await result;
  // console.log("products", products);
  res.status(200).json({
    nbHits: products.length,
    products,
  });
};
module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
