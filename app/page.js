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
    { id: 'status', label: 'Status' }
  ];

  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: "asc" });
  const [filterText, setFilterText] = useState("");
  const [modal , setModal] = useState(false)
  const [loading , setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);



  const getUserData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/user');
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

 
  const addNewUser = async (data) => {
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



  const handleSubmit = (formData) => {
    addNewUser(formData)
  }

  const deleteRows = async (id) => {
    console.log(id)
    try {
      const response = await fetch(`http://localhost:3000/api/user/${id}`, {
      method: 'DELETE',
    });
      console.log(response , 'res')
    } catch (error) {
      console.error('Failed to delete rows:', error);
    }
  };
 
  console.log(selectedRows)

  const handleDropdown = (action) => {
    if (action === 'delete') {
      const idsArray = Array.from(selectedRows);
    if (idsArray.length === 1) {
      deleteRows(idsArray[0]); 
    }
    } else if (action === 'mark-active') {
      const updatedData = data.map(row =>
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



  const handleSelectRow = (id) => {
    const newData = data.map(row =>
      row.id === id ? { ...row, isChecked: !row.isChecked } : row
    );

    setData(newData);
    const newSelectedRows = new Set(newData.filter(row => row.isChecked).map(row => row.id));
    setSelectedRows(newSelectedRows);
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
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleModalOpen = () => {
    setModal((prev) => !prev);
  }


  useEffect(() => {
    getUserData();
  }, []);

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
        handleSelectRow={handleSelectRow}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        sortedData={sortedData}
        handleSort={handleSort}
        sortConfig={sortConfig}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      {
        modal &&   <AddModalComponent isOpen={modal} onClose={handleModalOpen} loading={loading}  onSubmit={handleSubmit}/>
      }
     
    </div>
  );
}
