import axios from "axios";
import React, { useEffect, useState } from "react";

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
    user_id:1
  });

  const [allSeries, setAllSeries] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [allColor, setAllColor] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
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

  const handleSubmit= async(e)=>{
    e.preventDefault();
    console.log(input)

    try {
        const response = await axios.post('http://localhost:9000/api/jung/v1/products/addcdproduct',input, {withCredentials:true});
        if(!response.data.data) throw new Error("Something went wrong in adding the product!!!")

        alert("Product Added Successfully!!!");
        console.log(response.data.data)
    } catch (error) {
        console.log(error);
        alert(error.response.data.message)
    }
  }

  useEffect(() => {
    fetchSeries();
    fetchCategories();
    fetchColors();
  }, []);
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center p-5">
      <form onSubmit={handleSubmit}
        className="bg-blue-500 w-1/3 h-[95%] flex flex-col justify-start items-center p-5 gap-5"
      >
        <div className=" w-full flex flex-col justify-center items-center">
          <img
            src={displayImage ? displayImage : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSN1CKylUxNRuDeI7_41jDKtltoW4FaJktKHwJOwkguNInjjepOh7Yp-iHm9NYypTLmzU&usqp=CAU"}
            alt="Uploaded"
            className="h-32 aspect-square object-cover"
          />
          <input type="file" accept="image/*" onChange={(e)=>{
            setInput({...input, photo:e.target.files[0]})
            handleImageChange(e)}} />
        </div>


        <label
          htmlFor="prodcut_name"
          className=" flex gap-10 items-center justify-between w-4/5"
        > Product Name : 
        <input type="text" id="product_name" name="product_name" placeholder="product name" className="w-40 p-2" onChange={(e)=>setInput({...input, prod_name:e.target.value})}/></label>



        <label className=" flex gap-4 items-center justify-between w-4/5">
          <p>Select Series : </p>
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
        </label>

        <label className=" flex gap-4 items-center justify-between w-4/5">
          <p>Select Series : </p>
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
        </label>

        <label className=" flex gap-4 items-center justify-between w-4/5">
          <p>Select Series : </p>
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
        </label>

        <label
          htmlFor="stock"
          className=" flex gap-16 items-center justify-between w-4/5"
        >
          Stock :
          <input
            type="number"
            name="stock"
            id="stock"
            value={input.stock}
            onChange={(e) =>
              setInput({
                ...input,
                stock: e.target.value > 0 ? e.target.value : 0,
              })
            }
            className="w-40 p-2"
          />
        </label>

        <label
          htmlFor="isarchive"
          className="flex gap-10 items-center justify-between w-4/5"
        >
          isArchive :
          <select name="isarchive" id="isarchive" value={input.archive} onChange={(e)=>setInput({...input, archive:e.target.value})} className="w-40 p-2">
            
            <option value={1}>Yes</option>
            <option value={0}>No</option>
          </select>
        </label>
        <input type="submit" value="submit" className="btn"/>
      </form>
    </div>
  );
};

export default AddProduct;
