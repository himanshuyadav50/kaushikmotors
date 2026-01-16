import express from 'express';
import Admin from '../models/Admin.js';
import { authenticate, generateToken } from '../middleware/auth.js';
import Vehicle from '../models/Vehicle.js';
import Enquiry from '../models/Enquiry.js';

const router = express.Router();

// POST /api/admin/login - Admin login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin || !(await admin.comparePassword(password))) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = generateToken(admin._id.toString());

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/me - Get current admin (protected)
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const admin = await Admin.findById((req as any).adminId).select('-password').lean();

    if (!admin) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }

    res.json(admin);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/stats - Get dashboard stats (protected)
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const [totalVehicles, availableVehicles, totalEnquiries, newEnquiries] = await Promise.all([
      Vehicle.countDocuments(),
      Vehicle.countDocuments({ status: 'available' }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({
        status: 'new',
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      }),
    ]);

    res.json({
      totalVehicles,
      availableVehicles,
      totalEnquiries,
      newEnquiries,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

