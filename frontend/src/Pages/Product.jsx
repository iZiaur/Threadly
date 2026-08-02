import { useContext } from "react";
import {ShopContext} from "../Context/ShopContext"
import Breadcrum from "../Components/Breadcrums/Breadcrum";
import { useParams } from "react-router-dom";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts.jsx";


function Product(){
    const {all_product}=useContext(ShopContext);
    const{productId}=useParams();
    const product=all_product.find((e)=>e.id===Number(productId))

    if (!product) {
        return <div>Loading...</div>;
    }

    return(
        <div>
            <Breadcrum product={product}/>
           < ProductDisplay product={product}/>
           <DescriptionBox product={product}/>
           <RelatedProducts category={product.category}/>
        </div>
    )
 
}
export default Product;