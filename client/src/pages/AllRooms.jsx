import React, { useMemo, useState } from "react";
import { assets, facilityIcons } from "../assets/assets";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import StarRating from "../components/StarRating";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const AllRooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    rooms = [],
    navigate,
    currency = "Dt",
    loading,
    error,
    fetchRooms,
  } = useAppContext();

  const [openFilters, setOpenFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    roomType: [],
    priceRange: [],
  });
  const [selectedSort, setSelectedSort] = useState("");

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];

  const priceRange = [
    "0 to 500",
    "500 to 1000",
    "1000 to 2000",
    "2000 to 3000",
  ];

  const sortOptions = [
    "Price Low to High",
    "Price High to Low",
    "Newest First",
  ];

  // Handle changes for filters and sortings
  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      // Ensure the array exists
      if (!updatedFilters[type]) {
        updatedFilters[type] = [];
      }

      if (checked) {
        updatedFilters[type].push(value);
      } else {
        updatedFilters[type] = updatedFilters[type].filter(
          (item) => item !== value
        );
      }
      return updatedFilters;
    });
  };

  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
  };

  // function to check if a room matches the selected room types
  const matchesRoomType = (room) => {
    const roomTypes = selectedFilters.roomType || [];
    return roomTypes.length === 0 || roomTypes.includes(room.roomType);
  };

  // function to check if a room matches the selected price ranges
  const matchesPriceRange = (room) => {
    const priceRanges = selectedFilters.priceRange || [];
    return (
      priceRanges.length === 0 ||
      priceRanges.some((range) => {
        const [min, max] = range.split(" to ").map(Number);
        return room.pricePerNight >= min && room.pricePerNight <= max;
      })
    );
  };

  // function to sort based on the selected sort option
  const sortRooms = (a, b) => {
    if (selectedSort === "Price Low to High") {
      return a.pricePerNight - b.pricePerNight;
    }
    if (selectedSort === "Price High to Low") {
      return b.pricePerNight - a.pricePerNight;
    }
    if (selectedSort === "Newest First") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  };

  // filter Destination
  const filterDestination = (room) => {
    const destination = searchParams.get("destination");
    if (!destination) return true;
    return room.hotel?.city?.toLowerCase().includes(destination.toLowerCase());
  };

  // filter and sort rooms based on the selected filters and sort destination
  const filteredRooms = useMemo(() => {
    if (!rooms || !Array.isArray(rooms)) {
      return [];
    }

    return rooms
      .filter(
        (room) =>
          room &&
          matchesRoomType(room) &&
          matchesPriceRange(room) &&
          filterDestination(room)
      )
      .sort(sortRooms);
  }, [rooms, selectedFilters, selectedSort, searchParams]);

  // clear all filters
  const clearFilters = () => {
    setSelectedFilters({
      roomType: [],
      priceRange: [],
    });
    setSelectedSort("");
    setSearchParams({});
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
        <div className="text-center">
          <p className="text-lg">Loading rooms...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={fetchRooms}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* left side */}
      <div className="w-full lg:flex-1">
        <div className="flex flex-col items-start text-left mb-6">
          <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
            Take advantage of our limited-time offers and special packages to
            enhance your stay and create unforgettable memories.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Showing {filteredRooms.length} of {rooms.length} rooms
          </p>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500">
              {rooms.length === 0
                ? "No rooms available."
                : "No rooms found matching your criteria."}
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredRooms.map((room) => (
            <div
              key={room._id}
              className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-600 last:pb-30 last:border-0"
            >
              <img
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  window.scrollTo(0, 0);
                }}
                src={room.images?.[0] || "/default-hotel.jpg"}
                alt="hotel-img"
                title="View Room Details"
                className="max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer"
              />
              <div className="md:w-1/2 flex flex-col gap-2">
                <p className="text-gray-500">
                  {room.hotel?.city || "Unknown City"}
                </p>
                <p
                  onClick={() => {
                    navigate(`/rooms/${room._id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="text-gray-800 text-3xl font-playfair cursor-pointer"
                >
                  {room.hotel?.name || "Unknown Hotel"}
                </p>
                <div className="flex items-center">
                  <StarRating />
                  <p className="ml-2">200+ reviews</p>
                </div>
                <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                  <img src={assets.locationIcon} alt="location-icon" />
                  <span>{room.hotel?.address || "Address not available"}</span>
                </div>
                {/* Rooms amenities */}
                <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                  {room.amenities?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70"
                    >
                      <img
                        src={facilityIcons[item]}
                        alt={item}
                        className="w-5 h-5"
                      />
                      <p className="text-xs">{item}</p>
                    </div>
                  ))}
                  {/* Room price per night */}
                  <p className="text-xl font-medium text-gray-700">
                    {room.pricePerNight || "N/A"} {currency} /night
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Filters */}
      <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16 lg:ml-7">
        <div
          className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${
            openFilters && "border-b"
          }`}
        >
          <p className="text-base font-medium text-gray-800">FILTERS</p>
          <div className="text-xs cursor-pointer">
            <span
              onClick={() => setOpenFilters(!openFilters)}
              className="lg:hidden"
            >
              {openFilters ? "HIDE" : "SHOW"}
            </span>
            <span
              onClick={clearFilters}
              className="hidden lg:block cursor-pointer hover:text-blue-500"
            >
              CLEAR
            </span>
          </div>
        </div>
        <div
          className={`${
            openFilters ? "h-auto" : "h-0 lg:h-auto"
          } overflow-hidden transition-all duration-700`}
        >
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Popular filters</p>
            {roomTypes.map((room, index) => (
              <CheckBox
                key={index}
                label={room}
                selected={selectedFilters.roomType?.includes(room) || false}
                onChange={(checked) =>
                  handleFilterChange(checked, room, "roomType")
                }
              />
            ))}
          </div>
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Price Range</p>
            {priceRange.map((range, index) => (
              <CheckBox
                key={index}
                label={`${range} ${currency}`}
                selected={selectedFilters.priceRange?.includes(range) || false}
                onChange={(checked) =>
                  handleFilterChange(checked, range, "priceRange")
                }
              />
            ))}
          </div>
          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 pb-2">Sort BY</p>
            {sortOptions.map((option, index) => (
              <RadioButton
                key={index}
                label={option}
                selected={selectedSort === option}
                onChange={() => handleSortChange(option)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
