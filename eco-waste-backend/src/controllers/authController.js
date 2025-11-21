const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

// Normalize geo coordinates
function normalizeCoordinates(coordinates) {
  if (!coordinates || !coordinates.coordinates) {
    return { type: 'Point', coordinates: [0, 0] };
  }

  return {
    type: 'Point',
    coordinates: coordinates.coordinates
  };
}

// REGISTER
exports.register = async (req) => {
  const {
    email,
    password,
    firstName,
    lastName,
    phone,
    city,
    street,
    state,
    zipCode,
    country,
    coordinates
  } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('User with this email already exists');
    error.statusCode = 400;
    throw error;
  }

  const normalizedCoordinates = normalizeCoordinates(coordinates);

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
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokens.push(refreshToken);
  await user.save();

  return {
    user: user.toJSON(),
    token: accessToken,
    refreshToken
  };
};

// LOGIN
exports.login = async (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error('Please provide email and password');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !user.active) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokens.push(refreshToken);
  await user.save();

  return {
    user: user.toJSON(),
    token: accessToken,
    refreshToken
  };
};

// GET CURRENT USER
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('municipality', 'name config');

    return res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch user data',
      message: error.message
    });
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.refreshTokens = user.refreshTokens.filter(
      token => token !== req.body.refreshToken
    );

    await user.save();

    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({
      error: 'Logout failed',
      message: error.message
    });
  }
};



