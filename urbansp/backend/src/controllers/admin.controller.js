const User = require('../models/user.model');
const Service = require('../models/service.model');
const Booking = require('../models/booking.model');

exports.getAnalytics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalServices,
      totalBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings,
      revenueResult,
      categoryStats,
      monthlyBookings,
    ] = await Promise.all([
      User.countDocuments(),
      Service.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'cancelled' }),
      Booking.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
      ]),
      Service.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $project: { category: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),
      Booking.aggregate([
        {
          $group: {
            _id: { $month: '$createdAt' },
            count: { $sum: 1 },
            revenue: { $sum: '$totalAmount' },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 12 },
      ]),
    ]);

    res.json({
      success: true,
      totalUsers,
      totalServices,
      totalBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings,
      totalRevenue: revenueResult[0]?.totalRevenue || 0,
      categoryStats,
      monthlyBookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
