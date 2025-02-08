import React, { createContext, useEffect, useState } from 'react'
import { food_list } from '../assets/frontend_assets/assets';

export const StoreContext = createContext(null) 

const StoreContextProvider = (props) =>{

  const [cartItems,setCartItems] = useState({});

  const addToCard = (itemId) =>{
      if(!cartItems[itemId]){
        setCartItems((prev=>({...prev,[itemId]:1})))
      }
      else{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
      }
  }

  const removeFromCart =(itemId) => {
    setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
  }

  useEffect(()=>{
    console.log(cartItems);
  })

  const contextValue = {
      food_list,
      cartItems,
      setCartItems,
      addToCard,
      removeFromCart
  }

  return(
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  )
}
 
export default StoreContextProvider;
