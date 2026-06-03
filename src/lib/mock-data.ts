export const MOCK_TRAINER = {
  name: 'Dr. Arjun Mehta',
  title: 'Senior Fitness Coach, CSCS',
  initials: 'AM',
};

export const MOCK_CLIENTS = [
  {
    id: 1, name: 'Priya Sharma', age: 28, gender: 'F', goal: 'Fat Loss', status: 'active', initials: 'PS',
    programWeek: 4, calories: 1750, split: 'Push/Pull/Legs',
    assessment: { height: 165, weight: 72, bmi: 26.4, bf: 31, activity: 'Moderate (3-4x/wk)', healthConditions: 'None', medication: 'None', dietType: 'Vegetarian', sleep: '7h', stress: 'Moderate', trainingExp: 'Intermediate', injuries: 'None' },
    progress: {
      weight: [{ week: 'Week -8', val: 78.5 }, { week: 'Week -6', val: 77.2 }, { week: 'Week -4', val: 76.0 }, { week: 'Week -2', val: 74.8 }, { week: 'Week 1', val: 73.5 }, { week: 'Week 2', val: 72.8 }, { week: 'Week 3', val: 72.2 }, { week: 'Week 4', val: 71.5 }],
      bodyFat: [{ week: 'Week -8', val: 33 }, { week: 'Week -6', val: 32.2 }, { week: 'Week -4', val: 31.5 }, { week: 'Week -2', val: 31 }, { week: 'Week 1', val: 30.5 }, { week: 'Week 2', val: 30 }, { week: 'Week 3', val: 29.4 }, { week: 'Week 4', val: 28.8 }],
      adherence: [{ week: 'Week 1', val: 88 }, { week: 'Week 2', val: 92 }, { week: 'Week 3', val: 85 }, { week: 'Week 4', val: 90 }],
      water: [{ week: 'Week 1', val: 2.5 }, { week: 'Week 2', val: 2.8 }, { week: 'Week 3', val: 2.6 }, { week: 'Week 4', val: 3.0 }],
      logs: [
        { date: '2026-05-28', workout: 'Upper Body (Strength)', adherence: 100, notes: 'Felt strong, increased bench by 2.5kg' },
        { date: '2026-05-27', workout: 'Lower Body (Strength)', adherence: 100, notes: 'Good depth on squats' },
        { date: '2026-05-25', workout: 'Upper Body (Hypertrophy)', adherence: 90, notes: 'Skipped last set of tricep pushdowns' },
        { date: '2026-05-24', workout: 'Lower Body (Hypertrophy)', adherence: 100, notes: 'PR on Bulgarian split squats' },
        { date: '2026-05-22', workout: 'Cardio & Core', adherence: 80, notes: 'Cut plank short due to time' },
      ],
    },
  },
  {
    id: 2, name: 'Rohit Verma', age: 35, gender: 'M', goal: 'Muscle Gain', status: 'active', initials: 'RV',
    programWeek: 8, calories: 2850, split: 'PPL',
    assessment: { height: 178, weight: 72, bmi: 22.7, bf: 14, activity: 'Active (5-6x/wk)', healthConditions: 'None', medication: 'None', dietType: 'Eggetarian', sleep: '6.5h', stress: 'Low', trainingExp: 'Advanced', injuries: 'None' },
    progress: { weight: [{ week: 'Week -8', val: 68 }, { week: 'Week -6', val: 69 }, { week: 'Week -4', val: 70 }, { week: 'Week -2', val: 71 }, { week: 'Week 1', val: 71.5 }, { week: 'Week 2', val: 71.8 }, { week: 'Week 3', val: 72.2 }, { week: 'Week 4', val: 72.5 }], bodyFat: [], adherence: [], water: [] },
  },
  {
    id: 3, name: 'Ananya Patel', age: 32, gender: 'F', goal: 'General Fitness', status: 'review', initials: 'AP',
    programWeek: 2, calories: 1950, split: 'Full Body 3x',
    assessment: { height: 162, weight: 62, bmi: 23.6, bf: 26, activity: 'Light (1-2x/wk)', healthConditions: 'PCOS', medication: 'Metformin', dietType: 'Vegetarian', sleep: '7h', stress: 'High', trainingExp: 'Beginner', injuries: 'Lower back' },
    progress: { weight: [{ week: 'Week 1', val: 62 }, { week: 'Week 2', val: 61.5 }], bodyFat: [], adherence: [], water: [] },
  },
  {
    id: 4, name: 'Vikram Singh', age: 42, gender: 'M', goal: 'Weight Loss', status: 'active', initials: 'VS',
    programWeek: 6, calories: 2100, split: '5-Day Split',
    assessment: { height: 175, weight: 92, bmi: 30, bf: 28, activity: 'Sedentary', healthConditions: 'Hypertension', medication: 'Amlodipine', dietType: 'Non-Vegetarian', sleep: '6h', stress: 'High', trainingExp: 'Beginner', injuries: 'Knee pain' },
    progress: { weight: [{ week: 'Week -6', val: 98 }, { week: 'Week -4', val: 96 }, { week: 'Week -2', val: 94 }, { week: 'Week 1', val: 92.5 }, { week: 'Week 2', val: 91.8 }, { week: 'Week 3', val: 91 }, { week: 'Week 4', val: 90.2 }, { week: 'Week 5', val: 89.5 }, { week: 'Week 6', val: 89 }], bodyFat: [], adherence: [], water: [] },
  },
  {
    id: 5, name: 'Neha Gupta', age: 26, gender: 'F', goal: 'Fat Loss', status: 'active', initials: 'NG',
    programWeek: 3, calories: 1650, split: 'PPL',
    assessment: { height: 160, weight: 68, bmi: 26.5, bf: 30, activity: 'Moderate (3x/wk)', healthConditions: 'None', medication: 'None', dietType: 'Vegetarian', sleep: '7h', stress: 'Moderate', trainingExp: 'Beginner', injuries: 'None' },
    progress: { weight: [{ week: 'Week 1', val: 68 }, { week: 'Week 2', val: 67.2 }, { week: 'Week 3', val: 66.5 }], bodyFat: [], adherence: [], water: [] },
  },
  {
    id: 6, name: 'Arun Kumar', age: 30, gender: 'M', goal: 'Muscle Gain', status: 'delivered', initials: 'AK',
    programWeek: 12, calories: 3000, split: 'PPL + Arms',
    assessment: { height: 182, weight: 78, bmi: 23.5, bf: 12, activity: 'Very Active (6x/wk)', healthConditions: 'None', medication: 'None', dietType: 'Non-Vegetarian', sleep: '8h', stress: 'Low', trainingExp: 'Advanced', injuries: 'None' },
    progress: { weight: [], bodyFat: [], adherence: [], water: [] },
  },
];

