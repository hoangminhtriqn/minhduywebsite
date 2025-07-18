import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { notification } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import { favoritesService, FavoriteItem } from "@/api/services/user/favorites";

interface FavoritesContextType {
  favorites: FavoriteItem[];
  favoritesCount: number;
  loading: boolean;
  addToFavorites: (productId: string) => Promise<void>;
  removeFromFavorites: (itemId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
  refreshFavoritesCount: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchFavorites = async () => {
    if (!user) {
      setFavorites([]);
      setFavoritesCount(0);
      return;
    }

    setLoading(true);
    try {
      const response = await favoritesService.getFavorites();
      if (response.success && response.data && response.data.items) {
        setFavorites(response.data.items);
        setFavoritesCount(response.data.items.length);
      } else {
        setFavorites([]);
        setFavoritesCount(0);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavorites([]);
      setFavoritesCount(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavoritesCount = async () => {
    if (!user) {
      setFavoritesCount(0);
      return;
    }

    try {
      const count = await favoritesService.getFavoritesCount();
      setFavoritesCount(count);
    } catch (error) {
      console.error("Error fetching favorites count:", error);
      setFavoritesCount(0);
    }
  };

  const addToFavorites = async (productId: string) => {
    if (!user) return;

    try {
      const response = await favoritesService.addToFavorites(productId);
      if (response.success && response.data && response.data.items) {
        setFavorites(response.data.items);
        setFavoritesCount(response.data.items.length);
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  const removeFromFavorites = async (itemId: string) => {
    if (!user) return;

    try {
      await favoritesService.removeFromFavorites(itemId);
      setFavorites((prev) => prev.filter((item) => item._id !== itemId));
      setFavoritesCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  const refreshFavorites = async () => {
    await fetchFavorites();
  };

  const refreshFavoritesCount = async () => {
    await fetchFavoritesCount();
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const value: FavoritesContextType = {
    favorites,
    favoritesCount,
    loading,
    addToFavorites,
    removeFromFavorites,
    refreshFavorites,
    refreshFavoritesCount,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
