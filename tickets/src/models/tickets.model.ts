import { Model, Schema, model } from "mongoose";

export interface ITicket {
  title: string;
  price: number;
  userId: string;
}

export interface ITicketDoc extends Document, ITicket {}

interface ITicketModel extends Model<ITicketDoc> {}

const schema = new Schema<ITicketDoc, ITicketModel>(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        delete ret._id;
        delete ret.__v;
      },
      virtuals: true,
    },
  }
);

export const TicketModel = model<ITicketDoc, ITicketModel>("Ticket", schema);
