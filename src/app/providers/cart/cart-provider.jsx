import { useState } from "react";
import { CartContext } from "./cart-context";
import { useAuth } from "@/app/providers/auth";
import { message } from "antd";
import { uniq } from "lodash";

export function CartProvider({ children }) {
  const { getCurrentEmail } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  function addToCart(productId, donateType) {
    const existing = cartItems.find((item) => item.id === productId);

    if (!donateType) {
      message.error("Please Selected Gift.");
      return;
    }

    if (existing) {  
      const currentFood = donateType == 1 ? existing.food + 10 : existing.food;
      const currentMedical =
        donateType == 2 ? existing.medical + 10 : existing.medical;
      const currentSupplies =
        donateType == 3 ? existing.supplies + 10 : existing.supplies;
      const updatedCartItems = cartItems.map((item) =>
        item.id === productId
          ? {
              id: productId,
              food: currentFood,
              medical: currentMedical,
              supplies: currentSupplies,
              // quantity: currentQuantity + 10,
              users: uniq([...item.users, getCurrentEmail()]),
            }
          : item,
      );
      setCartItems(updatedCartItems);
    } else {
      setCartItems([
        ...cartItems,
        {
          id: productId,
          food: donateType == 1 ? 10 : 0,
          medical: donateType == 2 ? 10 : 0,
          supplies: donateType == 3 ? 10 : 0,
          // quantity: 10,
          users: [getCurrentEmail()],
        },
      ]);
    }
  }

  function getCartItemsWithProducts() {
    return cartItems
      .map((item) => ({
        ...item,
        // product: getProductById(item.id),
      }))
      .filter((item) => item.product);
  }

  function removeFromCart(productId) {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  }


  function getCartTotal() {
    const total = cartItems.reduce((total, item) => {
      // const product = getProductById(item.id);
      // return total + (product ? product.price * item.quantity : 0);
        return total
    }, 0);
    return total;
  }

  function clearCart() {
    setCartItems([]);
  }

  function productInCart(id) {
    return cartItems.find((item) => item.id === id);
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        getCartItemsWithProducts,
        removeFromCart,        
        getCartTotal,
        clearCart,
        productInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
