import User from "../models/User.js";

// Middlewares to check if user is authentificated

export const protect = async (req, res, next) => {
    const { userId } = req.auth 
    if (!userId) {
        res.json({ success: false, message: "not authentificated" })
        
    } else {
        const user = await User.findById(userId)
        req.user = user
        next()
    }
}