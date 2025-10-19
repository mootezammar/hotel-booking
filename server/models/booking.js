import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
    user: { type: String, ref: "User", required: true },
    room: { type: String, ref: "Room", required: true },
    hotel: { type: String, ref: "Hotel", required: true },
    chekInDate: { type: Date, required: true },
    chekOutDate: { type: Date, required: true },
    totalPricce: { type: Number, required: true },
    guests: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    paymentMethod: { type: String, required: true, default: "Pay At Hotel" },
    isPaid: { type: Boolean, default: false }


}, { timestamps: true })

const Booking = mongoose.model("Booking", bookingSchema)

export default Booking