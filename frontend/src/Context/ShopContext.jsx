import React,{createContext, useEffect, useState} from "react";

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

export const ShopContext=createContext(null);


 const getDefaultCart=()=>{
        return {};
    }

const ShopContextProvider=(props)=>{
    const[all_product,setall_product]=useState([])
    const [cartItems,setCartItems]=React.useState(getDefaultCart());
    const [serverDown, setServerDown] = useState(false);
    const [cartMessage, setCartMessage] = useState("");
    
    useEffect(()=>{
        fetch(`${API_URL}/allproducts`)
            .then((response)=>response.json())
            .then((data)=>{
                setall_product(data);
                setServerDown(false);
            })
            .catch((error)=>setServerDown(true));
        if(localStorage.getItem('auth-token')){
            fetch(`${API_URL}/getcart`,{
                method:"POST",
                headers:{
                    Accept:"application/json",
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-type':'application/json',
                },
            }).then((response)=>response.json())
            .then((data)=>setCartItems(data));
        }
    },[])
    
   const addToCart=(itemId, size)=>{
        const itemKey = `${itemId}_${size}`;
        setCartItems((prev)=>({...prev,[itemKey]:(prev[itemKey] || 0)+1}))
        setCartMessage("Added to cart!");
        setTimeout(() => setCartMessage(""), 3000);

        if(localStorage.getItem('auth-token')){
            fetch(`${API_URL}/addtocart`,{
                method:"POST",
                headers:{
                    Accept:"application/json",
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-type':'application/json',
                },
                body:JSON.stringify({"itemId":itemKey})
            }).then((response)=>response.json()).then((data)=>{
                console.log(data);
                setServerDown(false);
            }).catch((error)=>setServerDown(true));
        }
        
   }
   const removeFromCart=(itemKey)=>{
        setCartItems((prev)=>{
            const newCart = {...prev, [itemKey]:prev[itemKey]-1};
            if(newCart[itemKey] <= 0) delete newCart[itemKey];
            return newCart;
        })
        if(localStorage.getItem('auth-token')){
            fetch(`${API_URL}/removefromcart`,{
                method:"POST",
                headers:{
                    Accept:"application/json",
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-type':'application/json',
                },
                body:JSON.stringify({"itemId":itemKey})
            }).then((response)=>response.json()).then((data)=>{
                console.log(data);
                setServerDown(false);
            }).catch((error)=>setServerDown(true));
        }
   }
   const getTotalCartAmount=()=>{
        let totalAmount=0;
        for(const itemKey in cartItems){
            if(cartItems[itemKey]>0){
                let productId = Number(itemKey.split('_')[0]);
                let itemInfo=all_product.find((product)=>product.id===productId);
                if(itemInfo) {
                    totalAmount+=cartItems[itemKey]*itemInfo.new_price;
                }
            }
            
        }
        return totalAmount;
   }

   const getTotalCartItems=()=>{
        let totalItems=0;
        for(const itemKey in cartItems){
            if(cartItems[itemKey]>0){
                totalItems+=cartItems[itemKey];
            }
        }
        return totalItems;
   }

   const contextValue={all_product,cartItems,addToCart,removeFromCart,getTotalCartAmount,getTotalCartItems,serverDown,setServerDown,cartMessage,setCartMessage};
   
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider; 