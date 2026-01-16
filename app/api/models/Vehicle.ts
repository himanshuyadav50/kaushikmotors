import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';
  transmission: 'Manual' | 'Automatic';
  mileage: number;
  description: string;
  status: 'available' | 'sold' | 'reserved';
  featured: boolean;
  images: string[];
  specs: {
    engine?: string;
    power?: string;
    seats?: number;
    color?: string;
    owners?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicle>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1900, 'Year must be after 1900'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    fuelType: {
      type: String,
      required: [true, 'Fuel type is required'],
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
    },
    transmission: {
      type: String,
      required: [true, 'Transmission is required'],
      enum: ['Manual', 'Automatic'],
    },
    mileage: {
      type: Number,
      required: [true, 'Mileage is required'],
      min: [0, 'Mileage must be positive'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['available', 'sold', 'reserved'],
      default: 'available',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (images: string[]) => images.length > 0,
        message: 'At least one image is required',
      },
    },
    specs: {
      engine: String,
      power: String,
      seats: Number,
      color: String,
      owners: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
VehicleSchema.index({ brand: 1, model: 1 });
VehicleSchema.index({ status: 1, featured: 1 });
VehicleSchema.index({ price: 1 });
VehicleSchema.index({ createdAt: -1 });

export default mongoose.model<IVehicle>('Vehicle', VehicleSchema);

