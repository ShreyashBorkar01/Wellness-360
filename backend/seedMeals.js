// backend/seedMeals.js
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fitnessauth";

const mealSchema = new mongoose.Schema({
  mealType: String, // breakfast, lunch, snack, dinner, fruit, juice
  name: String,
  qty: String,
  kcal: Number,
  dietType: String // veg or nonveg (not needed for fruits/juices)
});

const Meal = mongoose.models.Meal || mongoose.model("Meal", mealSchema);

const demoMeals = [
  // Breakfast
  { mealType: "breakfast", name: "Oatmeal", qty: "1 cup", kcal: 150, dietType: "veg" },
  { mealType: "breakfast", name: "Paneer Sandwich", qty: "2 pieces", kcal: 200, dietType: "veg" },
  { mealType: "breakfast", name: "Egg Sandwich", qty: "1 sandwich", kcal: 220, dietType: "nonveg" },
  { mealType: "breakfast", name: "Chicken Omelette", qty: "2 eggs", kcal: 180, dietType: "nonveg" },
  // Lunch
  { mealType: "lunch", name: "Dal Rice", qty: "1 bowl", kcal: 250, dietType: "veg" },
  { mealType: "lunch", name: "Paneer Curry", qty: "1 bowl", kcal: 300, dietType: "veg" },
  { mealType: "lunch", name: "Chicken Curry", qty: "1 bowl", kcal: 350, dietType: "nonveg" },
  { mealType: "lunch", name: "Fish Curry", qty: "1 bowl", kcal: 320, dietType: "nonveg" },
  // Snack
  { mealType: "snack", name: "Fruit Salad", qty: "1 cup", kcal: 100, dietType: "veg" },
  { mealType: "snack", name: "Sprouts", qty: "1 bowl", kcal: 120, dietType: "veg" },
  { mealType: "snack", name: "Boiled Eggs", qty: "2 eggs", kcal: 130, dietType: "nonveg" },
  { mealType: "snack", name: "Chicken Strips", qty: "4 pieces", kcal: 140, dietType: "nonveg" },
  // Dinner
  { mealType: "dinner", name: "Roti Sabzi", qty: "2 rotis", kcal: 200, dietType: "veg" },
  { mealType: "dinner", name: "Paneer Bhurji", qty: "1 cup", kcal: 220, dietType: "veg" },
  { mealType: "dinner", name: "Grilled Chicken", qty: "100g", kcal: 240, dietType: "nonveg" },
  { mealType: "dinner", name: "Fish Fry", qty: "2 pieces", kcal: 230, dietType: "nonveg" },
  // Fruits
  { mealType: "fruit", name: "Apple", qty: "1", kcal: 80 },
  { mealType: "fruit", name: "Banana", qty: "1", kcal: 100 },
  { mealType: "fruit", name: "Orange", qty: "1", kcal: 70 },
  // Juices
  { mealType: "juice", name: "Orange Juice", qty: "1 glass", kcal: 60 },
  { mealType: "juice", name: "Carrot Juice", qty: "1 glass", kcal: 50 }
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  await Meal.deleteMany({});
  await Meal.insertMany(demoMeals);
  console.log("✅ Seeded meal data successfully!");
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error("❌ Error seeding meals:", err);
  process.exit(1);
});
