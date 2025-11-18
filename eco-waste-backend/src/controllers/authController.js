const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

// Helper to ensure coordinates
function normalizeCoordinates(address) {
  if (!address) return { type: 'Point', coordinates: [0, 0] };
  if (!address.coordinates) return { type: 'Point', coordinates: [0, 0] };
  if (!Array.isArray(address.coordinates.coordinates)) {
    return { type: 'Point', coordinates: [0, 0] };
  }
  return {
    type: 'Point',
    coordinates: address.coordinates.coordinates
  };
}

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, city, street, state, zipCode, country, coordinates } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email already exists'
      });
    }

    // Normalize coordinates for geospatial index
    const normalizedCoordinates = coordinates?.coordinates ? { type: 'Point', coordinates: coordinates.coordinates } : { type: 'Point', coordinates: [0, 0] };

    // Create user
    const user = await User.create({
      email,
      password,
      profile: {
        firstName,
        lastName,
        phone,
        address: {
          street,
          city,
          state,
          zipCode,
          country: country || 'Kenya',
          coordinates: normalizedCoordinates
        }
      }
      // municipality is auto-assigned by User model if missing
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshTokens.push(refreshToken);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.active) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push(refreshToken);
    await user.save();

    res.json({
      success: true,
      message: 'Login successful',
      data: { user: user.toJSON(), accessToken, refreshToken }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('municipality', 'name config');

    res.json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data', message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.refreshTokens = user.refreshTokens.filter(
      token => token !== req.body.refreshToken
    );

    await user.save();

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed', message: error.message });
  }
};


