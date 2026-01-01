import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    replies: [
      {
        message: {
          type: String,
          required: true,
          trim: true,
        },
        repliedAt: {
          type: Date,
          default: Date.now,
        },
        adminId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        adminName: {
          type: String,
          required: true,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

contactSchema.index({ userId: 1 });
contactSchema.index({ createdAt: -1 });

export default mongoose.model('Contact', contactSchema);

