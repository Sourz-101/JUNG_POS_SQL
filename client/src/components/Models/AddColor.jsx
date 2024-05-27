import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const AddColor = () => {
    const [newColor, setNewColor] = useState("");

    const addNewColor= async (e)=>{
        e.preventDefault();
        if(newColor==="") {
            document.getElementById('add_color').close()
            toast.error("Please Enter the Name of Color!")
            return;
            
        }
        if(!confirm("Are you sure want to add new Color")){
            return;
        }
        try {
            console.log("fetchin...")
          const response= await axios.post("https://jung-pos-sql.onrender.com/api/jung/v1/products/addcolor",{col_name:newColor},{
            withCredentials:true
          })
    
          if(!response.data.data) throw new Error("Something went worng in adding new color");
    
          toast.success("New color added");
          console.log(response.data.data);
        } catch (error) {
          toast.error(error.response.data.data);
          console.log(error);
        }
      }
    return (
      <dialog id="add_color" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form onSubmit={addNewColor} className='w-full h-fit flex flex-col gap-5  p-2'>
            <h3 className="font-bold text-lg">Enter New Color Name</h3>
            <input
              type="text"
              placeholder="New Color Name"
              value={newColor}
              className='input input-accent'
              onChange={(e) => setNewColor(e.target.value)}
            />
            <input type="submit" value={"Add Color"} className='btn btn-accent'/>
          </form>
        </div>
      </dialog>
    );
}

export default AddColor
