import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [text, setText] = useState("");
  const [style, setStyle] = useState("center");

  const [resustantData, setResustantData] = useState([]);
  const fetchProdcuts = async () => {
    try {
      console.log("fetching...");

      const response = await axios.post(
        "http://localhost:9000/api/jung/v1/products/searchproducts",
        { inputText: text },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response) {
        throw new Error("Error in fetching");
      }
      console.log(response);
      const resData = response?.data?.data;
      console.log(resData);
      setResustantData(resData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (text === "") {
      setResustantData([]);
      setStyle("center");
      document.getElementById("input").style.width = "400px";
      document.getElementById("cont").style.justifyContent = "center";
      return;
    } else {
      console.log("value");
      setStyle("start");
      document.getElementById("input").style.width = "80%";
      document.getElementById("cont").style.justifyContent = "start";
    }

    let timmer = setTimeout(() => {
      console.log("fetchiin....");
      fetchProdcuts();
    }, 500);

    return () => {
      clearTimeout(timmer);
    };
  }, [text]);
  return (
    <div
      className={`h-screen bg-[#F9FDFF] w-full flex flex-col gap-10 items-center text-4xl`}
      id="cont"
      onClick={() => setText("")}
    >
    {text==='' ? <Link to={`/addproduct`} className="fixed top-10 right-10 text-xl font-semibold bg-[#1470EF] cursor-pointer hover:bg-blue-700 text-white p-2 rounded-lg"> + Add Product</Link> : ""}
      {/* <SearchBar/> */}
      {
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="transition-all duration-500 m-5 p-2 border-2 border-[#1849A8] rounded-lg w-60 text-black text-center"
          id="input"
          placeholder="Search Product"
        />
      }
      {text != "" ? (
        <div className="result relative shadow-sm shadow-black w-[1100px]  rounded-lg overflow-y-auto overflow-x-hidden -top-14">
          {resustantData?.map((e) => {
            return (
              <Link to={`/product/${e.prod_id}`} key={e.prod_id}>
                <div className="w-full bg-white rounded-sm flex justify-around items-center p-2 border-2 cursor-pointer hover:bg-slate-100">
                  <img
                    src={e.photo}
                    alt="img"
                    className="w-12 h-12 object-cover"
                  />
                  <p className="font-semibold ">{e.prod_name}</p>
                  <p className="font-semibold ">{e.cat_name}</p>
                  <p className="font-semibold ">{e.col_name}</p>
                  <p className="font-semibold ">{e.stock}</p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        ""
      )}

      {text === "" ? (
        <p className="text-[#1470EF] font-bold text-4xl">OR</p>
      ) : (
        ""
      )}
      {text === "" ? (
        <Link
          to="/select"
          className="btn w-[400px] bg-[#1849A8] text-white text-4xl h-[65px]"
        >
          Select Product
        </Link>
      ) : (
        ""
      )}
    </div>
  );
};

export default Home;
