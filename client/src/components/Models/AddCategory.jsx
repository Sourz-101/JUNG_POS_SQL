import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const AddCategory = () => {
    const [newCategory, setNewCategory] = useState("");

    const addNewCategory = async (e) => {
        e.preventDefault();
      try {
        if(newCategory==="") {
            document.getElementById('add_category').close()
            toast.error("Please Enter the Name of Category!")
            return;
        }
        if(!confirm("Are you sure want to add new Category")){
            return;
        }
        const response = await axios.post(
          "https://jung-pos-sql.onrender.com/api/jung/v1/products/addcategory",
          { cat_name: newCategory },
          {
            withCredentials: true,
          }
        );
  
        if (!response.data.data)
          throw new Error("Something went worng in adding new category");
  
        toast.success("New category added");
        window.location.reload();
        console.log(response.data.data);
      } catch (error) {
        toast.error(error.response.data.data);
        console.log(error);
      }
    };
    return (
      <dialog id="add_category" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form onSubmit={addNewCategory} className='w-full h-fit flex flex-col gap-5  p-2'>
            <h3 className="font-bold text-lg">Enter New Category Name</h3>
            <input
              type="text"
              placeholder="New Series Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className='input input-accent'
            />
            <input type="submit" value={"Add Category"} className='btn btn-accent' />
          </form>
        </div>
      </dialog>
    );
}

export default AddCategory
