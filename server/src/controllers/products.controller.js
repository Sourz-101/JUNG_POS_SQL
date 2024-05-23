import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/products.model.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { sqlDatabase } from "../db/sql.config.js";

const connection = sqlDatabase();

const getAllCDProducts = asyncHandler(async (req, res) => {
  const cdProducts = await Product.find();
  if (!cdProducts) {
    throw new ApiError(
      500,
      "Something went wrong in fetching the cd Prodcuts!!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(201, cdProducts, "Got All prudcuts!!"));
});

const addCDProduct = asyncHandler(async (req, res) => {
  const { Name, Category, Image, Quantity, AddedDate } = req.body;

  const Cdinstance = await Product.create({
    Name,
    Category,
    Image,
    Quantity,
    "Added Date": AddedDate,
  });

  if (!Cdinstance) {
    throw new ApiError(500, "Error in adding data!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, Cdinstance, "added successfully!!"));
});

//done
const searchProduct = asyncHandler(async (req, res) => {
  const { inputText } = req.body;
  // console.log(inputText, req.body);
  // Product inserted successfully:
  // const allprodcuts= await Product.find();
  // const products =  allprodcuts.filter((product) => {
  //   const productName = product?.Name?.toString().toLowerCase();
  //   const category = product?.Category?.toString().toLowerCase();
  //   const searchText = inputText?.toString().toLowerCase();
  //   return productName?.includes(searchText) || category?.includes(searchText);

  //////*************************sql code */

  const query = `SELECT 
  product.prod_id,
  product.prod_name, 
  series.ser_name, 
  product.photo, 
  category.cat_name, 
  color.col_name,
  product.stock,
  product.created_at
FROM 
  product
JOIN 
  series ON product.series_id = series.ser_id
JOIN 
  category ON product.category_id = category.cat_id
JOIN 
  color ON product.color_id = color.col_id`;
  connection.query(query, (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      throw new ApiError(
        500,
        "Something went worong in sql fetching product!!!",
        error
      );
    }
    // Close the connection

    const allprodcuts = result;
    const products = allprodcuts.filter((product) => {
      const productName = product?.prod_name?.toString().toLowerCase();
      const searchText = inputText?.toString().toLowerCase();
      return (
        productName?.includes(searchText)
      );
    });
    if (!products) {
      throw new ApiError(500, "no Prodcut found!!");
    }
console.log("got prodcuts successfully:");
    
    return res
      .status(200)
      .json(new ApiResponse(201, products, "Found some products!!"));
  });
});

//done
const getProductById = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  console.log(_id);

  // const product= await Product.findOne({_id});

  // if(!product) throw new ApiError(500, "No product Found!!")

  // return res.status(200).json(new ApiResponse(201, product, "Got the prodcut"))

  ////*************** sql code */
  const query = `
  SELECT 
    product.prod_id,
    product.prod_name, 
    series.ser_name, 
    product.photo, 
    category.cat_name, 
    color.col_name, 
    user.user_name, 
    product.archive, 
    product.stock, 
    product.created_at, 
    product.updated_at
  FROM 
    product
  JOIN 
    series ON product.series_id = series.ser_id
  JOIN 
    category ON product.category_id = category.cat_id
  JOIN 
    color ON product.color_id = color.col_id
  JOIN 
    user ON product.user_id = user.user_id
  WHERE 
    product.prod_id = ${_id}
`;

  connection.query(query, (error, result) => {
    if (error) {
      console.error("Error fetching product:", error); // Log the error for debugging
      return res
        .status(500)
        .json(new ApiError(500, "Something went wrong: " + error.message));
    }

    console.log("Product retrieved successfully:", result);
    // connection.end(); // Close the connection

    return res
      .status(200)
      .json(new ApiResponse(200, result[0], "Got the product successfully"));
  });
});

//done
const getAllSeries = asyncHandler(async (req, res) => {
  // const uniqueSeries= await Product.aggregate([
  //   {
  //     $group: {
  //       _id: null,
  //       "allSeries":{$addToSet:"$Series"}
  //     },
  //   },
  // ])

  // if(!uniqueSeries) throw new ApiError(500, "Something went worng in getting series!!")

  //   return res.status(200).json(new ApiResponse(201, uniqueSeries[0].allSeries, "Got All Series!!"))

  ///****************sql code */

  const query = `select distinct series.ser_name, product.series_id from product inner join series on product.series_id = series.ser_id`;

  connection.query(query, (error, result) => {
    if (error) throw new ApiError(500, "no data found by sql" + error);

    console.log(result);

    return res
      .status(200)
      .json(new ApiResponse(201, result, "Got All Series!!"));
  });
});

//done
const getAllCategoriesOfAseries = asyncHandler(async (req, res) => {
  const { series_id } = req.body;

  if (series_id === 0 || !series_id)
    throw new ApiError(500, "Series  Required!!");

  console.log(series_id);

  // const allCategories= await Product.aggregate([
  //   {
  //     $match: {
  //       Series:series
  //     }
  //   },
  //   {
  //     $group:{
  //       _id:null,
  //       "cat":{$addToSet:"$Category"}
  //     }
  //   }
  // ]);

  // if(!allCategories) throw new ApiError(500, "Something went wrong in fetching categories!!")

  // return res.status(200).json(new ApiResponse(201, allCategories[0].cat, `Got All Categories of ${series}!!`))

  /////********************* sql code */

  const query = `select distinct category.cat_name, product.category_id from product inner join category on product.category_id = category.cat_id where product.series_id = ${series_id}`;

  connection.query(query, (error, result) => {
    if (error)
      throw new ApiError(500, "somehting went worinng in sql " + error);

    console.log(result);

    res
      .status(200)
      .json(
        new ApiResponse(201, result, `Got All Categories of ${series_id}!!`)
      );
  });
});

//done
const getAllColors = asyncHandler(async (req, res) => {
  const { series_id, category_id } = req.body;

  // if([series, category].some(fields=>fields?.trim()==="")){
  //   throw new ApiError(500, "series and Category Required!!")
  // }

  // const allColors= await Product.aggregate([
  //   {
  //     $match:{
  //       Series:series,
  //       Category:category
  //     }
  //   },
  //   {
  //     $group:{
  //       _id:null,
  //       "allColors":{$addToSet: "$Color"}
  //     }
  //   }
  // ])

  // if(!allColors) throw new ApiError(500, "Something went wrong in fetching colors!!")

  // return res.status(200).json(new ApiResponse(201, allColors[0].allColors, "Got All Colors!!"))

  ///************ sql code */

  if (!series_id || !category_id)
    throw new ApiError(500, "sereis and category are required!!");

  const query = `
    SELECT DISTINCT color.col_name, product.color_id
    FROM product
    INNER JOIN color ON product.color_id = color.col_id
    WHERE product.series_id = ${series_id} AND product.category_id = ${category_id}`;

  connection.query(query, (error, result) => {
    if (error)
      throw new ApiError(500, "somehting went worinng in sql " + error);

    console.log(result);

    return res
      .status(200)
      .json(new ApiResponse(201, result, "Got All Colors!!"));
  });
});

// ######only for editing product data during development
const updateNullCategoryToXYZ = async (req, res) => {
  try {
    // Update documents where Category is null to "xyz"
    const result = await Product.updateMany(
      {},
      { $set: { Added_by: "6647400f2bb42da17174d474" } }
    );

    console.log(`${result} documents updated.`);
    return res.status(200).json(result);
  } catch (error) {
    // Handle any errors
    console.error(error);
    return new ApiError(500, "not updated@!");
  }
};

//done
const getTheFinalProductList = asyncHandler(async (req, res) => {
  const { series_id, category_id, color_id } = req.body;

  // if([series, category, color].some(fields=> fields.trim()==='')){
  //   throw new ApiError(500, "All fields are required!!")
  // }
  // const productList= await Product.aggregate([
  //   {
  //     $match: {
  //       Series: series,
  //       Category:category,
  //       Color:color
  //     },
  //   },
  // ])

  // return res.status(200).json(new ApiResponse(201, productList,"Got the products Successfully!!"))

  //////************sql code */

  if (!series_id || !category_id || !color_id)
    throw new ApiError(500, "sereis , color and category are required!!");

  const query = `
    SELECT DISTINCT product.prod_id, product.prod_name
    FROM product
    INNER JOIN color ON product.color_id = color.col_id
    WHERE product.series_id = ${series_id} AND product.category_id = ${category_id} AND product.color_id = ${color_id}`;

  connection.query(query, (error, result) => {
    if (error)
      throw new ApiError(500, "somehting went worinng in sql " + error);

    console.log(result);

    return res
      .status(200)
      .json(new ApiResponse(201, result, "Got the products Successfully!!"));
  });
});

const updateProductQuantity = asyncHandler(async (req, res) => {
  const { quantity, product_id } = req.body;

  if (quantity <= 0 || !product_id) {
    throw new ApiError(
      400,
      "Quantity must be greater than 0 and product_id is required"
    );
  }

  const product = await Product.findOne({ _id: product_id });

  if (!product) {
    throw new ApiError(404, "No product found");
  }
  console.log(product);
  product.Quantity = quantity;

  const updated_product = await product.save();

  if (!updated_product) {
    throw new ApiError(500, "Something went wrong in updating product");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updated_product, "Product updated"));
});

export {
  getAllCDProducts,
  addCDProduct,
  updateProductQuantity,
  searchProduct,
  getProductById,
  getAllSeries,
  getAllCategoriesOfAseries,
  updateNullCategoryToXYZ,
  getAllColors,
  getTheFinalProductList,
};
