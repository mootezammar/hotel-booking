import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { regiterHotel } from '../controllers/hotelController.js';


const hotelRouter = express.Router()

hotelRouter.post('/', protect, regiterHotel)

export default hotelRouter