"use client";

import React, { useMemo } from "react";
import { Controller, useFormState } from "react-hook-form";

const InputField = ({
  label,
  type,
  name,
  control,
  required,
  multiple,
  placeholder,
  maxLength,
}) => {
  const state = useFormState({ control, name });
  const isErrorExist = useMemo(() => Boolean(state.errors[name]), [state]);
  const errorMessage = useMemo(
    () => state.errors[name]?.message || undefined,
    [state]
  );

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: required }}
      render={({ field }) => (
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>

          <div>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              type={type}
              name={name}
              maxLength={maxLength}
              placeholder={placeholder}
              {...field}
            />
          </div>

          {isErrorExist && (
            <small className="text-red-500 mt-1 block">{errorMessage}</small>
          )}
        </div>
      )}
    />
  );
};

export default InputField;
