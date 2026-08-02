import "./NewCollections.css"

import Item from "../Item/Item"
import { useEffect, useState, useContext } from "react"
import { ShopContext } from "../../Context/ShopContext"

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

function NewCollections(){
    let[new_collection,setnew_collection]=useState([]);
    const { setServerDown } = useContext(ShopContext);

    useEffect(()=>{
        fetch(`${API_URL}/newcollections`)
            .then((response)=>response.json())
            .then((data)=>{
                setnew_collection(data);
                setServerDown(false);
            })
            .catch((error)=>setServerDown(true));
    },[])
    return(
        <div id="new-collections" className="new-collections">
            <h1>NEW COLLECTIONS</h1>
            <hr/>
            <div className="collections">
                {new_collection.map((item,i)=>{
                    return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
                })}
            </div>
        </div>
    )

}

export default NewCollections;