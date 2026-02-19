import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    trim: true
  },

  otp: {
    type: String,
    required: true,
    trim: true
  },

  expire: {
    type: Date,
    default: () => Date.now() + 5 * 60 * 1000
  },

  attempts: {
    type: Number,
    default: 0
  },

  verified: {
    type: Boolean,
    default: false
  }

});

export const OTP = mongoose.model("OTP", otpSchema);
