import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const AddSeries = () => {
  const [newSeries, setNewSeries] = useState("");

  const addNewSeries = async (e) => {
    e.preventDefault();
    if(newSeries==="") {
        document.getElementById('add_series').close()
        toast.error("Please Enter the Name of Series!")

        return;
    }
    if(!confirm("Are you sure want to add new Series")){
        return;
    }
    try {
      const response = await axios.post(
        "http://localhost:9000/api/jung/v1/products/addseries",
        { ser_name: newSeries },
        {
          withCredentials: true,
        }
      );

      if (!response.data.data)
        throw new Error("Something went worng in adding new series");

      toast.success("New series added");
      console.log(response.data.data);
    } catch (error) {
      toast.error(error.response.data.data);
      console.log(error);
    }
  };
  return (
    <dialog id="add_series" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form onSubmit={addNewSeries} className='w-full h-fit flex flex-col gap-5  p-2'>
          <h3 className="font-bold text-lg">Enter New Series Name</h3>
          <input
            type="text"
            placeholder="New Series Name"
            value={newSeries}
            className='input input-accent'
            onChange={(e) => setNewSeries(e.target.value)}
          />
          <input type="submit" value={"Add Series"} className='btn btn-accent'/>
        </form>
      </div>
    </dialog>
  );
};

export default AddSeries;
