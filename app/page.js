'use client'

import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';


export default function Home() {
  const columns = [
    { id: 'id', label: 'Sr' },
    { id: 'name', label: 'Name' },
    { id: 'age', label: 'Age' },  
    { id: 'city', label: 'City' },
    { id: 'address', label: 'Address' },
    { id: 'phone_number', label: 'Number' },
    {id:'status', label:'Status'}
  ];

  

  const [data , setData] = useState([])

  

  const getUserData = async () => {
    try{
    const response = await fetch('http://localhost:3000/api/user')
    const data = await response.json()
    setData(data)
    console.log(data)
    }catch(error){
      console.log(error)
    }
  }

  

  useEffect(()=>{
    getUserData()
  }, [])

  return (
    <div>
      <h1 className='text-4xl text-center mt-6 font-bold'>Data Table</h1>
      <DataTable  columns={columns} data={data} setData={setData} />
    </div>
  );
}








  