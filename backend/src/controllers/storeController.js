
const storeService = require('../services/storeService');

const getStores = async (req, res) => {
    
    const userId = req.user.id; 

    try {
        const filters = {
            name: req.query.name,
            address: req.query.address,
        };
        const sort = {
            field: req.query.sort_field,
            order: req.query.sort_order,
        };
        Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

        const stores = await storeService.getStoresForUser(userId, filters, sort,req.user.id);
        res.status(200).json(stores);
    } catch (error) {
        console.error('Get stores for user error:', error);
        res.status(500).json({ message: 'Server error fetching stores.' });
    }
};


const getStoreById = async (req, res) => {
  const { id } = req.params;
  
  const userId = req.user.id; 

  try {
    const store = await storeService.getStoreById(id, userId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found.' });
    }
    res.status(200).json(store);
  } catch (error) {
    console.error('Get store by ID error:', error);
    res.status(500).json({ message: 'Server error fetching store.' });
  }
};

module.exports = {
    getStores,
    getStoreById
};