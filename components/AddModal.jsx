import React from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import InputField from './InputField';
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

const override = {
  display: "block",
  margin: "0 auto",
  color: "white",
};

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  age: Yup.number()
    .required('Age is required')
    .min(0, 'Age must be a positive number'),
  city: Yup.string().required('City is required'),
  address: Yup.string().required('Address is required'),
  phone_number: Yup.string()
    .required('Phone number is required'),
  status: Yup.string().required('Status is required')
});

const AddModalComponent = ({ isOpen, onClose, onSubmit, loading }) => {
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      age: '',
      city: '',
      address: '',
      phone_number: '',
      status: '' 
    }
  });

  const handleModalClose = () => {
    reset(); 
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" onClick={handleModalClose}></div>
          <div className="bg-white w-[90%] md:w-[60%] lg:w-[40%] rounded-lg shadow-lg mx-4 p-6 relative mt-10 mb-10">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={handleModalClose}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Add New User</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <InputField control={control} label="Name" type="text" name="name" placeholder="Enter Name" />
              <InputField control={control} label="Age" type="number" name="age" placeholder="Enter Age" />
              <InputField control={control} label="City" type="text" name="city" placeholder="Enter City" />
              <InputField control={control} label="Address" type="text" name="address" placeholder="Enter Address" />
              <InputField control={control} label="Phone Number" type="text" name="phone_number" placeholder="Enter Phone Number" />
              <Controller
                control={control}
                name="status"
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Status</label>
                    <select
                      {...field}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    {field.error && (
                      <small className="text-red-500 mt-1 block">
                        {field.error.message}
                      </small>
                    )}
                  </div>
                )}
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? (
                    <ClipLoader loading={loading} cssOverride={override} size={20} />
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddModalComponent;
