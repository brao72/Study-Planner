<!--
███████╗████████╗██╗   ██╗██████╗ ██╗   ██╗    ██████╗ ██╗      █████╗ ███╗   ██╗███╗   ██╗███████╗██████╗ 
██╔════╝╚══██╔══╝██║   ██║██╔══██╗╚██╗ ██╔╝   ██╔═══██╗██║     ██╔══██╗████╗  ██║████╗  ██║██╔════╝██╔══██╗
█████╗     ██║   ██║   ██║██████╔╝ ╚████╔╝    ██║   ██║██║     ███████║██╔██╗ ██║██╔██╗ ██║█████╗  ██████╔╝
██╔══╝     ██║   ██║   ██║██╔═══╝   ╚██╔╝     ██║   ██║██║     ██╔══██║██║╚██╗██║██║╚██╗██║██╔══╝  ██╔══██╗
██║        ██║   ╚██████╔╝██║        ██║      ╚██████╔╝███████╗██║  ██║██║ ╚████║██║ ╚████║███████╗██║  ██║
╚═╝        ╚═╝    ╚═════╝ ╚═╝        ╚═╝       ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝
-->

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="license"/>
  <img src="https://img.shields.io/badge/PRs-welcome-blue.svg" alt="prs"/>
  <img src="https://img.shields.io/badge/PostgreSQL-16.x-blue?logo=postgresql" alt="postgres"/>
  <img src="https://img.shields.io/badge/Express.js-4.x-black?logo=express" alt="express"/>
</p>

<h1 align="center">📚 Study Planner</h1>
<p align="center">
A lightweight full-stack web app to <strong>plan, track, and visualise</strong> your study tasks.  
Kanban board ➜ Calendar view ➜ 8-week analytics — all synced in PostgreSQL.
</p>

---

## ✨ Features
| Module | What you get |
|--------|--------------|
| **Kanban Board** | ➕ Add tasks & due-date<br>↔️ Drag between **Backlog → In Progress → Done**<br>❌ Delete in one click |
| **Calendar** | Full-screen month grid; today highlighted 🎯<br>• Dot per task (multi-dot support)<br>Click a date → modal list |
| **Analytics** | 8-week line chart (tasks *due & completed*) with Chart.js |
| **Persistence** | PostgreSQL 16 — every CRUD action saved instantly |

---

## 🏗️ Tech Stack
| Layer | Tech |
|-------|------|
| **Frontend** | HTML · CSS · Vanilla JS |
| **Backend** | Express.js (ES-modules) |
| **Database** | PostgreSQL 16 &nbsp;🌐 pg driver |
| **Charts** | Chart.js 4 |
| **Dev Tools** | Nodemon · Dotenv |

---

## 🚀 Quick Start

### 1 Clone & install
```bash
git clone https://github.com/<your-username>/study-planner.git
cd study-planner
npm install
```

### 2 Postgres setup
```bash
# create role & db (adjust as you like)
createuser -s studyplanner_admin
createdb  studyplanner_db -O studyplanner_admin
psql studyplanner_db -f server/schema.sql   # table = tasks
```
### 3 Environment file
```bash
# .env  (DO NOT commit!)
DATABASE_URL=postgresql://studyplanner_admin@localhost:5432/studyplanner_db
PORT=3000   # optional
```


### 4 Run
```bash
npm run dev   # nodemon with auto-reload
# or
npm start     # plain node
```

### 📁 Project Structure
``` bash
study-planner/
├── client/
│   ├── index.html        # Kanban
│   ├── calendar.html     # Calendar view
│   ├── analytics.html    # Chart view
│   ├── style.css
│   ├── script.js
│   ├── calendar.js
│   └── analytics.js
├── server/
│   ├── index.js          # Express entry
│   ├── db.js             # PG pool
│   ├── schema.sql
│   └── routes/
│       ├── tasks.js
│       └── analytics.js
├── .env.example
└── package.json
```
