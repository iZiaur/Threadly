import "./CartItems.css";
import { useContext, useState } from "react";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";


import { toast } from 'react-toastify';

function CartItems(){
    const {getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart} = useContext(ShopContext);
    const [promo, setPromo] = useState('');

    const handleCheckout = async () => {
        if (!localStorage.getItem('auth-token')) {
            toast.error("Please login first to proceed to checkout!");
            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);
            return;
        }
        
        if (getTotalCartAmount() === 0) {
            toast.error("Your cart is empty!");
            return;
        } 
        
        toast.info("Processing order...");
        const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
        try {
            const response = await fetch(`${API_URL}/checkout`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "auth-token": `${localStorage.getItem("auth-token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ totalAmount: getTotalCartAmount() })
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Order placed successfully!");
                // Reload to clear frontend cart since backend cart was cleared
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toast.error(data.errors || "Checkout failed");
            }
        } catch (error) {
            toast.error("Server unreachable during checkout.");
        }
    };

    const handlePromo = () => {
        if (!promo) {
            toast.error("Please enter a promo code.");
        } else {
            toast.success("Promo code applied successfully!");
            setPromo('');
        }
    };

    return(
        <div className="cart-items">
            <div className="cart-items-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr/>
            {Object.keys(cartItems).map((itemKey)=>{
                if(cartItems[itemKey] > 0){
                    let productId = Number(itemKey.split('_')[0]);
                    let size = itemKey.split('_')[1];
                    let e = all_product.find((product)=>product.id===productId);
                    if(!e) return null;

                    return <div key={itemKey}>
                <div className="cart-items-format cart-items-format-main">
                    <img  src={e.image} alt=" " className="cart-items-product-icon"/>
                    <p>{e.name} <br/> <strong>Size: {size}</strong></p>
                    <p>Rs.{e.new_price}</p>
                    
                    <button className="carditems-quantity">{cartItems[itemKey]}</button>
                    <p>Rs.{e.new_price * cartItems[itemKey]}</p>
                    <img src={remove_icon} className="cart-items-remove-icon" onClick={() => removeFromCart(itemKey)}/>
                </div>
                <hr/>
            </div>
                }
                return null;
            })}
            < div className="cart-items-down">
                <div className="cart-items-total">
                    <h1>Cart Totals</h1>
                        <div>
                            <div className="class-item-total-item">
                                <p>Subtotal</p>
                                <p>Rs.{getTotalCartAmount()}</p>
                            </div>
                            <hr/>
                             <div className="class-item-total-item">
                                <p>Shipping Fee</p>
                                <p>Free</p>
                             </div>
                             <hr/>
                                <div className="class-item-total-item">
                                    <h3>Total</h3>
                                    <h3>Rs.{getTotalCartAmount()}</h3>
                                </div>

                        </div>
                        <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>

                    </div>
                    <div className="cart-items-promocode">
                       <p>If you have a promo code enter it here</p> 
                          <div className="cart-items-promobox">
                            <input type="text" placeholder="promo code" value={promo} onChange={(e) => setPromo(e.target.value)}/>
                            <button onClick={handlePromo}>Apply</button>
                          </div>
                    </div>
            </div>
        </div>
    )
}

export default CartItems;