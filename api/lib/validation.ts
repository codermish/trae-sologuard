import Joi from 'joi'

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

export const hotelSearchSchema = Joi.object({
  destination: Joi.string().required(),
  checkIn: Joi.date().iso().required(),
  checkOut: Joi.date().iso().greater(Joi.ref('checkIn')).required(),
  guests: Joi.number().integer().min(1).max(10).default(1),
  rooms: Joi.number().integer().min(1).max(5).default(1),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  rating: Joi.number().min(1).max(5).optional(),
  amenities: Joi.array().items(Joi.string()).optional(),
})

export const flightSearchSchema = Joi.object({
  origin: Joi.string().length(3).required(), // IATA code
  destination: Joi.string().length(3).required(), // IATA code
  departureDate: Joi.date().iso().required(),
  returnDate: Joi.date().iso().optional(),
  passengers: Joi.number().integer().min(1).max(9).default(1),
  cabinClass: Joi.string().valid('economy', 'business', 'first').default('economy'),
  maxPrice: Joi.number().min(0).optional(),
  maxStops: Joi.number().integer().min(0).max(3).optional(),
})

export const bookingSchema = Joi.object({
  type: Joi.string().valid('hotel', 'flight', 'car', 'package').required(),
  hotelId: Joi.string().when('type', { is: 'hotel', then: Joi.required() }),
  roomId: Joi.string().when('type', { is: 'hotel', then: Joi.required() }),
  flightId: Joi.string().when('type', { is: 'flight', then: Joi.required() }),
  carId: Joi.string().when('type', { is: 'car', then: Joi.required() }),
  checkIn: Joi.date().iso().optional(),
  checkOut: Joi.date().iso().optional(),
  guests: Joi.number().integer().min(1).max(10).default(1),
  rooms: Joi.number().integer().min(1).max(5).default(1),
  specialRequests: Joi.string().max(500).optional(),
  contactInfo: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
  }).required(),
})

export const reviewSchema = Joi.object({
  hotelId: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  title: Joi.string().max(100).required(),
  comment: Joi.string().max(1000).required(),
  images: Joi.array().items(Joi.string().uri()).max(5).optional(),
})