export const MOCK_ACTIVITY = [
  { type: 'assessment', client: 'Priya Sharma', detail: 'Completed Week 4 assessment', time: '2h ago' },
  { type: 'plan', client: 'Rohit Verma', detail: 'Plan auto-generated & pending review', time: '4h ago' },
  { type: 'delivery', client: 'Arun Kumar', detail: 'Plan delivered via WhatsApp ✓', time: '6h ago' },
  { type: 'progress', client: 'Vikram Singh', detail: 'Logged new weight: 89kg (-0.5kg)', time: '8h ago' },
  { type: 'assessment', client: 'Ananya Patel', detail: 'New assessment submitted (pending)', time: '1d ago' },
  { type: 'plan', client: 'Neha Gupta', detail: 'Diet plan adjustments suggested by AI', time: '1d ago' },
];

export const MOCK_DIET_PLAN = {
  calories: 1750, protein: 130, carbs: 175, fat: 50,
  meals: [
    { day: 'Monday', meals: [
      { name: 'Breakfast', time: '07:30', items: 'Oats with whey, banana, almonds', cals: 420, protein: 32, carbs: 48, fat: 12 },
      { name: 'Lunch', time: '12:30', items: 'Brown rice, dal, curd, salad', cals: 510, protein: 28, carbs: 62, fat: 10 },
      { name: 'Snack', time: '16:00', items: 'Greek yogurt, mixed berries', cals: 180, protein: 18, carbs: 14, fat: 4 },
      { name: 'Dinner', time: '19:30', items: 'Paneer tikka, quinoa, veggies', cals: 490, protein: 36, carbs: 38, fat: 18 },
      { name: 'Post-Workout', time: '21:00', items: 'Whey shake, 1 apple', cals: 150, protein: 24, carbs: 18, fat: 2 },
    ] },
    { day: 'Tuesday', meals: [
      { name: 'Breakfast', time: '07:30', items: 'Scrambled eggs, multigrain toast, avocado', cals: 450, protein: 30, carbs: 32, fat: 20 },
      { name: 'Lunch', time: '12:30', items: 'Grilled chicken, sweet potato, broccoli', cals: 520, protein: 42, carbs: 48, fat: 14 },
      { name: 'Snack', time: '16:00', items: 'Protein bar, green tea', cals: 200, protein: 20, carbs: 22, fat: 5 },
      { name: 'Dinner', time: '19:30', items: 'Fish curry, cauliflower rice', cals: 430, protein: 38, carbs: 20, fat: 16 },
      { name: 'Post-Workout', time: '21:00', items: 'Casein shake', cals: 120, protein: 24, carbs: 3, fat: 1 },
    ] },
    { day: 'Wednesday', meals: [
      { name: 'Breakfast', time: '07:30', items: 'Smoothie bowl, granola, seeds', cals: 400, protein: 25, carbs: 50, fat: 12 },
      { name: 'Lunch', time: '12:30', items: 'Dal, roti, paneer, salad', cals: 530, protein: 30, carbs: 58, fat: 16 },
      { name: 'Snack', time: '16:00', items: 'Roasted makhana, buttermilk', cals: 160, protein: 8, carbs: 18, fat: 6 },
      { name: 'Dinner', time: '19:30', items: 'Soy chunks, bell peppers, quinoa', cals: 470, protein: 34, carbs: 42, fat: 14 },
      { name: 'Post-Workout', time: '21:00', items: 'Whey shake', cals: 120, protein: 24, carbs: 2, fat: 1 },
    ] },
    { day: 'Thursday', meals: [
      { name: 'Breakfast', time: '07:30', items: 'Cheela, mint chutney, curd', cals: 380, protein: 22, carbs: 38, fat: 14 },
      { name: 'Lunch', time: '12:30', items: 'Chicken breast, brown rice, sauteed veggies', cals: 540, protein: 46, carbs: 52, fat: 12 },
      { name: 'Snack', time: '16:00', items: 'Apple slices, peanut butter', cals: 220, protein: 8, carbs: 24, fat: 10 },
      { name: 'Dinner', time: '19:30', items: 'Grilled fish, asparagus, mash', cals: 460, protein: 40, carbs: 30, fat: 15 },
      { name: 'Post-Workout', time: '21:00', items: 'Whey shake, banana', cals: 200, protein: 24, carbs: 26, fat: 2 },
    ] },
    { day: 'Friday', meals: [
      { name: 'Breakfast', time: '07:30', items: 'Overnight oats, whey, berries', cals: 430, protein: 30, carbs: 52, fat: 10 },
      { name: 'Lunch', time: '12:30', items: 'Rajma, rice, curd', cals: 500, protein: 24, carbs: 64, fat: 12 },
      { name: 'Snack', time: '16:00', items: 'Mixed nuts, green tea', cals: 180, protein: 6, carbs: 8, fat: 14 },
      { name: 'Dinner', time: '19:30', items: 'Tofu stir-fry, noodles, veggies', cals: 490, protein: 28, carbs: 52, fat: 16 },
      { name: 'Post-Workout', time: '21:00', items: 'Whey shake', cals: 120, protein: 24, carbs: 2, fat: 1 },
    ] },
    { day: 'Saturday', meals: [
      { name: 'Breakfast', time: '08:00', items: 'Pancakes, honey, eggs', cals: 480, protein: 28, carbs: 56, fat: 16 },
      { name: 'Lunch', time: '13:00', items: 'Grilled prawns, couscous, salad', cals: 510, protein: 40, carbs: 48, fat: 14 },
      { name: 'Snack', time: '16:30', items: 'Cottage cheese, pineapple', cals: 190, protein: 22, carbs: 16, fat: 4 },
      { name: 'Dinner', time: '20:00', items: 'Lamb curry, roti', cals: 520, protein: 36, carbs: 38, fat: 20 },
      { name: 'Post-Workout', time: '21:30', items: 'Whey shake', cals: 120, protein: 24, carbs: 2, fat: 1 },
    ] },
    { day: 'Sunday', meals: [
      { name: 'Breakfast', time: '09:00', items: 'French toast, berries, maple syrup', cals: 440, protein: 24, carbs: 48, fat: 16 },
      { name: 'Lunch', time: '14:00', items: 'Roasted chicken, veggies, roast potatoes', cals: 560, protein: 44, carbs: 46, fat: 18 },
      { name: 'Snack', time: '17:00', items: 'Smoothie (whey, spinach, mango)', cals: 200, protein: 24, carbs: 28, fat: 2 },
      { name: 'Dinner', time: '20:00', items: 'Mixed lentil soup, grilled paneer', cals: 430, protein: 30, carbs: 36, fat: 14 },
      { name: 'Post-Workout', time: '21:00', items: 'Casein shake', cals: 120, protein: 24, carbs: 3, fat: 1 },
    ] },
  ],
};

