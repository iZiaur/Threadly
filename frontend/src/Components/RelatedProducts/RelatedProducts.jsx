import "./RelatedProducts.css";
import Item from "../Item/Item";
import { useEffect, useState, useContext } from "react";
import { ShopContext } from "../../Context/ShopContext";

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

function RelatedProducts({ category }) {
  const [data_product, setdata_product] = useState([]);
  const { setServerDown } = useContext(ShopContext);

  useEffect(() => {
      fetch(`${API_URL}/relatedproducts`, {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ category })
      })
      .then((response) => response.json())
      .then((data) => {
          setdata_product(data);
          setServerDown(false);
      })
      .catch(() => setServerDown(true));
  }, [category]);
  return (
    <div className="related-products">
      <h1>Related Products</h1>
      <hr/>
      <div className="related-products-list">
        {data_product.map((item,i) => {
        return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
            })}
        </div>
      
    </div>
  );
}

export default RelatedProducts;