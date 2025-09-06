
const storeService = require('../services/storeService');

const getDashboard = async (req, res) => {
    
    const ownerId = req.user.id;

    try {
        const dashboardData = await storeService.getStoreDashboard(ownerId);

        if (!dashboardData) {
            return res.status(404).json({ message: 'No store found for this owner.' });
        }

        res.status(200).json(dashboardData);
    } catch (error) {
        console.error('Store owner dashboard error:', error);
        res.status(500).json({ message: 'Server error fetching dashboard data.' });
    }
};

module.exports = {
    getDashboard,
};