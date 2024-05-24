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
        "http://localhost:9000/api/jung/v1/products/getallcolors",
        { withCredentials: true }
      );

      if (!res) throw new Error("Error in fetching categories!!");
      console.log(res.data.data);
      setAllColor(res.data.data.sort());
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdate= async()=>{
    console.log(currSeries, currCategory, currColor, currName)

    try {
      const response= await axios.post("http://localhost:9000/api/jung/v1/products/updateproduct",{
        prod_id: _id, prod_name:currName, cat_id:currCategory, ser_id: currSeries, col_id: currColor, photo:currPhoto
      }, {
        withCredentials:true
      })

      if(!response.data.data) throw new Error("Something went wrong in updating prodcut!!")

      console.log(response.data.data);

      alert("Prodcut updated successfully");
      fetchProdcutData();
    } catch (error) {
      alert("error in updating product!!!")
      console.log(error);
    }
  }

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

        <div className="flex fixed right-10 top-10 justify-center items-center gap-5 bg-green-600 text-white p-3 rounded-lg cursor-pointer hover:bg-green-700" onClick={handleUpdate}>
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
            onChange={(e)=>setCurrName(e.target.value)}
          />
        </label>

        {/* Details */}
        <div className="p-3 w-96 bg-[#d0e9ff] rounded-lg text-black flex flex-col gap-4 items-start justify-center">
          <p className="font-semibold text-xl">Select Details</p>
          <label className="w-full flex gap-4 items-center justify-start">
            <p>Select Series : </p>
            <select placeholder="Series" value={currSeries} onChange={(e)=>setCurrSeries(e.target.value)} className="w-40 p-2">
            <option value="">Series</option>
            {
              allSeries?.map((e)=>{
                return <option key={e.ser_id} value={e.ser_id}>{e.ser_name}</option>
              })
            }
          </select>
          </label>
          
          <label className="w-full flex gap-4 items-center justify-start">
            <p>Select Series : </p>
          <select placeholder="Category" value={currCategory} onChange={(e)=>setCurrCategory(e.target.value)} className="w-40 p-2">
          <option value="">Category</option>
          {
              allCategory?.map((e)=>{
                return <option value={e.cat_id} key={e.cat_id}>{e.cat_name}</option>
              })
            }
          </select></label>

          <label className="w-full flex gap-4 items-center justify-start">
            <p>Select Series : </p>
          <select placeholder="Color" value={currColor} onChange={(e)=>setCurrColor(e.target.value)} className="w-40 p-2">
          <option value="">Color</option>
          {
              allColor?.map((e)=>{
                return <option value={e.col_id} key={e.col_id}>{e.col_name}</option>
              })
            }
          </select></label>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
