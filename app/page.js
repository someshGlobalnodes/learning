'use client';

import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Dropdown from '../components/Dropdown';
import SearchInput from '@/components/SearchInput';
import AddModalComponent from '@/components/AddModal';
import { toast } from 'react-toastify';



export default function Home() {
  const columns = [
    { id: 'id', label: 'Sr' },
    { id: 'name', label: 'Name' },
    { id: 'age', label: 'Age' },
    { id: 'city', label: 'City' },
    { id: 'address', label: 'Address' },
    { id: 'phone_number', label: 'Number' },
    { id: 'status', label: 'Status' },
    {id : 'edit' , label:'Edit'}
  ];

  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: "asc" });
  const [filterText, setFilterText] = useState("");
  const [modal , setModal] = useState(false)
  const [loading , setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [editData, setEditData] = useState(null);


  const getUserData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/user');
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

 
  const addNewUser = async (data) => {
    console.log(data)
    try{
      setLoading(true)
      const response = await fetch('http://localhost:3000/api/user', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(data),
      });
     if(response?.ok){
      toast.success('User added successfully!')
      getUserData()
      setModal(false);
     }

    }catch (error){
      toast.error(error.message)
      console.log(error)
    }finally{
      setLoading(false)
    }
  }


  const updateUser = async (data, editData) => {
    const id = editData?.id;
    const { name, age, city, address, phone_number, status } = data;
  
    try {
      const response = await fetch(`http://localhost:3000/api/user/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, age, city, address, phone_number, status }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Update failed: ${errorData.error || 'Unknown error'}`);
      }

      if(response?.ok){
        toast.success('User added successfully!')
        getUserData()
        setModal(false);
        selectedRows.clear()
       }
  
      const responseData = await response.json();
      console.log('Update successful:', responseData);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };
  


  const handleSubmit = (formData) => {
    if (editData) {
      updateUser(formData , editData)
      setEditData(null);
    } else {
      addNewUser(formData);
    }
  }

  const deleteRows = async (id) => {
    console.log(id)
    const ids = id.map(Number);
    console.log(ids)
    try {
      const response = await fetch(`http://localhost:3000/api/user/`, {
      method: 'DELETE',
      body: JSON.stringify({ id: ids })
    });
      console.log(response , 'res')
      if (response.ok) {
        const result = await response.json();
        toast.success('User deleted successfully!');
        getUserData();
    } else {
        const errorData = await response.json();
        console.error('Failed to delete:', errorData.error);
        toast.error(`Error: ${errorData.error}`);
    }
    } catch (error) {
      console.error('Failed to delete rows:', error);
    }
  };
 
  console.log(selectedRows)

  const handleDropdown = (action) => {
    if (action === 'delete') {
      const idsArray = Array.from(selectedRows);
      console.log(idsArray)
    if (idsArray.length === 1) {
      deleteRows(idsArray[0]); 
    }else {
      deleteRows(idsArray)
    }
    } else if (action === 'mark-active') {
      const updatedData = data?.map(row =>
        selectedRows.has(row.id) ? { ...row, isChecked: false, status: 'Active' } : row
      );
      setData(updatedData);
      setSelectedRows(new Set());
    } else if (action === 'mark-inactive') {
      const updatedData = data.map(row =>
        selectedRows.has(row.id) ? { ...row, isChecked: false, status: 'InActive' } : row
      );
      setData(updatedData);
      setSelectedRows(new Set());
    }
  };



  

  const handleFilterChange = (e) => {
    e.preventDefault();
    const replacedValue = e.target.value.trimStart();
    setFilterText(replacedValue);
    setCurrentPage(1);
  };

  const filteredData = data?.filter((item) =>
    columns.some(column =>
      column.id === null || item[column.id]?.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
  
      // Ensure comparison of the same type
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        // Case-insensitive string comparison
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
    }
    return 0;
  });
  
  const handleSort = (key) => {
    // Toggle sorting direction
    const direction = (sortConfig.key === key && sortConfig.direction === 'asc') ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };
  

  const handleModalOpen = () => {
    setModal((prev) => !prev);
    setEditData(null);
  }

  const handleEditRow = (row) => {
    console.log(row)
    setEditData(row); // Set the row data for editing
    setModal(true); // Open the modal
  };
 

  return (
    <div>
      <h1 className='text-4xl text-center mt-6 font-bold'>Data Table</h1>
      <div className="flex gap-6 items-center ml-28">
        <Dropdown handleSelectDropdown={handleDropdown} />

        <SearchInput handleFilterChange={handleFilterChange} filterText={filterText}  />

        <button className=' w-24 h-10 rounded-lg bg-blue-300 text-white'  onClick={handleModalOpen}>Add</button>
      </div>
      <DataTable
        columns={columns}
         data={data}
        setData={setData} 
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        sortedData={sortedData}
        handleSort={handleSort}
        sortConfig={sortConfig}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleEditRow={handleEditRow}
      />
      {
        modal &&   <AddModalComponent isOpen={modal} onClose={handleModalOpen} loading={loading}  onSubmit={handleSubmit} editData={editData}/>
      }
     
    </div>
  );
}
