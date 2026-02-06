const API_BASE = "https://todo-list-cp7j.onrender.com/api";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTg0MjdkM2Y0ZGZiMDVmMDkzYTRhYjQiLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MDM1MjM4NCwiZXhwIjoxNzcwOTU3MTg0fQ.XuJMd52WM4HYJW8AJ_OXqkH_iWSpq2qrfDbiM-js3aA";
const TOTAL_TASKS = 10000;
const BATCH_SIZE = 500; // 🔥 10–20 safe range

const priorities = ["low", "medium", "high"];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomFutureDate(days = 60) {
  const d = new Date();
  d.setDate(d.getDate() + Math.floor(Math.random() * days));
  return d.toISOString();
}

async function createTask(index) {
  return fetch(`${API_BASE}/createtask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`
    },
    body: JSON.stringify({
      title: `Auto Task #${index}`,
      description: `Generated task ${index}`,
      priority: randomItem(priorities),
      dueDate: randomFutureDate()
    })
  });
}

async function run() {
  console.log("🚀 Fast seeding started...");
  console.time("⏱ Total Time");

  let created = 0;

  for (let i = 0; i < TOTAL_TASKS; i += BATCH_SIZE) {
    const batch = [];

    for (let j = i; j < i + BATCH_SIZE && j < TOTAL_TASKS; j++) {
      batch.push(createTask(j + 1));
    }

    const results = await Promise.allSettled(batch);

    results.forEach(r => {
      if (r.status === "fulfilled" && r.value.ok) {
        created++;
      }
    });

    console.log(`✅ Created: ${created}/${TOTAL_TASKS}`);
  }

  console.timeEnd("⏱ Total Time");
  console.log("🎉 DONE");
}

run();
