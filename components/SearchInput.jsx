'use client'

import React, { useState } from 'react'

const SearchInput = ({handleFilterChange , filterText}) => {

  return (
    <div>
         <input
      type="text"
      placeholder="Search"
      value={filterText}
      onChange={handleFilterChange}
      className="w-60 mt-6  mb-6 p-2 rounded-lg border-[#555454] border-[2px] "
    />
    </div>
  )
}

export default SearchInput