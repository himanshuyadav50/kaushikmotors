import express from 'express';
import Testimonial from '../models/Testimonial.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/testimonials - Get all testimonials (public)
router.get('/', async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json(testimonials);
  } catch (error) {
    next(error);
  }
});

// POST /api/testimonials - Create testimonial (admin only)
router.post('/', authenticate, async (req, res, next) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    next(error);
  }
});

// PUT /api/testimonials/:id - Update testimonial (admin only)
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      res.status(404).json({ error: 'Testimonial not found' });
      return;
    }

    res.json(testimonial);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/testimonials/:id - Delete testimonial (admin only)
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      res.status(404).json({ error: 'Testimonial not found' });
      return;
    }

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

