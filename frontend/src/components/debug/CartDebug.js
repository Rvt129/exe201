// Temporary debug component to check cart data
import React, { useEffect, useState } from "react";
import { getCart } from "../../services/cart";

const CartDebug = () => {
  const [cartData, setCartData] = useState(null);

  useEffect(() => {
    const fetchCartDebug = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getCart(token);
        console.log("DEBUG: Full cart data:", data);
        setCartData(data);
      } catch (err) {
        console.error("DEBUG: Error fetching cart:", err);
      }
    };

    fetchCartDebug();
  }, []);

  if (!cartData) return <div>Loading debug...</div>;

  return (
    <div style={{ padding: "20px", background: "#f0f0f0", margin: "20px" }}>
      <h3>Cart Debug Info</h3>
      <pre style={{ background: "white", padding: "10px", overflow: "auto" }}>
        {JSON.stringify(cartData, null, 2)}
      </pre>
    </div>
  );
};

export default CartDebug;
