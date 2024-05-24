import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoArrowBackSharp } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";

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

  const fetchProdcutData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/jung/v1/products/getproductbyid/${_id}`
      );

      if (!response) throw new Error("Cat get the response...");
      console.log(response.data.data);
      setProduct(response.data.data);
      setCurrSeries(response.data.data.ser_name);
      setCurrCategory(response.data.data.cat_name);
      setCurrName(response.data.data.prod_name);
      setCurrColor(response.data.data.col_name);
      setCurrPhoto(response.data.data.photo);
      // setQty(Number(response.data.data.Quantity));
    } catch (error) {
      // console.log(error);
    }
  };

  const fetchSeries = async () => {
    try {
      const res = await axios.get(
        "http://localhost:9000/api/jung/v1/products/getallseries",
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
        "http://localhost:9000/api/jung/v1/products/getallcategories",
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
        "http://localhost:9000/api/jung/v1/products/getallcategories",
        { withCredentials: true }
      );

      if (!res) throw new Error("Error in fetching categories!!");
      console.log(res.data.data);
      setAllColor(res.data.data.sort());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProdcutData();
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

        <div className="flex fixed right-10 top-10 justify-center items-center gap-5 bg-green-600 text-white p-3 rounded-lg cursor-pointer hover:bg-green-700">
          Save <FaCheck />
        </div>

        <img
          src={currPhoto}
          alt="prodcut_image"
          className="w-72 aspect-square rounded-xl shadow-xl p-2"
        />

        <label
          htmlFor="prod_name"
          className="flex justify-center items-center gap-5 font-bold text-3xl"
        >
          <p>Edit Name : </p>
          <input
            className="bg-lime-50 p-2 w-60"
            name="prod_name"
            id="prod_name"
            value={currName}
          />
        </label>

        {/* Details */}
        <div className="p-3 w-96 bg-[#d0e9ff] rounded-lg text-black">
          <p className="font-semibold text-xl">Select Details</p>
          <select placeholder="Series" value={currSeries}>
            <option value=""></option>
          </select>
          <select placeholder="Category" value={currCategory}>
            <option value=""></option>
          </select>
          <select placeholder="Color" value={currColor}>
            <option value=""></option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
