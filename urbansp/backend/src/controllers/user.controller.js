const User = require('../models/user.model');

// ─── Register ──────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role, address, city, state, pincode, landmark } = req.body;

    // Phone 10-digit validation
    if (phone && !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone number must be exactly 10 digits.' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists.' });

    const user = new User({
      name, email, password,
      phone: phone || '',
      role: role === 'admin' ? 'admin' : 'user',
      isVerified: true,          // no OTP — direct verified
      address: address || '',
      city:    city    || '',
      state:   state   || '',
      pincode: pincode || '',
      landmark: landmark || '',
    });

    await user.save();
    const token = user.generateAuthToken();

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, isVerified: true },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Login ─────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = user.generateAuthToken();
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, isVerified: user.isVerified },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Get profile ───────────────────────────────────────────────────────────
exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpiresAt');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Update profile ────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, phone, address, city, state, pincode, landmark } = req.body;

    if (phone && !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone number must be exactly 10 digits.' });
    }

    if (name)     user.name     = name;
    if (phone)    user.phone    = phone;
    if (address)  user.address  = address;
    if (city)     user.city     = city;
    if (state)    user.state    = state;
    if (pincode)  user.pincode  = pincode;
    if (landmark) user.landmark = landmark;

    if (req.file) {
      const uploadResult = await require('../utils/cloudinary').uploadBuffer(req.file.buffer, 'avatars');
      user.avatar = uploadResult.secure_url || uploadResult.url;
    }

    await user.save();
    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar, city: user.city, pincode: user.pincode },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Get all users (admin) ─────────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -otp -otpExpiresAt');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Update user role (admin) ──────────────────────────────────────────────
exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = req.body.role;
    await user.save();
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
