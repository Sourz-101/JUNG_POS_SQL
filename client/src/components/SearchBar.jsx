import React, { useEffect, useState } from "react";
import axios from "axios";
const SearchBar = () => {
  const [inputText, setInputText] = useState("");
  const [resustantData, setResustantData] = useState([]);
  const fetchProdcuts = async () => {
    try {
    //   console.log("fetching...");
      const response = await axios.post(
        "http://localhost:9000/api/jung/v1/products/searchproducts",
        { inputText },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response) {
        throw new Error("Error in fetching");
      }
    //   console.log(response);
      const resData = response?.data?.data;
      console.log(resData);
      setResustantData(resData)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(inputText===''){
        setResustantData([]);
        return;
    }
    let timmer = setTimeout(() => {
      fetchProdcuts();
    }, 500);

    return () => {
      clearTimeout(timmer);
    };
  }, [inputText]);
  return (
    <div className="w-full h-20  p-4 bg-gray-300 ">
      <input
        type="text"
        value={inputText}
        onChange={(e) => {
          setInputText(e.target.value);
        }}
        placeholder="Search your Porduct"
        className="input input-bordered w-full "
      />

      <div className="result max-h-[300px] relative shadow-sm shadow-black w-full  rounded-lg overflow-y-auto overflow-x-hidden ">
        {
            resustantData?.map((e)=>{
                return(
                    <div className="w-full  bg-white rounded-sm flex justify-around items-center p-2 border-2 cursor-pointer hover:bg-slate-100">
                        <img src={e.Image} alt="img" className="w-12 h-12 object-cover"/>
                        <p className="font-semibold ">{e.Name}</p>
                        <p className="font-semibold ">{e.Category}</p>
                        <p className="font-semibold ">Color</p>
                        <p className="font-semibold ">{e.Quantity}</p>
                        <p className="font-semibold ">{e["Added Date"]}</p>
                    </div>
                )
            })
        }
      </div>
    </div>
  );
};

export default SearchBar;
