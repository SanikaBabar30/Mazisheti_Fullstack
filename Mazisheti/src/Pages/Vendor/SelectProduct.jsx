import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SelectProduct = () => {
  const [productTypes, setProductTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8082/api/product-types")
      .then(res => setProductTypes(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSelect = (type) => {
    navigate(`/vendor/add-product/${type}`);
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-semibold mb-6">Select Product</h2>
      <div className="flex gap-6 justify-center flex-wrap">
        {productTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => handleSelect(type.typeName.toLowerCase())}
            className="p-6 bg-white shadow rounded-lg hover:bg-green-100 w-48"
          >
            <p className="text-lg font-medium">{type.typeName}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectProduct;
