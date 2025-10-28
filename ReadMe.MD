# AI-ToDoTask

A simple **React Native To-Do Task app** with AI-assisted features.

---

## Overview

This project demonstrates a To-Do application built using **React Native** with a backend powered by **Node.js**. It integrates OpenAI API for optional AI features (like task suggestions or summarization).

---

## Features

* Add, edit, and delete tasks
* Mark tasks as completed
* Persistent storage (local or backend)
* AI-assisted task suggestions (requires OpenAI API key)
* Clean, functional UI

---

## Project Structure

```
AI-ToDoTask/
├─ Backend/        # Node.js server
├─ Frontend/       # React Native app
├─ README.md       # This file
└─ package.json
```

* **Backend/** – Handles OpenAI API calls and manages tasks.
* **Frontend/** – React Native app for managing your tasks.

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/kaosiso/AI-ToDoTask.git
cd AI-ToDoTask
```

### 2. Install dependencies

**Backend:**

```bash
cd Backend
npm install
```

**Frontend:**

```bash
cd ../Frontend
npm install
```

### 3. Configure OpenAI API Key

Create a `.env` file inside the `Backend` folder:

```
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Run the Backend

```bash
cd Backend
node server.js
```

### 5. Run the Frontend

```bash
cd Frontend
npx expo start
```

---

## Usage

1. Open the app on your device or simulator.
2. Add tasks using the input field.
3. Toggle completion status and delete tasks as needed.
4. (Optional) Use AI features for task suggestions or summaries.

---

## Notes

* Avoid excessive API calls to OpenAI to prevent quota issues.
* Make sure the backend server is running before using AI features.

---

## License

This project is for **educational purposes**. You may modify and use it as needed.
