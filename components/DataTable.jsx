"use client";

import React, { useState } from "react";

const DataTable = ({
  columns,
  handleSelectRow,
  data,
  setData,
  handleSort,
  sortedData,
  sortConfig,
  setSelectedRows,
  currentPage,
  setCurrentPage,
}) => {
  const TOTAL_VALUES_PER_PAGE = 5;

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

  const handleSelectAll = (isChecked) => {
    const newSelectedRows = isChecked
      ? new Set(paginatedData.map((row) => row.id))
      : new Set();
    setSelectedRows(newSelectedRows);

    const updatedData = data.map((row) => ({
      ...row,
      isChecked: newSelectedRows.has(row.id),
    }));
    setData(updatedData);
  };

  return (
    <div className="flex justify-center flex-col">
      <table className="mt-4  mx-auto w-[80%] border-collapse">
        <thead className="border-[#555454] border-[2px]  text-center p-2 ">
          <tr>
            <th className="border-[#555454] border-[2px]">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  paginatedData.length > 0 &&
                  paginatedData.every((row) => row.isChecked)
                }
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
                    {row[col.id] ?? ""}
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
