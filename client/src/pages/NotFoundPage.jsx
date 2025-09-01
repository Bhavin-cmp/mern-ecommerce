import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-red-500">404</h1>
      <p className="text-lg text-gray-600">Page Not Found</p>
      <Link to="/" className="text-primary hover:underline mt-4 inline-block">
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
