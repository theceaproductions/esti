// Mock Data for Contractor SaaS Application
import { ServiceCategory, PreloadedService, Contractor, Estimate, Appointment, ContractorService } from '../types';

// Default Service Categories
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: '1', name: 'Handyman', icon: 'Wrench', description: 'General repair and maintenance services' },
  { id: '2', name: 'Landscaping', icon: 'Trees', description: 'Lawn care and garden services' },
  { id: '3', name: 'Cleaning', icon: 'Sparkles', description: 'Residential and commercial cleaning' },
  { id: '4', name: 'Painting', icon: 'Paintbrush', description: 'Interior and exterior painting' },
  { id: '5', name: 'Electrical', icon: 'Zap', description: 'Electrical repairs and installations' },
  { id: '6', name: 'Plumbing', icon: 'Droplets', description: 'Plumbing repairs and installations' },
  { id: '7', name: 'HVAC', icon: 'Thermometer', description: 'Heating and cooling services' },
  { id: '8', name: 'Roofing', icon: 'Home', description: 'Roof repair and replacement' },
];

// Preloaded Services by Category
export const PRELOADED_SERVICES: PreloadedService[] = [
  // Handyman Services
  { id: 'h1', categoryId: '1', name: 'Furniture Assembly', description: 'Assemble or disassemble furniture', defaultMinPrice: 50, defaultMaxPrice: 150 },
  { id: 'h2', categoryId: '1', name: 'TV Mounting', description: 'Wall mount TV installation', defaultMinPrice: 75, defaultMaxPrice: 200 },
  { id: 'h3', categoryId: '1', name: 'Door Repair', description: 'Fix doors that won\'t close properly', defaultMinPrice: 60, defaultMaxPrice: 175 },
  { id: 'h4', categoryId: '1', name: 'Light Fixture Install', description: 'Install or replace light fixtures', defaultMinPrice: 80, defaultMaxPrice: 250 },
  { id: 'h5', categoryId: '1', name: 'Minor Carpentry', description: 'Basic wood repairs and adjustments', defaultMinPrice: 75, defaultMaxPrice: 200 },
  { id: 'h6', categoryId: '1', name: 'Caulking', description: 'Seal gaps and cracks', defaultMinPrice: 50, defaultMaxPrice: 150 },
  { id: 'h7', categoryId: '1', name: 'General Repairs', description: 'Miscellaneous repair tasks', defaultMinPrice: 60, defaultMaxPrice: 180 },

  // Landscaping Services
  { id: 'l1', categoryId: '2', name: 'Lawn Mowing', description: 'Regular lawn mowing service', defaultMinPrice: 35, defaultMaxPrice: 75 },
  { id: 'l2', categoryId: '2', name: 'Tree Trimming', description: 'Trim trees and shrubs', defaultMinPrice: 100, defaultMaxPrice: 300 },
  { id: 'l3', categoryId: '2', name: 'Leaf Removal', description: 'Clean up fallen leaves', defaultMinPrice: 50, defaultMaxPrice: 150 },
  { id: 'l4', categoryId: '2', name: 'Garden Bed Maintenance', description: 'Maintain garden beds', defaultMinPrice: 75, defaultMaxPrice: 200 },
  { id: 'l5', categoryId: '2', name: 'Sprinkler Repair', description: 'Fix irrigation systems', defaultMinPrice: 80, defaultMaxPrice: 250 },
  { id: 'l6', categoryId: '2', name: 'Sod Installation', description: 'Install new sod', defaultMinPrice: 200, defaultMaxPrice: 500 },
  { id: 'l7', categoryId: '2', name: 'Mulching', description: 'Apply fresh mulch', defaultMinPrice: 75, defaultMaxPrice: 200 },

  // Cleaning Services
  { id: 'c1', categoryId: '3', name: 'Standard Cleaning', description: 'Regular house cleaning', defaultMinPrice: 80, defaultMaxPrice: 150 },
  { id: 'c2', categoryId: '3', name: 'Deep Cleaning', description: 'Thorough deep cleaning', defaultMinPrice: 150, defaultMaxPrice: 300 },
  { id: 'c3', categoryId: '3', name: 'Move In/Out Cleaning', description: 'Cleaning for moving', defaultMinPrice: 175, defaultMaxPrice: 350 },
  { id: 'c4', categoryId: '3', name: 'Office Cleaning', description: 'Commercial office cleaning', defaultMinPrice: 100, defaultMaxPrice: 250 },
  { id: 'c5', categoryId: '3', name: 'Carpet Cleaning', description: 'Professional carpet cleaning', defaultMinPrice: 100, defaultMaxPrice: 200 },
  { id: 'c6', categoryId: '3', name: 'Window Cleaning', description: 'Clean interior/exterior windows', defaultMinPrice: 75, defaultMaxPrice: 175 },
  { id: 'c7', categoryId: '3', name: 'Upholstery Cleaning', description: 'Clean furniture upholstery', defaultMinPrice: 80, defaultMaxPrice: 200 },

  // Painting Services
  { id: 'p1', categoryId: '4', name: 'Interior Painting', description: 'Paint interior walls', defaultMinPrice: 200, defaultMaxPrice: 500 },
  { id: 'p2', categoryId: '4', name: 'Exterior Painting', description: 'Paint exterior surfaces', defaultMinPrice: 300, defaultMaxPrice: 800 },
  { id: 'p3', categoryId: '4', name: 'Cabinet Painting', description: 'Refinish cabinets', defaultMinPrice: 250, defaultMaxPrice: 600 },
  { id: 'p4', categoryId: '4', name: 'Deck Staining', description: 'Stain and seal decks', defaultMinPrice: 200, defaultMaxPrice: 500 },
  { id: 'p5', categoryId: '4', name: 'Trim Painting', description: 'Paint doors, windows, trim', defaultMinPrice: 100, defaultMaxPrice: 300 },
  { id: 'p6', categoryId: '4', name: 'Wallpaper Removal', description: 'Remove old wallpaper', defaultMinPrice: 75, defaultMaxPrice: 200 },
  { id: 'p7', categoryId: '4', name: 'Popcorn Ceiling Removal', description: 'Remove textured ceilings', defaultMinPrice: 150, defaultMaxPrice: 400 },

  // Electrical Services
  { id: 'e1', categoryId: '5', name: 'Outlet Installation', description: 'Install new electrical outlets', defaultMinPrice: 75, defaultMaxPrice: 175 },
  { id: 'e2', categoryId: '5', name: 'Light Switch Replacement', description: 'Replace switches', defaultMinPrice: 50, defaultMaxPrice: 125 },
  { id: 'e3', categoryId: '5', name: 'Ceiling Fan Install', description: 'Install ceiling fans', defaultMinPrice: 150, defaultMaxPrice: 300 },
  { id: 'e4', categoryId: '5', name: 'Electrical Panel Upgrade', description: 'Upgrade breaker panel', defaultMinPrice: 500, defaultMaxPrice: 1500 },
  { id: 'e5', categoryId: '5', name: 'Wiring Repair', description: 'Fix electrical wiring', defaultMinPrice: 100, defaultMaxPrice: 300 },
  { id: 'e6', categoryId: '5', name: 'Smoke Detector Install', description: 'Install smoke/CO detectors', defaultMinPrice: 50, defaultMaxPrice: 100 },
  { id: 'e7', categoryId: '5', name: 'Outdoor Lighting', description: 'Install outdoor lights', defaultMinPrice: 100, defaultMaxPrice: 300 },

  // Plumbing Services
  { id: 'pl1', categoryId: '6', name: 'Leak Repair', description: 'Fix leaking pipes', defaultMinPrice: 75, defaultMaxPrice: 200 },
  { id: 'pl2', categoryId: '6', name: 'Toilet Repair', description: 'Fix running or clogged toilets', defaultMinPrice: 75, defaultMaxPrice: 175 },
  { id: 'pl3', categoryId: '6', name: 'Faucet Installation', description: 'Install or replace faucets', defaultMinPrice: 75, defaultMaxPrice: 175 },
  { id: 'pl4', categoryId: '6', name: 'Water Heater Install', description: 'Install water heater', defaultMinPrice: 400, defaultMaxPrice: 1000 },
  { id: 'pl5', categoryId: '6', name: 'Drain Cleaning', description: 'Clear clogged drains', defaultMinPrice: 75, defaultMaxPrice: 200 },
  { id: 'pl6', categoryId: '6', name: 'Garbage Disposal', description: 'Install or repair disposal', defaultMinPrice: 100, defaultMaxPrice: 250 },
  { id: 'pl7', categoryId: '6', name: 'Sump Pump Install', description: 'Install sump pump', defaultMinPrice: 300, defaultMaxPrice: 600 },

  // HVAC Services
  { id: 'hv1', categoryId: '7', name: 'AC Repair', description: 'Repair air conditioning', defaultMinPrice: 100, defaultMaxPrice: 300 },
  { id: 'hv2', categoryId: '7', name: 'Heating Repair', description: 'Fix heating systems', defaultMinPrice: 100, defaultMaxPrice: 300 },
  { id: 'hv3', categoryId: '7', name: 'AC Installation', description: 'Install new AC unit', defaultMinPrice: 2000, defaultMaxPrice: 5000 },
  { id: 'hv4', categoryId: '7', name: 'Furnace Installation', description: 'Install new furnace', defaultMinPrice: 2000, defaultMaxPrice: 5000 },
  { id: 'hv5', categoryId: '7', name: 'Duct Cleaning', description: 'Clean HVAC ducts', defaultMinPrice: 150, defaultMaxPrice: 350 },
  { id: 'hv6', categoryId: '7', name: 'Thermostat Install', description: 'Install smart thermostat', defaultMinPrice: 75, defaultMaxPrice: 175 },
  { id: 'hv7', categoryId: '7', name: 'Maintenance Tune-Up', description: 'Annual HVAC maintenance', defaultMinPrice: 75, defaultMaxPrice: 150 },

  // Roofing Services
  { id: 'r1', categoryId: '8', name: 'Roof Inspection', description: 'Complete roof inspection', defaultMinPrice: 0, defaultMaxPrice: 75, defaultFixedPrice: 75 },
  { id: 'r2', categoryId: '8', name: 'Shingle Repair', description: 'Repair damaged shingles', defaultMinPrice: 100, defaultMaxPrice: 400 },
  { id: 'r3', categoryId: '8', name: 'Roof Replacement', description: 'Full roof replacement', defaultMinPrice: 3000, defaultMaxPrice: 10000 },
  { id: 'r4', categoryId: '8', name: 'Gutter Cleaning', description: 'Clean gutters and downspouts', defaultMinPrice: 75, defaultMaxPrice: 200 },
  { id: 'r5', categoryId: '8', name: 'Gutter Installation', description: 'Install new gutters', defaultMinPrice: 200, defaultMaxPrice: 600 },
  { id: 'r6', categoryId: '8', name: 'Skylight Installation', description: 'Install roof skylight', defaultMinPrice: 300, defaultMaxPrice: 800 },
  { id: 'r7', categoryId: '8', name: 'Flashing Repair', description: 'Repair roof flashing', defaultMinPrice: 75, defaultMaxPrice: 250 },
];

