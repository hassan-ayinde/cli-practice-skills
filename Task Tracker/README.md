# CLI Task Tracker

A simple command-line task tracker built with Node.js to manage your tasks. You can add, update, delete, and list tasks directly from the terminal. Tasks are stored in a JSON file (db.json) for persistence.

## Features

- Add new tasks with a description
- Update task status (todo, in-progress, done) or description
- Delete tasks by ID
- List all tasks or filter by completed tasks
- Automatically tracks creation and update timestamps

## Installation

- Clone the repository:

```bash
git clone <your-repo-url>
cd <repo-folder>
```

- Ensure you have Node.js installed (v14+ recommended).

- Install dependencies (none in this project, built-in Node.js modules only):

```bash
npm install
```

- Make the script executable:

```bash
chmod +x bin/index.js
```

## Usage

- Run the script from the terminal:

```bash
node index.js <command> [options]
```

## Commands

### Add a task

```bash
node index.js add "Task description"
```

- Example:

```bash
node index.js add "Finish writing README"
```

### Update a task

- Update the status or description of a task:

```bash
node index.js update <id> <field> <value>
```

- field can be status or description
- status value must be todo, in-progress, or done  

- **Example:**

```bash
node index.js update 1 status done
node index.js update 1 description "Finish README and test CLI"
```

### Delete a task

```bash
node index.js delete <id>
```

- Example:

```bash
node index.js delete 1
```

### List tasks

```bash
node index.js list
```

## Data Storage

Tasks are saved in a JSON file: db.json in the project root. Each task object has the following structure:

```json
{
  "id": 1,
  "description": "Finish README",
  "status": "todo",
  "timeCreated": "2025-11-15T18:00:00.000Z",
  "updatedAt": "2025-11-15T18:10:00.000Z" // optional
}
```

## Contributing

Contributions are welcome! Feel free to fork this project and submit pull requests.

## License

MIT License
