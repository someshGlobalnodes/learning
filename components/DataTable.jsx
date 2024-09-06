"use client";

import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";

const DataTable = ({ columns, data , setData }) => {
  const [filterText, setFilterText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const TOTAL_VALUES_PER_PAGE = 5;

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
  

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

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

  const startIndex = (currentPage - 1) * TOTAL_VALUES_PER_PAGE;
  const paginatedData = sortedData.slice(
    startIndex,
    startIndex + TOTAL_VALUES_PER_PAGE
  );


  const totalPages = Math.ceil(sortedData.length / TOTAL_VALUES_PER_PAGE);


  const goOnPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goOnNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

   

  const handleSelectAll = (e) => {
    const newData = data.map(row => ({ ...row, isChecked: e.target.checked }));
    setData(newData);
    const newSelectedRows = e.target.checked ? new Set(newData.map(row => row.id)) : new Set();
    setSelectedRows(newSelectedRows);
  };

 

  const handleSelectRow = (id) => {
    console.log(id)
    const newData = data?.map(row => 
      row.id === id ? { ...row, isChecked: !row.isChecked } : row
    );
    setData(newData);
    const newSelectedRows = new Set(newData.filter(row => row.isChecked).map(row => row.id));
    setSelectedRows(newSelectedRows);
  };


  // Dropdown

  const handleDropdown = (action) => {
    if (action === 'delete') {

      const updatedData = data
      .filter(row => !selectedRows.has(row.id))
      .map(row => ({ ...row, isChecked: false }));
      setData(updatedData);
      setSelectedRows(new Set());
      
    } else if (action === 'mark-active') {
      const updatedData = data.map(row => 
        selectedRows.has(row.id) ? { ...row, isChecked: false , status : 'Active' } : row
      );
      setData(updatedData);
      setSelectedRows(new Set());
    } else if (action === 'mark-inactive') {
      const updatedData = data.map(row => 
        selectedRows.has(row.id) ? { ...row, isChecked: false , status : 'InActive' } : row
      );
      setData(updatedData);
      setSelectedRows(new Set());
    }
  }

  return (
    <div className="flex justify-center flex-col">

      <div className="flex gap-6 items-center ml-28">
      <Dropdown  handleSelectDropdown={handleDropdown}/>

<input
  type="text"
  placeholder="Search"
  value={filterText}
  onChange={handleFilterChange}
  className="w-60 mt-6  mb-6 p-2 rounded-lg border-[#555454] border-[2px] "
/>
      </div>

   

      <table className="mt-4  mx-auto w-[80%] border-collapse">
        <thead className="border-[#555454] border-[2px]  text-center p-2 ">
          <tr>
          <th className="border-[#555454] border-[2px]">
              <input
                type="checkbox"
                 onChange={handleSelectAll}
                 checked={paginatedData.length > 0 && paginatedData.every(row => row.isChecked)}
              />
            </th>
            {columns &&
              columns?.map((item) => (
                <th
                  key={item.id}
                  className="bottom-1 text-[#333232] cursor-pointer p-2 border-[#555454] border-[2px] "
                  onClick={() => handleSort(item.id)}
                >
                  {item?.label}
                  {sortConfig.key === item.id
                    ? sortConfig.direction === "asc"
                      ? " ▲"
                      : " ▼"
                    : null}
                </th>
              ))}
          </tr>
        </thead>

        <tbody className="border-[#555454] border-[2px]  text-center p-2 ">
          {paginatedData?.length > 0 ? (
            paginatedData?.map((row, index) => (
            
              <tr key={index}>
                <td className="border-[#555454] border-[2px]">
                  <input
                    type="checkbox"
                    checked={row.isChecked}
                    onChange={() => handleSelectRow(row.id)}
                  />
                </td>
                {columns?.map((col) => (
                  <td className="border-[#555454] border-[2px] ">
                    {row[col.id] ?? ''}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="border-[#555454] border-[2px] p-2 text-center"
              >
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-center gap-4 mt-4">
        <button
          className={`w-28 h-8 rounded-lg text-white ${
            currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-400"
          }`}
          onClick={goOnPrevPage}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <button
          className={`w-28 h-8 rounded-lg text-white ${
            currentPage === totalPages
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-400"
          }`}
          onClick={goOnNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
