import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    available: {
      type: Boolean,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const ServiceModel = mongoose.model('Service', serviceSchema);

export default ServiceModel;
