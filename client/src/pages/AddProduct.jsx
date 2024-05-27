import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoArrowBackSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

const AddProduct = () => {
  const [displayImage, setDisplayImage] = useState("");
  const [input, setInput] = useState({
    photo: "",
    prod_name: "",
    cat_id: "",
    ser_id: "",
    col_id: "",
    stock: 0,
    archive: 0,
    user_id: 1,
  });

  const [allSeries, setAllSeries] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [allColor, setAllColor] = useState([]);

  const handleImageChange = () => {
    const file = input.photo;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDisplayImage(reader.result);
      };
      reader.readAsDataURL(file);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(input);

    try {
      const response = await axios.post(
        "http://localhost:9000/api/jung/v1/products/addcdproduct",
        input,
        { withCredentials: true }
      );
      if (!response.data.data)
        throw new Error("Something went wrong in adding the product!!!");

      alert("Product Added Successfully!!!");
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchSeries();
    fetchCategories();
    fetchColors();
  }, []);
  useEffect(() => {
    handleImageChange();
  }, [input.photo]);
  return (
    <div className="w-full h-full ">
      <div className="bg-[#F9FDFF] w-full  h-screen p-5 flex items-center justify-center flex-col md:flex-row lg:flex-row gap-3 ">
        <Link to={"/"} className="text-black fixed left-4 top-5">
          <IoArrowBackSharp size={35} className="text-[#175CD3]" />
        </Link>

        <div
          className="flex fixed right-4 top-5 justify-center items-center gap-5 bg-green-600 text-white p-3 rounded-lg cursor-pointer hover:bg-green-700"
          onClick={handleSubmit}
        >
          ADD <FaCheck />
        </div>

        {/* Image Input */}
        <div className="w-full md:w-1/3 h-fit flex flex-col justify-center items-start md:items-center sm:items-center gap-5">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setInput({ ...input, photo: e.target.files[0] })}
          />
          <img
            src={
              displayImage ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png"
            }
            alt="prodcut_image"
            className="w-80 aspect-square rounded-xl shadow-lg mt-2"
          />
        </div>

        <div className="w-fit flex flex-col justify-center items-start gap-5">
          <label
            htmlFor="prod_name"
            className="flex justify-center items-center gap-5 font-bold text-xl"
          >
            <p>Product Name </p>
            <input
              className="bg-lime-50 p-2 w-60 border border-black rounded-lg"
              name="prod_name"
              id="prod_name"
              value={input.prod_name}
              onChange={(e) =>
                setInput({ ...input, prod_name: e.target.value })
              }
            />
          </label>

          {/* Details */}
          <div className="p-3 w-fit bg-[#d0e9ff] rounded-lg text-black flex flex-col gap-4 items-start justify-center">
            <p className="font-semibold text-xl">Select Details</p>

            <div className="text-black grid grid-cols-2 gap-4 items-center justify-start">
              <label className="w-full flex gap-4 items-center justify-start">
                <p>Select Series : </p>
              </label>
              <select
                placeholder="Series"
                value={input.ser_id}
                onChange={(e) => setInput({ ...input, ser_id: e.target.value })}
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

              <label className="w-full flex gap-4 items-center justify-start">
                <p>Select Category : </p>
              </label>
              <select
                placeholder="Category"
                value={input.cat_id}
                onChange={(e) => setInput({ ...input, cat_id: e.target.value })}
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

              <label className="w-full flex gap-4 items-center justify-start">
                <p>Select Color : </p>
              </label>
              <select
                placeholder="Color"
                value={input.col_id}
                onChange={(e) => setInput({ ...input, col_id: e.target.value })}
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

              <label className="w-full flex gap-4 items-center justify-start">
                <p>Enter Stock Quantity : </p>
              </label>
              <input
                type="number"
                placeholder="Stock Quantity"
                value={input.stock}
                onChange={(e) => setInput({ ...input, stock: e.target.value })}
                className="w-40 p-2"
              />

              <label className="w-full flex gap-4 items-center justify-start">
                <p>Archived : </p>
              </label>
              <select
                placeholder="Color"
                value={input.archive}
                onChange={(e) =>
                  setInput({ ...input, archive: e.target.value })
                }
                className="w-40 p-2"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
