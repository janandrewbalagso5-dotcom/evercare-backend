// Mock data matching EverCare frontend seed data
// Used when Firebase is not configured

export const DEFAULT_DOCTORS = [
  {
    id: "doc_vance",
    name: "Dr. Elizabeth Vance",
    specialty: "Cardiology",
    rating: 4.9,
    experience: 14,
    fee: 1500,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    bio: "Dr. Elizabeth Vance is a board-certified Cardiologist with over 14 years of experience.",
    availability: {
      days: ["Monday", "Wednesday", "Friday"],
      hours: ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"],
    },
  },
  {
    id: "doc_sterling",
    name: "Dr. Marcus Sterling",
    specialty: "Pediatrics",
    rating: 4.8,
    experience: 10,
    fee: 1200,
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
    bio: "Dr. Sterling is dedicated to providing compassionate healthcare for infants, children, and adolescents.",
    availability: {
      days: ["Tuesday", "Thursday", "Saturday"],
      hours: ["10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"],
    },
  },
  {
    id: "doc_jenkins",
    name: "Dr. Sarah Jenkins",
    specialty: "Dermatology",
    rating: 4.7,
    experience: 8,
    fee: 1300,
    avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300",
    bio: "Dr. Jenkins specializes in medical, surgical, and cosmetic dermatology.",
    availability: {
      days: ["Monday", "Thursday"],
      hours: ["01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"],
    },
  },
  {
    id: "doc_cho",
    name: "Dr. David Cho",
    specialty: "General Medicine",
    rating: 4.6,
    experience: 12,
    fee: 1000,
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300",
    bio: "Dr. Cho provides comprehensive healthcare for families.",
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      hours: ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"],
    },
  },
  {
    id: "doc_gallagher",
    name: "Dr. Fiona Gallagher",
    specialty: "Orthopedics",
    rating: 4.9,
    experience: 16,
    fee: 1800,
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300",
    bio: "Dr. Gallagher specializes in orthopedic surgery, joint replacements, and sports medicine.",
    availability: {
      days: ["Wednesday", "Friday"],
      hours: ["02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"],
    },
  },
];

export const DEFAULT_USERS = [
  {
    uid: "pat_sample",
    email: "patient@evercare.com",
    password: "patient123",
    name: "Andrew Miller",
    role: "patient",
    phone: "+63 917 123 4567",
    gender: "Male",
    dob: "1992-08-15",
    bloodType: "O+",
    address: "123 Healthcare Blvd, Manila",
    twoFactorEnabled: true,
    twoFactorSecret: "123456",
  },
  {
    uid: "doc_vance",
    email: "doctor",
    password: "doctor123",
    name: "Dr. Elizabeth Vance",
    role: "doctor",
    phone: "+63 917 987 6543",
    specialty: "Cardiology",
    twoFactorEnabled: false,
  },
  {
    uid: "staff_sample",
    email: "staff",
    password: "staff123",
    name: "Sarah Conner",
    role: "staff",
    phone: "+63 918 222 3333",
    twoFactorEnabled: false,
  },
  {
    uid: "admin_sample",
    email: "admin",
    password: "admin123",
    name: "Super Administrator",
    role: "admin",
    phone: "+63 919 777 8888",
    twoFactorEnabled: false,
  },
];

export const DEFAULT_APPOINTMENTS = [
  {
    id: "apt_1",
    patientId: "pat_sample",
    patientName: "Andrew Miller",
    doctorId: "doc_vance",
    doctorName: "Dr. Elizabeth Vance",
    specialty: "Cardiology",
    date: "2026-06-08",
    time: "10:00 AM",
    status: "Confirmed",
    paymentStatus: "Paid",
    fee: 1500,
    complaint: "Routine cardiac checkup, experiencing mild chest tightness during intensive exercise.",
    notes: "Patient advised to monitor heart rate. Prescribed mild beta-blocker.",
    prescription: "Metoprolol 25mg - Once daily in the morning (30 days)",
    updatedAt: "2026-06-04T10:00:00Z",
  },
  {
    id: "apt_2",
    patientId: "pat_sample",
    patientName: "Andrew Miller",
    doctorId: "doc_sterling",
    doctorName: "Dr. Marcus Sterling",
    specialty: "Pediatrics",
    date: "2026-06-10",
    time: "02:00 PM",
    status: "Pending",
    paymentStatus: "Unpaid",
    fee: 1200,
    complaint: "Consultation regarding vaccine schedule for toddler.",
    notes: "",
    prescription: "",
    updatedAt: "2026-06-04T14:30:00Z",
  },
];

export const DEFAULT_TRANSACTIONS = [
  {
    id: "txn_1",
    appointmentId: "apt_1",
    patientId: "pat_sample",
    patientName: "Andrew Miller",
    amount: 1500,
    paymentMethod: "PayMongo - Card",
    status: "Successful",
    referenceId: "pm_link_ref_987654321",
    timestamp: "2026-06-04T10:05:00Z",
  },
];

export const DEFAULT_LOGS = [
  {
    id: "log_1",
    timestamp: "2026-06-04T10:00:00Z",
    userEmail: "system@evercare.com",
    action: "System Initialization",
    details: "EverCare Medical System initialized successfully.",
  },
];

export const DEFAULT_SETTINGS = {
  maintenanceMode: false,
  twoFactorRequired: false,
  allowedDomains: "*",
  backupInterval: "Daily",
};

// In-memory mock store (resets on server restart — good for demo/dev)
export const mockStore = {
  doctors: JSON.parse(JSON.stringify(DEFAULT_DOCTORS)),
  users: JSON.parse(JSON.stringify(DEFAULT_USERS)),
  appointments: JSON.parse(JSON.stringify(DEFAULT_APPOINTMENTS)),
  transactions: JSON.parse(JSON.stringify(DEFAULT_TRANSACTIONS)),
  logs: JSON.parse(JSON.stringify(DEFAULT_LOGS)),
  settings: JSON.parse(JSON.stringify(DEFAULT_SETTINGS)),
};

export const writeMockLog = (email, action, details) => {
  mockStore.logs.unshift({
    id: "log_" + Date.now(),
    timestamp: new Date().toISOString(),
    userEmail: email,
    action,
    details,
  });
  if (mockStore.logs.length > 100) mockStore.logs = mockStore.logs.slice(0, 100);
};
