import React, { useEffect, useState } from "react";
import { roomsDummyData } from "../assets/assets";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const RecommendedHotels = () => {
  const { searchedCities, rooms } = useAppContext();
  const [recommended, setRecommended] = useState([]);

  const filterHotels = () => {
    const filterHotels = rooms
      .slice()
      .filter((room) => searchedCities.includes(room.hotel.city));
    setRecommended(filterHotels);
  };

  useEffect(() => {
    filterHotels();
  }, [rooms, searchedCities]);
  return (
    recommended.length > 0 && (
      <div className="flex flex-col item-center px-6 md:px-16 lg:px-24 bg-slate-50 mt-12">
        <Title
          title="Recommended Hotels"
          subTitle="Discover our handpicked selection of exeptional properties around the word , offering unparalleled luxury and unforgettable experiences."
        />
        <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
          {recommended.slice(0, 4).map((room, index) => (
            <HotelCard key={room.id} room={room} index={index} />
          ))}
        </div>
      </div>
    )
  );
};
export default RecommendedHotels;
