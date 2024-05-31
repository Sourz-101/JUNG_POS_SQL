import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoArrowBackSharp } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { MdDelete } from "react-icons/md";

const EditProduct = () => {
  const { series, category, color, _id } = useParams();
  const [product, setProduct] = useState({});

  const [currSeries, setCurrSeries] = useState("");
  const [currCategory, setCurrCategory] = useState("");
  const [currColor, setCurrColor] = useState("");
  const [currName, setCurrName] = useState("");
  const [currPhoto, setCurrPhoto] = useState("");

  const [allSeries, setAllSeries] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [allColor, setAllColor] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const deleteProduct = async () => {
    try {
      if (!confirm("Are you sure want to delete porduct?")) {
        return;
      }
      setLoader(true);
      const res = await axios.post(
        `https://jung-pos-sql.onrender.com/api/jung/v1/products/deleteproduct`,
        { prod_id: _id },
        { withCredentials: true }
      );

      if (!res) throw new Error("Error in fetching series!!");
      console.log(res.data.data);
      toast.success("Product deleted successffully");
      setLoader(false);
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.data);
      setLoader(false);
    }
  };

  const fetchProdcutData = async () => {
    try {
      const response = await axios.get(
        `https://jung-pos-sql.onrender.com/api/jung/v1/products/getproductbyid/${_id}`
      );

      if (!response) throw new Error("Cat get the response...");
      console.log(response.data.data);
      setProduct(response.data.data);
      setCurrSeries(response.data.data.ser_id);
      setCurrCategory(response.data.data.cat_id);
      setCurrName(response.data.data.prod_name);
      setCurrColor(response.data.data.col_id);
      setCurrPhoto(response.data.data.photo);
      // setQty(Number(response.data.data.Quantity));
    } catch (error) {
      // console.log(error);
    }
  };

  const fetchSeries = async () => {
    try {
      const res = await axios.get(
        "https://jung-pos-sql.onrender.com/api/jung/v1/products/getallseries",
        { withCredentials: true }
      );

      if (!res) throw new Error("Error in fetching series!!");
      console.log(res.data.data);
      setAllSeries(res.data.data.sort());
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://jung-pos-sql.onrender.com/api/jung/v1/products/getallcategories",
        { withCredentials: true }
      );

      if (!res) throw new Error("Error in fetching categories!!");
      console.log(res.data.data);
      setAllCategory(res.data.data.sort());
    } catch (error) {
      console.log(error);
    }
  };
  const fetchColors = async () => {
    try {
      const res = await axios.get(
        "https://jung-pos-sql.onrender.com/api/jung/v1/products/getallcolors",
        { withCredentials: true }
      );

      if (!res) throw new Error("Error in fetching categories!!");
      console.log(res.data.data);
      setAllColor(res.data.data.sort());
    } catch (error) {
      console.log(error);
    }
  };

  const [loading, setLoading] = useState(false);
  const handleUpdate = async () => {
    console.log(currSeries, currCategory, currColor, currName);

    if (
      [currSeries, currCategory, currColor, currName].some(
        (field) => field === ""
      )
    ) {
      toast.error("All fields are required!! and stock can't be 0");
      return;
    }

    try {
      if (!confirm("Are you sure want to edit porduct?")) {
        return;
      }
      setLoading(true);
      const response = await axios.post(
        "https://jung-pos-sql.onrender.com/api/jung/v1/products/updateproduct",
        {
          prod_id: _id,
          prod_name: currName,
          cat_id: currCategory,
          ser_id: currSeries,
          col_id: currColor,
          photo: currPhoto,
        },
        {
          withCredentials: true,
        }
      );

      if (!response.data.data)
        throw new Error("Something went wrong in updating prodcut!!");

      console.log(response.data.data);

      // alert("Prodcut updated successfully");
      toast.success("Product updated successfully!!");
      fetchProdcutData();
    } catch (error) {
      toast.error(error.response.data.data);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdcutData();
    fetchSeries();
    fetchCategories();
    fetchColors();
  }, [_id]);

  return (
    <div className="w-full h-full ">
      <div className="bg-[#F9FDFF] w-full max-h-screen h-screen p-5 flex items-center justify-center flex-col gap-3 overflow-hidden">
        <Link
          to={
            series && category && color
              ? `/select/${series}/${category}/${color}/${_id}`
              : `/${_id}`
          }
          className="text-black fixed left-4 top-5"
        >
          <IoArrowBackSharp size={35} className="text-[#175CD3]" />
        </Link>

        {!loading ? (
          <div
            className="flex fixed right-10 top-10 justify-between items-center gap-5 bg-green-600 text-white p-3 rounded-lg cursor-pointer hover:bg-green-700 w-28"
            onClick={handleUpdate}
          >
            Save <FaCheck />
          </div>
        ) : (
          <span className="flex fixed right-10 top-10 justify-center items-center gap-5 bg-green-600  p-3 rounded-lg cursor-pointer hover:bg-green-700 loading loading-spinner text-primary"></span>
        )}
        {!loader ? (
          <div
            className="flex fixed right-10 top-24 justify-between items-center gap-5 bg-red-600 text-white p-3 rounded-lg cursor-pointer hover:bg-red-700 w-28"
            onClick={deleteProduct}
          >
            Delete <MdDelete size={20} />
          </div>
        ) : (
          <span className="flex fixed right-10 top-24 justify-center items-center gap-5 bg-red-600  p-3 rounded-lg cursor-pointer hover:bg-red-700 loading loading-spinner text-error"></span>
        )}
        <img
          src={currPhoto}
          alt="prodcut_image"
          className="w-72 aspect-square rounded-xl shadow-lg"
        />

        <label
          htmlFor="prod_name"
          className="flex justify-center items-center gap-5 font-bold text-xl"
        >
          <p>Edit Name : </p>
          <input
            className="bg-lime-50 p-2 w-60 border border-black rounded-lg"
            name="prod_name"
            id="prod_name"
            value={currName}
            onChange={(e) => setCurrName(e.target.value)}
          />
        </label>

        {/* Details */}
        <div className="p-3 w-96 bg-[#d0e9ff] rounded-lg text-black grid grid-cols-2 gap-4 items-center justify-start">
          <p className="font-semibold text-xl col-span-2">Select Details</p>

          <p>Select Series : </p>
          <select
            placeholder="Series"
            value={currSeries}
            onChange={(e) => setCurrSeries(e.target.value)}
            className="w-40 p-2"
          >
            <option value="">Series</option>
            {allSeries?.map((e) => {
              return (
                <option key={e.ser_id} value={e.ser_id}>
                  {e.ser_name}
                </option>
              );
            })}
          </select>

          <p>Select Category : </p>
          <select
            placeholder="Category"
            value={currCategory}
            onChange={(e) => setCurrCategory(e.target.value)}
            className="w-40 p-2"
          >
            <option value="">Category</option>
            {allCategory?.map((e) => {
              return (
                <option value={e.cat_id} key={e.cat_id}>
                  {e.cat_name}
                </option>
              );
            })}
          </select>

          <p>Select Colour : </p>
          <select
            placeholder="Color"
            value={currColor}
            onChange={(e) => setCurrColor(e.target.value)}
            className="w-40 p-2"
          >
            <option value="">Color</option>
            {allColor?.map((e) => {
              return (
                <option value={e.col_id} key={e.col_id}>
                  {e.col_name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
