import express from 'express';
import Settings from '../models/Settings.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/settings - Get settings (public)
router.get('/', async (req, res, next) => {
  try {
    let settings = await Settings.findOne().lean();

    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({
        siteName: 'AutoElite Motors',
        tagline: 'Premium Pre-Owned Vehicles',
        phone: '+91 98765 43210',
        email: 'info@autoelitemotors.com',
        address: '123 Auto Plaza, MG Road, Bangalore - 560001',
        whatsapp: '+919876543210',
        socialLinks: {},
      });
    }

    res.json(settings);
  } catch (error) {
    next(error);
  }
});

// PUT /api/settings - Update settings (admin only)
router.put('/', authenticate, async (req, res, next) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    next(error);
  }
});

export default router;

