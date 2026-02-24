import { useState, useContext, createContext, useEffect } from "react";

const WishContext = createContext();
const WishProvider = ({ children }) => {
  const [wishcart, setWishCart] = useState([]);

  useEffect(() => {
    let existingCartItem = localStorage.getItem("wishCart");
    if (existingCartItem) setWishCart(JSON.parse(existingCartItem));
  }, []);

  return (
    <WishContext.Provider value={[wishcart, setWishCart]}>
      {children}
    </WishContext.Provider>
  );
};
// custom hook
const useWishCart = () => useContext(WishContext);

export { useWishCart,WishProvider };