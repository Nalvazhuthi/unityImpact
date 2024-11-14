import mongoose from "mongoose";

const beneficiarySchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Name of the beneficiary or group
    email: { type: String, required: true, unique: true }, // Contact email
    password: { type: String, required: true }, // Hashed password
    location: {
      type: { type: String, enum: ["Point"], required: true }, // Geospatial point for location
      coordinates: { type: [Number], required: true }, // Array [longitude, latitude]
    },
    tasks: [
      {
        title: { type: String, required: true }, // Task title, e.g., "Need help with school supplies"
        description: { type: String, required: true }, // Detailed description of the task
        skillsNeeded: [{ type: String }], // Skills required, e.g., ['teaching', 'construction']
        status: {
          type: String,
          enum: ["Open", "In Progress", "Completed"],
          default: "Open",
        }, // Task status
        volunteer: { type: mongoose.Schema.Types.ObjectId, ref: "Volunteer" }, // Reference to the assigned volunteer, if any
      },
    ],
    feedback: [
      {
        volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "Volunteer" }, // Reference to the volunteer who helped
        rating: { type: Number, min: 1, max: 5 }, // Rating for the volunteer's help
        comments: String, // Any additional feedback
      },
    ],
  },
  { timestamps: true }
);

// Index for location-based searching
beneficiarySchema.index({ location: "2dsphere" });

export default mongoose.model("Beneficiary", beneficiarySchema);
