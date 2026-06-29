import { Application } from "./models/Application.js";
import { CustomerProfile } from "./models/CustomerProfile.js";
import { Job } from "./models/Job.js";
import { Notification } from "./models/Notification.js";
import { User } from "./models/User.js";
import { WorkerProfile } from "./models/WorkerProfile.js";

export async function seedIfEmpty() {
  const count = await User.countDocuments();
  if (count > 0) return;

  const customers = await User.insertMany([
    {
      name: "Rohit Shah",
      phone: "9000000001",
      role: "customer",
      avatarInitial: "R",
      location: "Mumbai",
      address: "Andheri West, Mumbai",
      isProfileComplete: true,
    },
    {
      name: "Anita Patel",
      phone: "9000000002",
      role: "customer",
      avatarInitial: "A",
      location: "Bengaluru",
      address: "Koramangala, Bengaluru",
      isProfileComplete: true,
    },
  ]);

  await CustomerProfile.insertMany([
    {
      userId: customers[0]._id,
      name: customers[0].name,
      phone: customers[0].phone,
      address: customers[0].address,
      customerType: "homeowner",
      rating: 4.7,
    },
    {
      userId: customers[1]._id,
      name: customers[1].name,
      phone: customers[1].phone,
      address: customers[1].address,
      customerType: "shop_owner",
      rating: 4.8,
    },
  ]);

  const workers = await User.insertMany([
    {
      name: "Suresh Maurya",
      phone: "9111111111",
      role: "worker",
      avatarInitial: "S",
      location: "Andheri West, Mumbai",
      isProfileComplete: true,
    },
    {
      name: "Imran Khan",
      phone: "9222222222",
      role: "worker",
      avatarInitial: "I",
      location: "Koramangala, Bengaluru",
      isProfileComplete: true,
    },
    {
      name: "Ramesh Kumar",
      phone: "9333333333",
      role: "worker",
      avatarInitial: "R",
      location: "Gomti Nagar, Lucknow",
      isProfileComplete: true,
    },
  ]);

  await WorkerProfile.insertMany([
    {
      userId: workers[0]._id,
      name: workers[0].name,
      phone: workers[0].phone,
      skills: ["electrician", "ac-repair"],
      experience: "6 years",
      expectedWage: 900,
      availableToday: true,
      preferredDistance: "5 km",
      location: workers[0].location,
      documentsUploaded: true,
      verified: true,
      rating: 4.8,
      totalJobsCompleted: 128,
    },
    {
      userId: workers[1]._id,
      name: workers[1].name,
      phone: workers[1].phone,
      skills: ["plumber"],
      experience: "5 years",
      expectedWage: 750,
      availableToday: true,
      preferredDistance: "5 km",
      location: workers[1].location,
      documentsUploaded: true,
      verified: true,
      rating: 4.7,
      totalJobsCompleted: 96,
    },
    {
      userId: workers[2]._id,
      name: workers[2].name,
      phone: workers[2].phone,
      skills: ["carpenter", "painter"],
      experience: "8 years",
      expectedWage: 1100,
      availableToday: false,
      preferredDistance: "10 km",
      location: workers[2].location,
      documentsUploaded: false,
      verified: true,
      rating: 4.6,
      totalJobsCompleted: 143,
    },
  ]);

  const jobs = await Job.insertMany([
    {
      customerId: customers[0]._id,
      title: "Fan installation in 2 rooms",
      category: "electrician",
      description: "Install two ceiling fans. Wiring is ready.",
      location: "Andheri West, Mumbai",
      wage: 850,
      date: "Today",
      time: "4:00 PM",
      urgent: false,
      workersNeeded: 1,
    },
    {
      customerId: customers[1]._id,
      title: "Kitchen sink leakage repair",
      category: "plumber",
      description: "Sink pipe leaking under counter. Need quick repair.",
      location: "Koramangala, Bengaluru",
      wage: 700,
      date: "Today",
      time: "6:00 PM",
      urgent: true,
      workersNeeded: 1,
    },
    {
      customerId: customers[0]._id,
      title: "Wardrobe hinge repair",
      category: "carpenter",
      description: "Door hinge broken and shelf needs polishing.",
      location: "Gomti Nagar, Lucknow",
      wage: 1200,
      date: "Tomorrow",
      time: "11:00 AM",
      urgent: false,
      workersNeeded: 1,
    },
    {
      customerId: customers[1]._id,
      title: "2 BHK interior painting",
      category: "painter",
      description: "Paint provided. Need two painters.",
      location: "Delhi",
      wage: 9000,
      date: "Weekend",
      time: "10:00 AM",
      urgent: false,
      workersNeeded: 2,
    },
    {
      customerId: customers[0]._id,
      title: "Daily school van driver",
      category: "driver",
      description: "Valid license required for school pickup and drop.",
      location: "Lucknow",
      wage: 7000,
      date: "Monday",
      time: "7:30 AM",
      urgent: false,
      workersNeeded: 1,
    },
  ]);

  const app = await Application.create({
    jobId: jobs[0]._id,
    workerId: workers[0]._id,
    customerId: customers[0]._id,
    status: "pending",
  });
  await Job.findByIdAndUpdate(jobs[0]._id, { $addToSet: { applicants: workers[0]._id } });

  await Notification.insertMany([
    {
      userId: customers[0]._id,
      title: "New application",
      message: "Suresh applied to Fan installation in 2 rooms",
      type: "application",
    },
    {
      userId: workers[0]._id,
      title: "Application pending",
      message: "Your application is pending review",
      type: "application",
    },
    {
      userId: customers[1]._id,
      title: "Demo jobs ready",
      message: "Your posted jobs are visible to local workers",
      type: "info",
    },
  ]);

  console.log(`Seeded Anga demo data with ${jobs.length} jobs and application ${app._id}`);
}
