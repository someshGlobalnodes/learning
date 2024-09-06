import React, { useState } from 'react'

const Dropdown = ({handleSelectDropdown}) => {

    const [value  , setValue]= useState('')
 
    const handleChange = (e) => {
        const selectedValue = e.target.value;
        console.log(selectedValue); // Log the selected value
        setValue(selectedValue);
        handleSelectDropdown(selectedValue); 

        setValue('')
    }
     
    console.log(value)

  return (
    <div >
    <select className="w-28 mt-6 bg-blue-300 text-white border-none outline-none  mb-6 p-2 rounded-lg border-[#555454] border-[2px] " value={value} onChange={handleChange}>
    <option value="">Actions</option>
      <option value="delete">Delete</option>
      <option value="mark-active">Mark Active</option>
      <option value="mark-inactive">Mark Inactive</option>
    </select>
  </div>
  )
}

export default Dropdown