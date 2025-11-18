const Schedule = require('../models/Schedule');
const User = require('../models/User');

// @desc    Get user's pickup schedule
// @route   GET /api/schedules/my-schedule
// @access  Private
exports.getMySchedule = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('municipality');

    if (!user.municipality) {
      return res.status(400).json({
        error: 'No municipality assigned to user'
      });
    }

    // Find schedule based on user's location or zone
    // For now, we'll get all schedules for the municipality
    const schedules = await Schedule.find({
      municipality: user.municipality._id
    }).populate('municipality', 'name config.wasteTypes');

    res.json({
      success: true,
      data: schedules
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch schedule',
      message: error.message
    });
  }
};

// @desc    Get schedule by zone
// @route   GET /api/schedules/zone/:zone
// @access  Public
exports.getScheduleByZone = async (req, res) => {
  try {
    const { municipalityId } = req.query;
    
    const schedule = await Schedule.findOne({
      zone: req.params.zone,
      municipality: municipalityId
    }).populate('municipality', 'name config.wasteTypes');

    if (!schedule) {
      return res.status(404).json({
        error: 'Schedule not found for this zone'
      });
    }

    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch schedule',
      message: error.message
    });
  }
};

// @desc    Subscribe to schedule reminders
// @route   POST /api/schedules/:scheduleId/subscribe
// @access  Private
exports.subscribeToSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.scheduleId);

    if (!schedule) {
      return res.status(404).json({
        error: 'Schedule not found'
      });
    }

    // Check if already subscribed
    if (schedule.subscribers.includes(req.user._id)) {
      return res.status(400).json({
        error: 'Already subscribed to this schedule'
      });
    }

    schedule.subscribers.push(req.user._id);
    await schedule.save();

    res.json({
      success: true,
      message: 'Subscribed to schedule reminders'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to subscribe',
      message: error.message
    });
  }
};

// @desc    Unsubscribe from schedule reminders
// @route   DELETE /api/schedules/:scheduleId/subscribe
// @access  Private
exports.unsubscribeFromSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.scheduleId);

    if (!schedule) {
      return res.status(404).json({
        error: 'Schedule not found'
      });
    }

    schedule.subscribers = schedule.subscribers.filter(
      sub => sub.toString() !== req.user._id.toString()
    );
    
    await schedule.save();

    res.json({
      success: true,
      message: 'Unsubscribed from schedule reminders'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to unsubscribe',
      message: error.message
    });
  }
};

// @desc    Get next pickup dates
// @route   GET /api/schedules/next-pickups
// @access  Private
exports.getNextPickups = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.municipality) {
      return res.status(400).json({
        error: 'No municipality assigned'
      });
    }

    // Get schedules user is subscribed to
    const schedules = await Schedule.find({
      subscribers: user._id,
      municipality: user.municipality
    }).select('zone pickups');

    // Flatten and sort all upcoming pickups
    const upcomingPickups = [];
    
    schedules.forEach(schedule => {
      schedule.pickups.forEach(pickup => {
        if (pickup.nextPickup >= new Date()) {
          upcomingPickups.push({
            zone: schedule.zone,
            wasteType: pickup.wasteType,
            date: pickup.nextPickup,
            time: pickup.time,
            frequency: pickup.frequency
          });
        }
      });
    });

    // Sort by date
    upcomingPickups.sort((a, b) => a.date - b.date);

    res.json({
      success: true,
      count: upcomingPickups.length,
      data: upcomingPickups.slice(0, 10) // Next 10 pickups
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch next pickups',
      message: error.message
    });
  }
};

// @desc    Create schedule (Admin only)
// @route   POST /api/schedules
// @access  Private/Admin
exports.createSchedule = async (req, res) => {
  try {
    // Calculate next pickup dates
    const pickupsWithDates = req.body.pickups.map(pickup => ({
      ...pickup,
      nextPickup: calculateNextPickup(pickup.dayOfWeek, pickup.frequency)
    }));

    const schedule = await Schedule.create({
      ...req.body,
      pickups: pickupsWithDates
    });

    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      data: schedule
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create schedule',
      message: error.message
    });
  }
};

// Helper function to calculate next pickup date
function calculateNextPickup(dayOfWeek, frequency) {
  const today = new Date();
  const currentDay = today.getDay();
  
  let daysUntilNext = (dayOfWeek - currentDay + 7) % 7;
  
  // If it's today but time has passed, or it's 0 days away, schedule for next occurrence
  if (daysUntilNext === 0) {
    daysUntilNext = frequency === 'weekly' ? 7 : frequency === 'biweekly' ? 14 : 30;
  }
  
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntilNext);
  nextDate.setHours(0, 0, 0, 0);
  
  return nextDate;
}
