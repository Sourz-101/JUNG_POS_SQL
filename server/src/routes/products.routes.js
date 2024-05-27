import { Router } from "express";
import {
  addCDProduct,
  addCategory,
  addColor,
  addSeries,
  deleteCategory,
  deleteColor,
  deleteProduct,
  deleteSeries,
  getAllCDProducts,
  getAllCategories,
  getAllCategoriesOfAseries,
  getAllColors,
  getAllColorsOfSereisAndCat,
  getAllSeries,
  getProductByCategoryId,
  getProductById,
  getTheFinalProductList,
  searchProduct,
  updateNullCategoryToXYZ,
  updateProduct,
  updateProductQuantity,
} from "../controllers/products.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();
router.route("/getcdproducts").get(getAllCDProducts);
router.route("/addcdproduct").post(upload.single("photo"), addCDProduct);
router.route("/searchproducts").post(searchProduct);
router.route("/getproductbyid/:_id").get(getProductById);
router.route("/updatecat").get(updateNullCategoryToXYZ);
router.route("/updateproductquantity").post(updateProductQuantity);

router.route("/getallseries").get(getAllSeries);
router.route("/getallcategories").get(getAllCategories);
router.route("/getallcolors").get(getAllColors);
router.route("/getallcategoriesofseries").post(getAllCategoriesOfAseries);
router.route("/getallcolorsofseriesandcat").post(getAllColorsOfSereisAndCat);
router.route("/getfinalproductlist").post(getTheFinalProductList);
router.route("/updateproduct").post(updateProduct);
router.route("/addseries").post(addSeries);
router.route("/addcategory").post(addCategory);
router.route("/addcolor").post(addColor);


router.route('/deletecategory').post(deleteCategory)
router.route('/deleteseries').post(deleteSeries)
router.route('/deletecolor').post(deleteColor)
router.route('/deleteproduct').post(deleteProduct)
router.route('/getprodbyid/:ser_id').get(getProductByCategoryId)

export default router;
