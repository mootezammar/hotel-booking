import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

// Set base URL properly
axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "DT";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all rooms
  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(
        "Fetching rooms from:",
        `${axios.defaults.baseURL}/api/rooms`
      );
      const { data } = await axios.get("/api/rooms");
      console.log("Rooms API response:", data);

      if (data.success) {
        setRooms(data.rooms || []);
      } else {
        const errorMsg = data.message || "Failed to fetch rooms";
        setError(errorMsg);
        toast.error(errorMsg);
        setRooms([]);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      const errorMsg =
        error.response?.data?.message || error.message || "Network error";
      setError(errorMsg);
      toast.error(`Failed to load rooms: ${errorMsg}`);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setIsOwner(data.role === "hotelOwner");
        setSearchedCities(data.recentSearchedCities || []);
      } else {
        setTimeout(() => {
          fetchUser();
        }, 5000);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  // Fetch rooms on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    axios,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    rooms,
    loading,
    error,
    fetchRooms,
    setError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