export const MOCK_WORKOUT_PLAN = {
  split: 'Upper/Lower 4x',
  days: [
    { day: 'Monday', type: 'Upper Body (Strength)', exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: '6-8', rpe: '8', rest: '90s' },
      { name: 'Pull-Ups', sets: 4, reps: '8-10', rpe: '8', rest: '75s' },
      { name: 'Seated DB Shoulder Press', sets: 3, reps: '10-12', rpe: '7', rest: '60s' },
      { name: 'Barbell Rows', sets: 4, reps: '8-10', rpe: '8', rest: '75s' },
      { name: 'Lateral Raises', sets: 3, reps: '15', rpe: '7', rest: '45s' },
      { name: 'Face Pulls', sets: 3, reps: '15', rpe: '7', rest: '45s' },
    ] },
    { day: 'Tuesday', type: 'Lower Body (Strength)', exercises: [
      { name: 'Barbell Squats', sets: 4, reps: '6-8', rpe: '8.5', rest: '120s' },
      { name: 'Romanian Deadlifts', sets: 4, reps: '8-10', rpe: '8', rest: '90s' },
      { name: 'Walking Lunges', sets: 3, reps: '12/leg', rpe: '8', rest: '60s' },
      { name: 'Leg Press', sets: 3, reps: '12-15', rpe: '7', rest: '60s' },
      { name: 'Seated Hamstring Curl', sets: 3, reps: '15', rpe: '7', rest: '45s' },
      { name: 'Standing Calf Raises', sets: 4, reps: '15-20', rpe: '7', rest: '45s' },
    ] },
    { day: 'Wednesday', type: 'Rest / Active Recovery' },
    { day: 'Thursday', type: 'Upper Body (Hypertrophy)', exercises: [
      { name: 'Incline DB Press', sets: 4, reps: '10-12', rpe: '8', rest: '60s' },
      { name: 'Lat Pulldown', sets: 4, reps: '12-15', rpe: '8', rest: '60s' },
      { name: 'Cable Flyes', sets: 3, reps: '15', rpe: '7', rest: '45s' },
      { name: 'Seated Cable Row', sets: 4, reps: '12-15', rpe: '8', rest: '60s' },
      { name: 'DB Curls', sets: 3, reps: '12-15', rpe: '7', rest: '45s' },
      { name: 'Tricep Pushdowns', sets: 3, reps: '15', rpe: '7', rest: '45s' },
    ] },
    { day: 'Friday', type: 'Lower Body (Hypertrophy)', exercises: [
      { name: 'Hack Squat', sets: 4, reps: '10-12', rpe: '8', rest: '90s' },
      { name: 'Bulgarian Split Squats', sets: 3, reps: '10/leg', rpe: '8', rest: '60s' },
      { name: 'Hip Thrusts', sets: 4, reps: '12-15', rpe: '8', rest: '60s' },
      { name: 'Leg Extensions', sets: 3, reps: '15', rpe: '7', rest: '45s' },
      { name: 'Lying Hamstring Curl', sets: 3, reps: '15', rpe: '7', rest: '45s' },
      { name: 'Seated Calf Raises', sets: 4, reps: '15-20', rpe: '7', rest: '45s' },
    ] },
    { day: 'Saturday', type: 'Cardio & Core', exercises: [
      { name: 'Incline Walk', sets: 1, reps: '30 min', rpe: 'Zone 2', rest: '-' },
      { name: 'Hanging Leg Raises', sets: 3, reps: '15', rpe: '8', rest: '45s' },
      { name: 'Russian Twists', sets: 3, reps: '20', rpe: '7', rest: '45s' },
      { name: 'Plank', sets: 3, reps: '45s', rpe: '8', rest: '30s' },
    ] },
    { day: 'Sunday', type: 'Rest / Recovery' },
  ],
};

