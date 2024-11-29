import React from "react";

const ErrorBoundary = () => {
  const handleRedirect = () => {
    // Menggunakan window.location untuk redirect ke halaman login
    window.location.href = "/login";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-700">
      <div className="bg-red-600 text-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">Try to accessing in illegal</h1>
        <button onClick={handleRedirect} className="bg-red-500 text-white p-4 rounded-lg hover:bg-green-500">
          Click Here to Login First
        </button>
      </div>
    </div>
  );
};

export default ErrorBoundary;
