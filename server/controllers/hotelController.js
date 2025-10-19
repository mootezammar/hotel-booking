import Hotel from "../models/hotel.js";
import User from "../models/User.js";

//regiter hotel
export const regiterHotel = async (req, res) => {
    try {
        const { name, address, contact, city } = req.body
        const owner = req.user._id

        // check if user (hotel is already registred)
        const hotel = await Hotel.findOne({ owner })

        if (hotel) {
            return res.json({ success: false, message: "Hotel already registred" })
        }

        await Hotel.create({ name, address, contact, city, owner })

        await User.findByIdAndUpdate(owner, { role: "hotelOwner" })

        res.json({ success: true, message: "Hotel Registred succesfully" })
    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}