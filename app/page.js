import React from 'react';
import DataTable from '../components/DataTable';

export default function Home() {
  const columns = [
    { id: 'id', label: 'Sr' },
    { id: 'name', label: 'Name' },
    { id: 'age', label: 'Age' },  
    { id: 'city', label: 'City' },
    { id: 'address', label: 'Address' },
    { id: 'number', label: 'Number' },
  ];

  const data = [
    {id : 1 ,  name: 'Sam', age: 28, city: 'New Delhi', address: '123 saket nagar', number : '6874554353' },
    { id : 2 ,  name: 'Amit', age: 19, city: 'Mumbai' , address: '54 Bandra', number : '7975748587' },
    { id : 3 ,  name: 'Jane Smith', age: 34, city: 'Los Angeles' , address: '54 los Angeles', number : '9658463785' },
    { id : 4 ,  name: 'Mike Johnson', age: 45, city: 'Chicago', address: '53 chicago', number : '87609752854' },
    {id : 5 ,   name: 'Test', age: 26, city: 'Gujrat', address: '126 jaipur', number : '87468387' },
    { id : 6 ,  name: 'User', age: 64, city: 'Surat', address: '53 chicago', number : '7675743636' },
    { id : 7,  name: 'Rohit', age: 16, city: 'Raipur', address: '67 raipur', number : '37457457' },
    { id : 8 ,  name: 'Suzan', age: 43, city: 'Kolkata', address: '274 kolkata', number : '4574468' },
    { id : 9 ,  name: 'Sanjana', age: 53, city: 'Goa', address: '234 goa', number : '65834337' },
    { id : 10 ,  name: 'Param', age: 32, city: 'Punjab', address: '53 patial', number : '46357458' },
  ];

  return (
    <div>
      <h1 className='text-4xl text-center mt-6 font-bold'>Data Table</h1>
      <DataTable  columns={columns} data={data} />
    </div>
  );
}
