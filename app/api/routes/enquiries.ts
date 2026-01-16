import express from 'express';
import Enquiry from '../models/Enquiry.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// POST /api/enquiries - Create enquiry (public)
router.post('/', async (req, res, next) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    res.status(201).json(enquiry);
  } catch (error) {
    next(error);
  }
});

// GET /api/enquiries - Get all enquiries (admin only)
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { status, search, limit } = req.query;

    const query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    let queryBuilder = Enquiry.find(query)
      .sort({ createdAt: -1 })
      .populate('vehicleId', 'title brand model');

    if (limit) {
      queryBuilder = queryBuilder.limit(Number(limit));
    }

    const enquiries = await queryBuilder.lean();

    res.json(enquiries);
  } catch (error) {
    next(error);
  }
});

// GET /api/enquiries/:id - Get single enquiry (admin only)
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate('vehicleId', 'title brand model images')
      .lean();

    if (!enquiry) {
      res.status(404).json({ error: 'Enquiry not found' });
      return;
    }

    res.json(enquiry);
  } catch (error) {
    next(error);
  }
});

// PUT /api/enquiries/:id - Update enquiry (admin only)
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!enquiry) {
      res.status(404).json({ error: 'Enquiry not found' });
      return;
    }

    res.json(enquiry);
  } catch (error) {
    next(error);
  }
});

// POST /api/enquiries/:id/notes - Add note to enquiry (admin only)
router.post('/:id/notes', authenticate, async (req, res, next) => {
  try {
    const { note } = req.body;

    if (!note || !note.trim()) {
      res.status(400).json({ error: 'Note is required' });
      return;
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { $push: { notes: note.trim() } },
      { new: true }
    );

    if (!enquiry) {
      res.status(404).json({ error: 'Enquiry not found' });
      return;
    }

    res.json(enquiry);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/enquiries/:id - Delete enquiry (admin only)
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      res.status(404).json({ error: 'Enquiry not found' });
      return;
    }

    res.json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

