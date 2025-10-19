import { v2 as cloudinary } from "cloudinary"
import Hotel from "../models/hotel.js"
import Room from "../models/room.js"

// Api to create new room for hotel
export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities } = req.body
        const hotel = await Hotel.findOne({ owner: req.auth.userId })

        if (!hotel) return res.json({ success: false, message: "No hotel found" })

        //upload images to cloudinary

        const uploadImages = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path)
            return response.secure_url
        })

        //wait for all uploads to complete
        const images = await Promise.all(uploadImages)

        //save data in mongo
        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images,

        })

        res.json({ success: true, message: "Room created succesfully" })

    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}

// Api to get all rooms

export const getRooms = async (req, res) => {
    try {

        const rooms = await Room.find({ isAvailable: true }).populate({
            path: 'hotel',
            populate: {
                path: 'owner',
                select: 'image'
            }
        }).sort({ createdAt: -1 })

        res.json({ success: true, rooms })


    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Api to get all rooms for a specific hotel

export const getOwnerRooms = async (req, res) => {
    try {
        const hotelData = await Hotel({ owner: req.auth.userId })
        const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate("hotel")
        res.json({ success: true, rooms })


    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Api to toggle availabilite of a rooms 

export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body
        const roomData = await Room.findById(roomId)

        roomData.isAvailable = !roomData.isAvailable

        await roomData.save()

        res.json({ success: true, message: "Room availability Updated" })



    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}