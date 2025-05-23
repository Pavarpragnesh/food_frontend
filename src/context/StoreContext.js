import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Use named import
import { toast } from "react-toastify"; // Import toast for notifications
import { useNavigate } from "react-router-dom"; // Import useNavigate

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:5001";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [user, setUser] = useState(null);
  const [topDishes, setTopDishes] = useState([]);
  const [offers, setOffers] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate(); // Initialize navigate

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}/api/category/list`);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  const removeFromCart = async (itemId, removeAll = false) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (removeAll || updatedCart[itemId] === 1) {
        delete updatedCart[itemId];
      } else {
        updatedCart[itemId] -= 1;
      }
      return updatedCart;
    });

    if (token) {
      try {
        await axios.post(
          `${url}/api.cart/remove`,
          { itemId, removeAll },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list?.find((product) => product._id === item);
        if (itemInfo?.price) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount || 0;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list1`);
      console.log("Fetched food list:", response.data.data); // Debug log
      if (response.data.success) {
        setFoodList(response.data.data);
      } else {
        console.error("Failed to fetch food list:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  const fetchTopDishes = async () => {
    try {
      const response = await axios.get(`${url}/api/order/top-ordered-dishes`);
      if (response.data.success) {
        const enrichedDishes = response.data.data.map((dish) => {
          const foodItem = food_list.find((food) => food._id === dish._id);
          return {
            ...dish,
            price: foodItem?.price || dish.price || 0,
            image: foodItem?.image || dish.image || "",
            description: foodItem?.description || dish.description || "Popular dish!",
            averageRating: foodItem?.averageRating || 0,
          };
        });
        setTopDishes(enrichedDishes);
      } else {
        console.error("Failed to fetch top dishes:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching top dishes:", error);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await axios.get(`${url}/api/offer/list`);
      if (response.data.success) {
        setOffers(response.data.data);
      } else {
        console.error("Failed to fetch offers:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchCategories(), fetchFoodList(), fetchOffers()]);
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
      }
    };
    loadData();
  }, []);

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchCategories();
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (token) {
      loadCartData(token);
    } else {
      setCartItems({});
      setUser(null); // Clear user data on logout
    }
  }, [token]);

  useEffect(() => {
    fetchTopDishes();
  }, [food_list]);

  // Function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds
      return decodedToken.exp < currentTime; // Compare with expiration time
    } catch (error) {
      return true; // If token is invalid, consider it expired
    }
  };

  // Handle token expiration
  const handleTokenExpiration = () => {
    if (token && isTokenExpired(token)) {
      toast.error("Token expired"); // Show toast message
      localStorage.removeItem("token");
      setToken("");
      setUser(null);
      setCartItems({});
      navigate("/"); // Navigate to the specified URL
    }
  };

  // Check token expiration periodically (e.g., every 30 seconds)
  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        handleTokenExpiration();
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [token, navigate]);

  const contextValue = {
    categories,
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    user,
    setUser,
    topDishes,
    offers,
    fetchOffers,
    promoCode,
    setPromoCode,
    promoError,
    setPromoError,
    discount,
    setDiscount,
    handleTokenExpiration, // Add this to context
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;