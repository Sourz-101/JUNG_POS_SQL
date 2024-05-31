import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TimeLine from "../components/TimeLine";
import { IoArrowBackSharp, IoGitMerge } from "react-icons/io5";

const Level3 = () => {
  const { series, category } = useParams();
  console.log(series, category);
  const [color, setColor] = useState([]);

  const handleOption = (e) => {
    console.log(e.target.innerText);
  };

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const res = await axios.post(
          "https://jung-pos-sql.onrender.com/api/jung/v1/products/getallcolorsofseriesandcat",
          { series_id: series, category_id: category },
          { withCredentials: true }
        );

        if (!res) throw new Error("Error in fetching Categories!!");
        console.log(res.data.data);
        setColor(res.data.data.sort());
      } catch (error) {
        console.log(error);
      }
    };
    fetchSeries();
  }, [series, category]);

  return (
    <div className="bg-[#F9FDFF] min-h-screen p-2 flex flex-col items-center justify-start">
      <Link
        to={`/select/${series}`}
        className="text-white absolute start-4 top-5"
      >
        <IoArrowBackSharp size={35} className="text-[#175CD3]" />
      </Link>
      <div className="flex w-[60vw] justify-center items-center p-5">
        <TimeLine title={`Sereis ${series}`} isLast={false} />
        <TimeLine title={`Category ${category}`} isLast={false} />
        <TimeLine title={"Select Color"} isLast={true} />
      </div>

      {color.length === 0 ? <span className="loading loading-spinner text-info size-20 mt-20"></span> : ""}

      <div className={`${ color.length < 3 ? ("flex") : ("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3") } gap-4 items-center justify-center text-white text-2xl font-bold`}>
        {color?.map((item, index) => {
          return (
            <Link
              to={`/select/${series}/${category}/${item.color_id}`}
              className="rounded-md bg-[#1849A8] p-3 m-2 w-full text-center"
              key={item.color_id}
            >
              <div key={index} onClick={handleOption}>
                {item.col_name}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Level3;
