import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/products.model.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { sqlDatabase } from "../db/sql.config.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const connection = sqlDatabase();

//done
const getAllCDProducts = asyncHandler(async (req, res) => {
  const query = `select * from product`;

  connection.query(query, (error, result) => {
    if (error)
      throw new ApiError(
        500,
        "Something went wrong in fetching the cd Prodcuts!!"
      );

    console.log(result);
    return res
      .status(200)
      .json(new ApiResponse(201, result, "Got All prudcuts!!"));
  });
});

//done
const addCDProduct = asyncHandler(async (req, res) => {
  // const { Name, Category, Image, Quantity, AddedDate } = req.body;

  // const Cdinstance = await Product.create({
  //   Name,
  //   Category,
  //   Image,
  //   Quantity,
  //   "Added Date": AddedDate,
  // });

  // if (!Cdinstance) {
  //   throw new ApiError(500, "Error in adding data!!");
  // }

  // return res
  //   .status(200)
  //   .json(new ApiResponse(201, Cdinstance, "added successfully!!"));

  /////***************sql code************ */

  const { prod_name, ser_id, cat_id, col_id, stock, archive, user_id } =
    req.body;

  // console.log(req.files);
  // const photoLocalPath = req.files.photo[0].path;
  // console.log(photoLocalPath);

  // const photo = await uploadOnCloudinary(photoLocalPath);
  // console.log(photo);

  connection.execute(
    "SELECT * FROM product WHERE prod_name = ?",
    [prod_name],
    async (error, results) => {
      if (error) {
        console.error("An error occurred:", error);
        throw new ApiError(500, error);
      }
      console.log(results);

      if (results.length > 0) {
        return res
          .status(500)
          .json(new ApiResponse(501, "product already exist with same name!!"));
      } else {
        // Insert the new product
        const query = `INSERT INTO product (prod_name, series_id, category_id, color_id, stock, archive, user_id, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        connection.execute(
          query,
          [
            prod_name,
            ser_id,
            cat_id,
            col_id,
            stock,
            archive,
            user_id,
            "xyz.jpg",
          ],
          (error, result) => {
            if (error) {
              console.error("An error occurred:", error);
              throw new ApiError(
                500,
                "Something went wrong in adding product!!!",
                error
              );
            }

            console.log(result);
            return res
              .status(201)
              .json(
                new ApiResponse(201, result, "Product added successfully!!!")
              );
          }
        );
      }
    }
  );
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
      return productName?.includes(searchText);
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
    series.ser_id,
    product.photo, 
    category.cat_name, 
    category.cat_id,
    color.col_name, 
    color.col_id,
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

  const query = `select * from series`;

  connection.query(query, (error, result) => {
    if (error) throw new ApiError(500, "no data found by sql" + error);

    console.log(result);

    return res
      .status(200)
      .json(new ApiResponse(201, result, "Got All Series!!"));
  });
});
//done
const getAllCategories = asyncHandler(async (req, res) => {
  const query = `select * from category`;

  connection.query(query, (error, result) => {
    if (error)
      throw new ApiError(
        500,
        "Something went worng in fetching categories!!",
        error
      );

    console.log(result);

    return res
      .status(200)
      .json(new ApiResponse(201, result, "Got all categories!!"));
  });
});
//done
const getAllColors = asyncHandler(async (req, res) => {
  const query = `select * from color`;

  connection.query(query, (error, result) => {
    if (error)
      throw new ApiError(
        500,
        "Something went worng in fetching color!!",
        error
      );

    console.log(result);

    return res
      .status(200)
      .json(new ApiResponse(201, result, "Got all color!!"));
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
const getAllColorsOfSereisAndCat = asyncHandler(async (req, res) => {
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

//done
const updateProductQuantity = asyncHandler(async (req, res) => {
  const { quantity, product_id } = req.body;

  if (quantity <= 0 || !product_id) {
    throw new ApiError(
      400,
      "Quantity must be greater than 0 and product_id is required"
    );
  }

  // const product = await Product.findOne({ _id: product_id });

  // if (!product) {
  //   throw new ApiError(404, "No product found");
  // }
  // console.log(product);
  // product.Quantity = quantity;

  // const updated_product = await product.save();

  // if (!updated_product) {
  //   throw new ApiError(500, "Something went wrong in updating product");
  // }

  // return res
  //   .status(200)
  //   .json(new ApiResponse(200, updated_product, "Product updated"));

  /////************** sql code*************/

  const query = `update product set stock = ${quantity} where prod_id = ${product_id}`;

  connection.query(query, (error, result) => {
    if (error)
      throw new ApiError(
        500,
        "Something went worng in updating quantity!!! ",
        error
      );

    return res
      .status(200)
      .json(new ApiResponse(200, result[0], "Product updated"));
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { prod_id, prod_name, cat_id, ser_id, col_id } = req.body;
  console.log(prod_id, prod_name, cat_id, ser_id, col_id);

  connection.execute(
    "SELECT * FROM product WHERE prod_name = ?",
    [prod_name],
    async (error, results) => {
      if (error) {
        console.error("An error occurred:", error);
        throw new ApiError(500, error);
      }
      console.log(results);

      if (results.length > 0) {
        return res
          .status(500)
          .json(new ApiResponse(501, "product already exist with same name!!"));
      } else {
        const query = `
    select * from product where prod_id = ${prod_id}
  `;

        connection.query(query, (error, result) => {
          if (error)
            throw new ApiError(500, "Something went worng in finding product");

          console.log(result);

          const product = result[0];

          const updateQuery = `
    UPDATE product 
    SET 
        prod_name = ${prod_name ? `'${prod_name}'` : `'${product.prod_name}'`},
        series_id = ${ser_id ? `'${ser_id}'` : `'${product.series_id}'`},
        category_id = ${cat_id ? `'${cat_id}'` : `'${product.category_id}'`},
        color_id = ${col_id ? `'${col_id}'` : `'${product.color_id}'`}
    WHERE 
        prod_id = '${prod_id}'
`;

          connection.query(updateQuery, (error, results) => {
            if (error)
              throw new ApiError(
                500,
                "Something went worng in updating product!!",
                error
              );

            console.log(results);

            return res
              .status(200)
              .json(new ApiResponse(201, results, "Got the product"));
          });
        });
      }
    }
  );
});

const addSeries = asyncHandler(async (req, res) => {
  const { ser_name } = req.body;

  const query = `insert into series (ser_name) values (?)`;

  connection.query(query, [ser_name], (error, result) => {
    if (error) throw new ApiError(500, "Error in genrating the sereis", error);

    return res
      .status(200)
      .json(new ApiResponse(201, result, "added category sussfully!!"));
  });
});
const addCategory = asyncHandler(async (req, res) => {
  const { cat_name } = req.body;

  const query = `insert into category (cat_name) values (?)`;

  connection.query(query, [cat_name], (error, result) => {
    if (error) throw new ApiError(500, "Error in genrating the sereis", error);

    return res
      .status(200)
      .json(new ApiResponse(201, result, "added category sussfully!!"));
  });
});
const addColor = asyncHandler(async (req, res) => {
  const { col_name } = req.body;

  const query = `insert into color (col_name) values (?)`;

  connection.query(query, [col_name], (error, result) => {
    if (error) throw new ApiError(500, "Error in genrating the sereis", error);

    return res
      .status(200)
      .json(new ApiResponse(201, result, "added category sussfully!!"));
  });
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
  getAllColorsOfSereisAndCat,
  getTheFinalProductList,
  getAllCategories,
  getAllColors,
  updateProduct,
  addCategory,
  addSeries,
  addColor,
};
