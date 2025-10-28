import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProductDetailsPage = () => {
  const { state: product } = useLocation();
  const navigate = useNavigate();

  if (!product) {
    return <p className="p-6 text-center">No product details available.</p>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
      >
        ← Back
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden grid md:grid-cols-2">
        {/* Product Image */}
        <div className="bg-gray-100 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.productName}
            className="object-contain h-96 w-full"
          />
        </div>

        {/* Product Info */}
        <div className="p-6 flex flex-col">
          <h1 className="text-2xl font-bold mb-2">{product.productName}</h1>
          <p className="text-sm text-gray-600 mb-2">Brand: {product.brandName}</p>
          <p className="text-lg text-green-600 font-bold mb-4">₹{product.price}</p>

          <h2 className="text-lg font-semibold mb-2">About Product</h2>
          <p className="text-gray-700 mb-4">{product.aboutProduct}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-medium text-sm text-gray-500">Target Crops</h3>
              <p className="text-gray-800">{product.targetCrops}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-500">Active Ingredient</h3>
              <p className="text-gray-800">{product.activeIngredient}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-500">Dosage</h3>
              <p className="text-gray-800">{product.dosage}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-500">Benefits</h3>
              <p className="text-gray-800">{product.benefits}</p>
            </div>
          </div>

          {/* Vendor Info */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h2 className="text-lg font-semibold mb-2">Vendor Details</h2>
            {product.vendor ? (
              <>
                <p><strong>Shop:</strong> {product.vendor.shopName}</p>
                <p><strong>Owner:</strong> {product.vendor.ownerName}</p>
                <p><strong>Email:</strong> {product.vendor.email}</p>
                <p><strong>Mobile:</strong> {product.vendor.mobileNumber}</p>
                <p><strong>Address:</strong> {product.vendor.shopAddress}</p>
              </>
            ) : (
              <p className="text-gray-600">Sold by Admin</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
