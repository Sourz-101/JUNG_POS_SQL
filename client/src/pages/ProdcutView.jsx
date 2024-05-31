import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa6";
import { set } from "mongoose";

const ProdcutView = () => {
  const { _id, series, category, color } = useParams();

  const [product, setProdcut] = useState({});
  const [quantity, setQuantity] = useState(0);
  const [qty, setQty] = useState(0);
  const [loader, setLoader] = useState(false);

  const [currentStockEditable, setCurrentStockEditable] = useState(false);

  // Initial Fetching of the product data
  // https://jung-pos-sql.onrender.com/api/jung/v1/products/getproductbyid/663dfadfb3162e8be41281d0a
  const fetchProdcutData = async () => {
    try {
      const response = await axios.get(
        `https://jung-pos-sql.onrender.com/api/jung/v1/products/getproductbyid/${_id}`
      );

      if (!response) throw new Error("Cat get the response...");
      console.log(response.data.data);
      setProdcut(response.data.data);
      setQuantity(Number(response.data.data.stock));
      // setQty(Number(response.data.data.Quantity));
    } catch (error) {
      // console.log(error);
    }
  };
  useEffect(() => {
    fetchProdcutData();
  }, [_id]);

  // Function to update the product quantity
  const updateProductQuantity = async (num) => {
    setLoader(true);
    // If newly updated quantity is same as the current quantity then return
    if (num === quantity) {
      setLoader(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://jung-pos-sql.onrender.com/api/jung/v1/products/updateproductquantity",
        { quantity: num, product_id: _id },
        { withCredentials: true }
      );

      if (!response) throw new Error("Can't update Quantity!!");

      console.log(response.data.data);
      setLoader(false);

      toast.success("Quantity Updated Successfully!!!");
      // alert("Quantity Updated Successfully!!");
      setQty(0);
      fetchProdcutData();
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const handleEditButton = () => {
    setCurrentStockEditable(!currentStockEditable);
    updateProductQuantity(Number(quantity));
  };

  return (
    <div className="bg-[#F9FDFF] w-full max-h-screen h-screen p-5 flex items-center justify-center flex-col gap-3 overflow-hidden">
      <Link
        to={
          series && category && color && _id
            ? `/select/${series}/${category}/${color}`
            : `/`
        }
        className="text-black fixed left-4 top-5"
      >
        <IoArrowBackSharp size={35} className="text-[#175CD3]" />
      </Link>

      <Link
        to={
          series && category && color
            ? `/select/${series}/${category}/${color}/${_id}/editproduct`
            : `/${_id}/editproduct`
        }
        className="flex fixed right-10 top-10 justify-center items-center gap-5 bg-[#1470EF] text-white p-3 rounded-lg cursor-pointer hover:bg-blue-700"
      >
        Edit Product <MdEdit size={20} />
      </Link>
      <img
        src={product.photo}
        alt=""
        className="w-72 aspect-square rounded-xl shadow-xl p-2"
      />

      <p className="text-3xl font-bold p-2">{product.prod_name}</p>

      {/* Current Stock */}
      <div className="flex w-96 justify-between items-center text-black gap-4">
        <div className="flex justify-center items-center text-xl font-semibold border-gray-500 rounded-lg w-80 gap-2 p-4 bg-[#d0e9ff] h-20">
          <p>Current Stock : </p>
          <input
            type="number"
            className={`no-spinners border-2 rounded-md h-20 text-3xl font-bold w-24 flex justify-center items-center bg-[#d0e9ff] text-center ${
              currentStockEditable
                ? "px-2 bg-[#f9fdff] h-16 w-20"
                : "border-transparent"
            }`}
            value={quantity}
            onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
            readOnly={!currentStockEditable}
          />
        </div>
        <button
          className={`btn ${
            !currentStockEditable
              ? "bg-[#1470EF] hover:bg-blue-800"
              : "bg-green-600 hover:bg-green-700"
          } text-xl h-20 w-20`}
          onClick={handleEditButton}
        >
          {currentStockEditable ? (
            <FaCheck size={30} className="text-white" />
          ) : (
            <MdEdit size={30} className="text-white" />
          )}
        </button>
      </div>

      {/* Add Subtract Input Box */}
      <div className="flex h-20 w-96 gap-4 ">
        <button
          className="btn border text-4xl w-20 h-20 bg-[#1470EF] hover:bg-blue-800 rounded-md text-white font-bold"
          onClick={() => updateProductQuantity(Number(quantity - qty))}
        >
          {loader ? (
            <span className="loading loading-spinner text-info"></span>
          ) : (
            " - "
          )}
        </button>
        <input
          className="no-spinners border-2 rounded-md h-20 text-3xl font-bold w-48 flex justify-center items-center bg-[#d0e9ff] text-center"
          value={qty}
          type="number"
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            setQty(e.target.value);
          }}
          onClick={(e) => (e.target.value = " ")}
        />
        <button
          className="btn border text-4xl w-20 h-20 bg-[#1470EF] hover:bg-blue-800 rounded-md text-white font-bold"
          onClick={() => updateProductQuantity(Number(quantity) + Number(qty))}
        >
          {loader ? (
            <span className="loading loading-spinner text-info"></span>
          ) : (
            " + "
          )}
        </button>
      </div>

      {/* Details */}
      <div className="p-3 w-96 bg-[#d0e9ff] rounded-lg text-black">
        <p className="font-semibold text-xl">Details</p>
        <p>Name : {product.prod_name}</p>
        <p>Category : {product.cat_name}</p>
        <p>Color : {product.col_name ? product.col_name : "Not Def"}</p>
      </div>
    </div>
  );
};

export default ProdcutView;
// COmment