export function getGoalIcon(goal: string): string {
  if (goal.toLowerCase().includes('fat') || goal.toLowerCase().includes('weight')) return 'target';
  if (goal.toLowerCase().includes('muscle')) return 'zap';
  return 'activity';
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active': return '#22C55E';
    case 'review': return '#F59E0B';
    case 'delivered': return '#2563EB';
    default: return '#6B7280';
  }
}

export function getInitialsColor(id: number): string {
  const colors = ['#2563EB', '#8B5CF6', '#F59E0B', '#22C55E', '#EC4899', '#06B6D4'];
  return colors[id % colors.length];
}

/* ─── localStorage persistence ─── */
const STORAGE_KEY = 'fitpro_saved_clients';

function getSavedClients(): any[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function saveClients(list: any[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getAllClients() {
  const saved = getSavedClients();
  return [...MOCK_CLIENTS, ...saved];
}

export function addClient(data: any) {
  const saved = getSavedClients();
  const nextId = 1000 + saved.length + 1;
  const initials = (data.fullName || '').split(' ').map((s: string) => s[0]).join('').toUpperCase().slice(0, 2) || 'NA';
  const newClient = {
    id: nextId, name: data.fullName || 'New Client', age: Number(data.age) || 0, gender: data.gender || 'M',
    goal: data.goal || 'General Fitness', status: 'active', initials,
    programWeek: 1, calories: Number(data.calories) || 2000, split: data.split || 'Full Body 3x',
    assessment: {
      height: Number(data.height) || 170, weight: Number(data.weight) || 70,
      bmi: 24, bf: Number(data.bodyFatPercentage) || 20,
      activity: data.activityLevel || 'Moderate', healthConditions: data.healthConditions || 'None',
      medication: data.medication || 'None', dietType: data.dietType || 'Vegetarian',
      sleep: (data.sleepHours || 7) + 'h', stress: data.stressLevel || 'Moderate',
      trainingExp: data.experienceLevel || 'Beginner', injuries: data.injuries || 'None',
    },
    progress: { weight: [], bodyFat: [], adherence: [], water: [], logs: [] },
  };
  saved.push(newClient);
  saveClients(saved);
  return newClient;
}

export function getClientById(id: number | string) {
  return getAllClients().find(c => c.id === Number(id));
}
