# Task Tracker CLI

A tiny command-line task tracker. Tasks are stored in `db.json` (project root) and the CLI exposes commands to add, update, delete and list tasks.

## Install (local development)

From the `Task Tracker` folder run:

```bash
npm link
# or: npm install -g .
```

This makes the `task-tracker` command available in your shell. You can also run the script directly with Node:

```bash
node ./bin/index.js <command>
```

## Commands

- `add <description>`

  # CLI Practice Skills — Workspace

  This repository is a workspace for small CLI practice projects. It contains one or more example command-line tools and supporting files. The purpose of this workspace is to explore CLI patterns, file-based persistence, and simple Node.js tooling.

  ## Structure

  - `Task Tracker/` — a sample CLI that manages tasks and stores them in `db.json`.
    - `bin/index.js` — the CLI entry point for the Task Tracker.
    - `db.json` — the data file used by the Task Tracker (created at runtime).

  ## Running the Task Tracker (example)

  To run the Task Tracker without installing globally, from the `Task Tracker` folder use:

  ```bash
  node ./bin/index.js <command>
  ```

  If you'd like to make the `task-tracker` command available system-wide during development, you can run:

  ```bash
  cd "Task Tracker"
  npm link
  # then run: task-tracker add "Buy milk"
  ```

  ## Contributing & Notes

  - The Task Tracker is intentionally small and file-based. It's suitable for learning and experimentation.
  - When running CLI tools that modify files, be mindful of concurrent runs which can cause race conditions.
  - Suggested improvements: add tests, improve CLI help output, and implement atomic writes for `db.json`.

  ## License

  This workspace is unlicensed (add a LICENSE file to set a license).
