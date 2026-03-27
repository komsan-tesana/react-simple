import { useState, useEffect } from "react";
import { FavoritesContext } from "./favorites-context";

const STORAGE_KEY = "catFavorites";

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  function addFavorite(cat) {
    if (!isFavorite(cat.id)) {
      setFavorites((prev) => [...prev, cat]);
    }
  }

  function removeFavorite(catId) {
    setFavorites((prev) => prev.filter((c) => c.id !== catId));
  }

  function isFavorite(catId) {
    return favorites.some((c) => c.id === catId);
  }

  function toggleFavorite(cat) {
    if (isFavorite(cat.id)) {
      removeFavorite(cat.id);
    } else {
      addFavorite(cat);
    }
  }

  function clearFavorites() {
    setFavorites([]);
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        clearFavorites
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}