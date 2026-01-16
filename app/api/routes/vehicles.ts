import express from 'express';
import Vehicle from '../models/Vehicle.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/vehicles - Get all vehicles (public)
router.get('/', async (req, res, next) => {
  try {
    const {
      status,
      featured,
      brand,
      fuelType,
      transmission,
      minPrice,
      maxPrice,
      search,
      sortBy = 'newest',
      limit,
    } = req.query;

    const query: any = {};

    // Status filter (default: only available and sold also )
    // if (status) {
    //   query.status = status;
    // } else {
    //   query.status = { $ne: 'sold' }; // Exclude sold by default
    // }

    query.status = { $ne: 'sold' }; // Exclude sold by default
    query.status = { $in: ['available', 'sold', 'reserved'] }; // Include both available and sold

    if (featured === 'true') {
      query.featured = true;
    }

    if (brand && brand !== 'All Brands') {
      query.brand = brand;
    }

    if (fuelType && fuelType !== 'All Fuel Types') {
      query.fuelType = fuelType;
    }

    if (transmission && transmission !== 'All Transmissions') {
      query.transmission = transmission;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
      ];
    }

    let sort: any = { createdAt: -1 };
    switch (sortBy) {
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      case 'year-new':
        sort = { year: -1 };
        break;
      case 'newest':
      default:
        sort = { createdAt: -1 };
    }

    const vehicles = await Vehicle.find(query)
      .sort(sort)
      .limit(limit ? Number(limit) : undefined)
      .lean();

    res.json(vehicles);
  } catch (error) {
    next(error);
  }
});

// GET /api/vehicles/:id - Get single vehicle (public)
router.get('/:id', async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).lean();

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    next(error);
  }
});

// POST /api/vehicles - Create vehicle (admin only)
router.post('/', authenticate, async (req, res, next) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    next(error);
  }
});

// PUT /api/vehicles/:id - Update vehicle (admin only)
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    res.json(vehicle);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/vehicles/:id - Delete vehicle (admin only)
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

