const Service = require('../models/service.model');
const { uploadBuffer } = require('../utils/cloudinary');

const uploadImagesToCloudinary = async (files, folder = 'services') => {
  const images = [];
  for (const file of files) {
    try {
      const result = await uploadBuffer(file.buffer, folder);
      images.push(result.secure_url || result.url);
    } catch (err) {
      console.error('Cloudinary upload error:', err.message);
      // Skip failed uploads rather than crashing the whole request
    }
  }
  return images;
};

// CREATE SERVICE
const createService = async (req, res) => {
  try {
    const { title, description, category, price, lng, lat, address, city, state } = req.body;

    if (!title || !description || !category || !price) {
      return res.status(400).json({ success: false, message: 'title, description, category and price are required' });
    }

    const images = req.files?.length ? await uploadImagesToCloudinary(req.files) : [];

    const location =
      lng && lat
        ? { type: 'Point', coordinates: [Number(lng), Number(lat)] }
        : { type: 'Point', coordinates: [0, 0] };

    const service = await Service.create({
      title,
      description,
      category,
      price: Number(price),
      images,
      address,
      city,
      state,
      location,
      createdBy: req.user?.id || req.user?._id,
    });

    res.status(201).json({ success: true, message: 'Service created successfully', service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL SERVICES with search, filter, pagination
const getAllServices = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = { $regex: `^${category}$`, $options: 'i' };
    if (minPrice) query.price = { ...(query.price || {}), $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...(query.price || {}), $lte: Number(maxPrice) };

    const skip = (Number(page) - 1) * Number(limit);
    const sortField = ['createdAt', 'price', 'ratings'].includes(sortBy) ? sortBy : 'createdAt';

    const [services, total] = await Promise.all([
      Service.find(query)
        .populate('createdBy', 'name email')
        .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(Number(limit)),
      Service.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      services,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE SERVICE
const getSingleService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('createdBy', 'name email');
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE SERVICE
const updateService = async (req, res) => {
  try {
    const updateData = {};
    const { title, description, category, price, lng, lat, address, city, state } = req.body;

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (price) updateData.price = Number(price);
    if (address) updateData.address = address;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (lng && lat) updateData.location = { type: 'Point', coordinates: [Number(lng), Number(lat)] };

    if (req.files?.length) {
      updateData.images = await uploadImagesToCloudinary(req.files);
    }

    const updatedService = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedService) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.status(200).json({ success: true, message: 'Service updated successfully', service: updatedService });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE SERVICE
const deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET NEARBY SERVICES — address-based (pincode > landmark > city)
const getNearbyServices = async (req, res) => {
  try {
    const { pincode, landmark, city, limit = 20 } = req.query;

    if (!pincode && !city) {
      return res.status(400).json({ success: false, message: 'pincode or city is required' });
    }

    // Priority 1: exact pincode match
    let services = [];
    if (pincode) {
      services = await Service.find({ pincode: pincode.trim() })
        .populate('createdBy', 'name email')
        .limit(Number(limit));
    }

    // Priority 2: landmark match (if pincode returned nothing)
    if (services.length === 0 && landmark) {
      services = await Service.find({ landmark: { $regex: landmark.trim(), $options: 'i' } })
        .populate('createdBy', 'name email')
        .limit(Number(limit));
    }

    // Priority 3: city match
    if (services.length === 0 && city) {
      services = await Service.find({ city: { $regex: `^${city.trim()}$`, $options: 'i' } })
        .populate('createdBy', 'name email')
        .limit(Number(limit));
    }

    res.json({ success: true, count: services.length, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADD REVIEW to a service
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'rating and comment are required' });
    }

    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    service.reviews.push({ user: req.user.id, rating: Number(rating), comment });

    // Recalculate average rating
    const totalRating = service.reviews.reduce((sum, r) => sum + r.rating, 0);
    service.ratings = totalRating / service.reviews.length;

    await service.save();
    res.status(201).json({ success: true, message: 'Review added', service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createService,
  getAllServices,
  getSingleService,
  updateService,
  deleteService,
  getNearbyServices,
  addReview,
};
