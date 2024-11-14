import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skills: [{ type: String }],
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
  verified: { type: Boolean, default: false },
  completedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
}, { timestamps: true });

volunteerSchema.index({ location: '2dsphere' });
export default mongoose.model('Volunteer', volunteerSchema);
