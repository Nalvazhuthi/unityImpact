import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined", "canceled"], // Add "canceled" to the enum
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const Invite = mongoose.model("Invite", inviteSchema);

export default Invite;
