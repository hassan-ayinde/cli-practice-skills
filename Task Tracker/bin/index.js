#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const taskCommand = process.argv[2];

let tasks = [];
let newTask = {
  id: null,
  description: "",
  status: "todo",
  timeCreated: null,
};
const dbPath = path.join(__dirname, "..", "db.json");
switch (taskCommand) {
  case "add":
    // ensure db file exists and read existing tasks
    if (fs.existsSync(dbPath)) {
      try {
        const raw = fs.readFileSync(dbPath, "utf-8");
        tasks = JSON.parse(raw) || [];
      } catch (err) {
        // if parsing fails, fallback to empty list
        tasks = [];
      }
    }

    // compute next id (max id + 1) or 1 when no tasks
    const nextId =
      tasks.length > 0 ? Math.max(...tasks.map((t) => t.id || 0)) + 1 : 1;

    newTask = {
      id: nextId,
      description: process.argv[3] || "",
      status: "todo",
      timeCreated: new Date().toISOString(),
    };

    tasks.push(newTask);

    fs.writeFileSync(dbPath, JSON.stringify(tasks, null, 2), "utf-8");
    console.log(`Added task id=${nextId}`);
    break;
  case "update":
    const id = parseInt(process.argv[3], 10);
    const field = process.argv[4];
    const value = process.argv[5];
    if (!id || !field || typeof value === "undefined") {
      console.error("Usage: update <id> <field> <value>");
      process.exit(1);
    }

    try {
      const raw = fs.readFileSync(dbPath, "utf-8");
      tasks = JSON.parse(raw) || [];
    } catch (err) {
      console.error("Could not read db.json");
      process.exit(1);
    }

    // Find and update
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) {
      console.error(`Task with id=${id} not found.`);
      process.exit(1);
    }
    if (field !== "description" && field !== "status") {
      console.error("Can only update 'description' or 'status'.");
      process.exit(1);
    }
    tasks[idx][field] = value;
    tasks[idx]["updatedAt"] = new Date().toISOString();
    fs.writeFileSync(dbPath, JSON.stringify(tasks, null, 2), "utf-8");
    console.log(`Task id=${id} updated: ${field} -> ${value}`);
    break;
  case "delete":
    const delId = parseInt(process.argv[3], 10);
    if (!delId) {
      console.error("Usage: delete <id>");
      process.exit(1);
    }

    try {
      const raw = fs.readFileSync(dbPath, "utf-8");
      tasks = JSON.parse(raw) || [];
    } catch (err) {
      console.error("Could not read db.json");
      process.exit(1);
    }

    const initialLength = tasks.length;
    tasks = tasks.filter((t) => t.id !== delId);
    if (tasks.length === initialLength) {
      console.error(`Task with id=${delId} not found.`);
      process.exit(1);
    }

    fs.writeFileSync(dbPath, JSON.stringify(tasks, null, 2), "utf-8");
    console.log(`Deleted task id=${delId}`);
    break;
  case "list":
    try {
      const raw = fs.readFileSync(dbPath, "utf-8");
      tasks = JSON.parse(raw) || [];
    } catch (err) {
      console.error("Could not read db.json");
      process.exit(1);
    }

    if (tasks.length === 0) {
      console.log("No tasks found.");
    } else {
      if (!process.argv[3]) {
        console.log(tasks);
      }
      if (process.argv[3] === "done") {
        tasks = tasks.filter((t) => t.status === "done");
        console.log(tasks);
      } else if (process.argv[3] !== "done" && process.argv[3]) {
        console.error("Usage: list <done>");
        process.exit(1);
      }
    }
    break;
  default:
    console.error("Unknown command. Use add, update, delete, or list.");
    process.exit(1);
}
