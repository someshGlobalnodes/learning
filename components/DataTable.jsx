"use client";

import React, { useEffect, useState } from "react";

const DataTable = ({ columns, data }) => {
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

  console.log(paginatedData)

  const totalPages = Math.ceil(sortedData.length / TOTAL_VALUES_PER_PAGE);

  console.log(totalPages, "tst");

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
    if (e.target.checked) {
      const allIds = data.map(row => row.id);
      console.log(allIds)
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    setSelectedRows(newSelectedRows);
   console.log(id)
  }

  return (
    <div className="flex justify-center flex-col">
      <input
        type="text"
        placeholder="Search"
        value={filterText}
        onChange={handleFilterChange}
        className="w-60 mt-6 ml-32 mb-6 p-2 rounded-lg border-[#555454] border-[2px] "
      />

      <table className="mt-4  mx-auto w-[80%] border-collapse">
        <thead className="border-[#555454] border-[2px]  text-center p-2 ">
          <tr>
          <th className="border-[#555454] border-[2px]">
              <input
                type="checkbox"
                 onChange={handleSelectAll}
                    checked={paginatedData.length > 0 && paginatedData.every(row => selectedRows.has(row.id))}
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
                     checked={selectedRows.has(row.id)}
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
