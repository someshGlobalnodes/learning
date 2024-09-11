const DataTable = ({
  columns,
  data,
  setData,
  handleSort,
  sortedData,
  sortConfig,
  setSelectedRows,
  currentPage,
  setCurrentPage,
  handleEditRow ,
  selectedRows
}) => {
  const TOTAL_VALUES_PER_PAGE = 5;

  const startIndex = (currentPage - 1) * TOTAL_VALUES_PER_PAGE;
  const paginatedData = sortedData.slice(
    startIndex,
    startIndex + TOTAL_VALUES_PER_PAGE
  );

  console.log(selectedRows)

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
    const allSelected = paginatedData.every((row) => row.isChecked);
    const newSelectedRows = allSelected
      ? new Set()
      : new Set(paginatedData.map((row) => row.id));
    setSelectedRows(newSelectedRows);

    const updatedData = data.map((row) => ({
      ...row,
      isChecked: newSelectedRows.has(row.id),
    }));
    setData(updatedData);
  };

  const handleSelectRow = (id) => {
    const newData = data.map(row =>
      row.id === id ? { ...row, isChecked: !row.isChecked } : row
    );

    setData(newData);
    const newSelectedRows = new Set(newData.filter(row => row.isChecked).map(row => row.id));
    console.log(newSelectedRows)
    setSelectedRows(newSelectedRows);
  };
  

  return (
    <div className="flex justify-center flex-col">
      <table className="mt-4 mx-auto w-[80%] border-collapse">
        <thead className="border-[#555454] border-[2px] text-center p-2">
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
            {columns?.map((item) => (
              <th
                key={item.id}
                className="bottom-1 text-[#333232] cursor-pointer p-2 border-[#555454] border-[2px]"
                onClick={() => handleSort(item.id)}
              >
                {item.label}
                {sortConfig.key === item.id
                  ? sortConfig.direction === "asc"
                    ? " ▲"
                    : " ▼"
                  : null}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="border-[#555454] border-[2px] text-center p-2">
          {paginatedData.length > 0 ? (
            paginatedData.map((row, index) => (
              <tr key={index}>
                <td className="border-[#555454] border-[2px]">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                  />
                </td>
                {columns.map((col) => (
                  <td className="border-[#555454] border-[2px]" key={col.id}>
                    {col.id === "edit" ? (
                      <button
                        className="  px-2 py-1 "
                        onClick={() => handleEditRow(row)}
                      >
                        Edit
                      </button>
                    ) : (
                      row[col.id] ?? ""
                    )}
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
