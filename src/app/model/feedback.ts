import mongoose, { Document, Schema, models } from "mongoose";

export interface Feedback extends Document {
  email: string;
  name: string;
  message: string;
}

const FeedbackSchema: Schema = new Schema<Feedback>(
  {
    email: { type: String },
    name: { type: String },
    message: { type: String, required: true }
  },
  { timestamps: true }
);

const Feedback =
  models.Feedback || mongoose.model<Feedback>("Feedback", FeedbackSchema);

export default Feedback;
