"use client";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function ToastProvider({ children }) {
  return (
    <>
      {children}
      <ToastContainer
        position="top-right" 
        autoClose={3000}    
        hideProgressBar={false} 
        newestOnTop={true} 
        closeOnClick       
        pauseOnFocusLoss   
        draggable            
        pauseOnHover     
      />
    </>
  );
}
