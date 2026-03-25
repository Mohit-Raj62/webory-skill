const mongoose = require('mongoose');

const SimulatorSchema = new mongoose.Schema({
  role: String,
  company: String,
  emails: Array,
  tasks: Array,
  initialCode: String,
  expectedRegex: String,
  difficulty: String,
  timeLimit: Number,
  hints: Array
});

const Simulator = mongoose.models.Simulator || mongoose.model('Simulator', SimulatorSchema);

async function run() {
  await mongoose.connect('mongodb+srv://realestate:mohitraj6205@cluster0.em7qp.mongodb.net/skill-webory');
  
  const sims = await Simulator.find({});
  console.log("Total Simulators:", sims.length);
  sims.forEach(s => {
    console.log(`Role: ${s.role}, Company: ${s.company}`);
    console.log(`Expected Regex: ${s.expectedRegex}`);
    console.log(`Hints:`, s.hints);
    console.log('---');
  });

  process.exit(0);
}

run().catch(console.error);
