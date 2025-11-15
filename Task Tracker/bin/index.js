#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const taskCommand = process.argv[2];
const dbPath = path.join(__dirname, "..", "db.json");
let tasks = [];
let newTask = {
  id: null,
  description: "",
  status: "todo",
  timeCreated: null,
};

/**
 * Loads tasks from the db.json file.
 *
 * Reads the JSON file containing tasks and parses it into an array of task objects.
 * If the file does not exist or parsing fails, it returns an empty array.
 *
 * @returns {Array<Object>} An array of task objects. Each task has properties like
 *  - id: number
 *  - description: string
 *  - status: string ("todo" | "done")
 *  - timeCreated: string (ISO date)
 *  - updatedAt?: string (ISO date, optional)
 */

function loadTasks() {
  if (!fs.existsSync(dbPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(dbPath, "utf-8")) || [];
  } catch {
    return [];
  }
}

switch (taskCommand) {
  case "add":
    // ensure db file exists and read existing tasks
    tasks = loadTasks();

    // compute next id (max id + 1) or 1 when no tasks
    const nextId =
      tasks.length > 0 ? Math.max(...tasks.map((t) => t.id || 0)) + 1 : 1;

    newTask = {
      id: nextId,
      description: process.argv[3],
      status: "todo",
      timeCreated: new Date().toISOString(),
    };

    if (!newTask.description) {
      console.error("Usage: add <description>");
      process.exit(1);
    }

    tasks.push(newTask);

    fs.writeFileSync(dbPath, JSON.stringify(tasks, null, 2), "utf-8");
    console.log(`Added task id=${nextId}`);
    break;
  case "update":
    const status = ["todo", "in-progress", "done"];
    const id = parseInt(process.argv[3], 10);
    const field = process.argv[4];
    const statusValue = process.argv[5];
    if (!status.includes(statusValue)) {
      console.error("Status must be one of: todo, in-progress, done");
      process.exit(1);
    }
    if (!id || !field || typeof statusValue === "undefined") {
      console.error("Usage: update <id> <field> <value>");
      process.exit(1);
    }
    tasks = loadTasks();
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
    tasks[idx][field] = statusValue;
    tasks[idx]["updatedAt"] = new Date().toISOString();
    fs.writeFileSync(dbPath, JSON.stringify(tasks, null, 2), "utf-8");
    console.log(`Task id=${id} updated: ${field} -> ${statusValue}`);
    break;
  case "delete":
    const delId = parseInt(process.argv[3], 10);
    if (!delId) {
      console.error("Usage: delete <id>");
      process.exit(1);
    }
    tasks = loadTasks();
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
    tasks = loadTasks();

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
