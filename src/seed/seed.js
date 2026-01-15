import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import {User} from "../models/user.models.js";
import {Event} from "../models/event.models.js";
import {TicketCategory} from "../models/ticketcat.models.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    
    await User.deleteMany({});
    await Event.deleteMany({});
    await TicketCategory.deleteMany({});


    const user = await User.create({
      username: "testuser",
      email: "test@test.com",
      password: "password123",
      role: "CUSTOMER",
    });

    console.log("User created:", user._id);

    const event = await Event.create({
      title: "SVSC Launch Event",
      description: "Backend system demo event",
      venue: "Bangalore Convention Center",
      city: "Bangalore",
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 26 * 60 * 60 * 1000),
      totalSeats: 100,
      availableSeats: 100,
      organizer: user._id,
      status: "PUBLISHED",
    });

    console.log("Event created:", event._id);

   
    const category = await TicketCategory.create({
      name: "General Admission",
      description: "Standard entry",
      price: 500,
      totalSeats: 50,
      availableSeats: 50,
      event: event._id,
    });

    console.log("Ticket category created:", category._id);

    console.log(" SEED COMPLETED SUCCESSFULLY");
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error(" SEED FAILED", err);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seed();