// Mock Current User (Contractor)
export const MOCK_CONTRACTOR: Contractor = {
  id: 'contractor-001',
  email: 'john@example.com',
  businessName: 'John\'s Home Services',
  logoUrl: undefined,
  phone: '(555) 123-4567',
  serviceArea: 'Downtown area',
  trialStartDate: new Date().toISOString(),
  trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  subscriptionStatus: 'trialing',
  onboardingCompleted: false,
  currentOnboardingStep: 0,
  createdAt: new Date().toISOString(),
};

// Mock Estimates
export const MOCK_ESTIMATES: Estimate[] = [
  {
    id: 'est-001',
    contractorId: 'contractor-001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@email.com',
    customerPhone: '(555) 234-5678',
    customerAddress: '123 Main St, Anytown, USA',
    selectedServices: [
      { serviceId: 'h1', name: 'Furniture Assembly', minPrice: 50, maxPrice: 150 },
      { serviceId: 'h2', name: 'TV Mounting', minPrice: 75, maxPrice: 200 },
    ],
    totalMinPrice: 125,
    totalMaxPrice: 350,
    jobDetails: 'Need help assembling IKEA furniture and mounting a 55" TV in the living room.',
    photoUrls: [],
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'est-002',
    contractorId: 'contractor-001',
    customerName: 'Mike Smith',
    customerEmail: 'mike@email.com',
    customerPhone: '(555) 345-6789',
    customerAddress: '456 Oak Ave, Anytown, USA',
    selectedServices: [
      { serviceId: 'c1', name: 'Standard Cleaning', minPrice: 80, maxPrice: 150 },
    ],
    totalMinPrice: 80,
    totalMaxPrice: 150,
    jobDetails: 'Regular house cleaning for 3 bedroom home.',
    photoUrls: [],
    status: 'approved',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Appointments
export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    contractorId: 'contractor-001',
    estimateId: 'est-002',
    customerName: 'Mike Smith',
    customerEmail: 'mike@email.com',
    customerPhone: '(555) 345-6789',
    scheduledDate: '2024-02-15',
    scheduledTime: '10:00 AM',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'apt-002',
    contractorId: 'contractor-001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@email.com',
    customerPhone: '(555) 234-5678',
    scheduledDate: '2024-02-20',
    scheduledTime: '2:00 PM',
    status: 'requested',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Contractor Services
export const MOCK_CONTRACTOR_SERVICES: ContractorService[] = [
  // Handyman services
  { id: 'cs-1', contractorId: 'contractor-001', categoryId: '1', name: 'Furniture Assembly', description: 'Assemble or disassemble furniture', minPrice: 50, maxPrice: 150, isActive: true, isCustom: false },
  { id: 'cs-2', contractorId: 'contractor-001', categoryId: '1', name: 'TV Mounting', description: 'Wall mount TV installation', minPrice: 75, maxPrice: 200, isActive: true, isCustom: false },
  { id: 'cs-3', contractorId: 'contractor-001', categoryId: '1', name: 'Door Repair', description: 'Fix doors that won\'t close properly', minPrice: 60, maxPrice: 175, isActive: true, isCustom: false },
  // Cleaning services
  { id: 'cs-4', contractorId: 'contractor-001', categoryId: '3', name: 'Standard Cleaning', description: 'Regular house cleaning', minPrice: 80, maxPrice: 150, isActive: true, isCustom: false },
  { id: 'cs-5', contractorId: 'contractor-001', categoryId: '3', name: 'Deep Cleaning', description: 'Thorough deep cleaning', minPrice: 150, maxPrice: 300, isActive: false, isCustom: false },
];
