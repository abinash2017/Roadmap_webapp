# AI Roadmap: 10-Month Study Tracker

A personal study tracker for a **10-month AI / LLM engineering roadmap** that runs on your own computer.
Follow a day-by-day plan, tick off topics, keep notes, plan daily to-dos, practise DSA problems on a schedule,
and watch your progress grow. Your data is stored in your own local database.

![Themes: Dark · Sakura Night · Neon Tokyo · Level Up Hero](https://img.shields.io/badge/themes-Dark%20%C2%B7%20Sakura%20%C2%B7%20Neon%20%C2%B7%20Hero-ff2a6d)
![Runs locally](https://img.shields.io/badge/runs-100%25%20locally-05d9e8)
![License: MIT](https://img.shields.io/badge/license-MIT-green)

## ▶ [Live DEMO — try it in your browser](https://abinash2017.github.io/Roadmap_webapp/)

> [!NOTE]
> **This link is a DEMO.** It runs in your browser with nothing to install, but your progress is saved in that browser only, and multiple profiles, milestones and note history are turned off.
> For the full version (database, multiple profiles, backups), follow the [setup below](#setup-windows).

---

## Features

- **Two roadmaps to choose from**
  - **AI/LLM Engineer**: Python → backend → ML → deep learning → NLP/Transformers → RAG → agents → portfolio.
  - **AI + Full-Stack Backend Developer**: FastAPI, Postgres, async, cloud, then LLM APIs, RAG, agents and evals.
- **Day-by-day plan**: weeks → days → topics you can tick off, with links to docs, videos and practice problems.
- **Calendar dates** based on your start date. Missed days, late days and buffer days are shown automatically.
- **End-of-month checklists**, GitHub project ideas, and resource lists with editable links.
- **Markdown notes** per month with live preview and version history, plus a quick-capture note (`Ctrl+Shift+N`).
- **Daily to-dos** with a calendar, drag-to-reorder, and search.
- **DSA practice track**: ~310 curated interview problems scheduled across the roadmap. The load ramps up gradually, with revision days and a mock-interview week.
- **Anti-"tutorial hell" tools**
  - **Stuck Log**: record what you tried before looking up the answer.
  - **Rebuild Without Notes**: rebuild a project from memory.
  - **Learn vs Build**: track how your time splits between learning and building.
  - **Weekly Solo Challenge**: one project per week, done without help.
- **Multiple profiles**: each one has its own roadmap, progress and notes.
- **Themes**: Dark (with accent colours) plus three animated themes: **Sakura Night**, **Neon Tokyo** and **Level Up Hero**. Each comes with its own completion animations and a personalised startup intro.
- **Works offline-friendly**: all icons and fonts are bundled, no CDN needed.

---

## Requirements

| What | Version / notes |
|---|---|
| **Python** | 3.10 or newer |
| **Microsoft SQL Server** | Any edition. The free **SQL Server Express** or **Developer** edition is fine. |
| **ODBC Driver for SQL Server** | Version 17 or 18 |
| A modern browser | Chrome, Edge or Firefox |

> The setup steps below are written for **Windows**. macOS / Linux users: see [Running on macOS / Linux](#running-on-macos--linux).

---

## Setup (Windows)

### 1. Install SQL Server Express

1. Download **SQL Server Express** from Microsoft's website and run the installer (choose **Basic**).
2. When it finishes, note the **instance name**. It is usually `localhost\SQLEXPRESS`.
3. Install the **ODBC Driver 17 (or 18) for SQL Server** if the installer didn't add it.
4. *(Optional)* Install **SQL Server Management Studio (SSMS)** or **Azure Data Studio** if you prefer a GUI.

### 2. Get the code

```powershell
git clone <this-repo-url> ai-roadmap
cd ai-roadmap
```

Or download the ZIP from GitHub and extract it.

### 3. Create the database

Run the schema script once. It creates the `AIRoadmap` database and all tables, and it's safe to run again.

**Option A: command line** (`sqlcmd` comes with SQL Server):

```powershell
sqlcmd -S localhost\SQLEXPRESS -E -i backend\schema.sql
```

**Option B: SSMS / Azure Data Studio**: connect to your server, open `backend\schema.sql`, and click **Execute**.

### 4. Install the Python dependencies

```powershell
cd backend
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
cd ..
```

### 5. Configure the connection (only if needed)

The app connects to `localhost\SQLEXPRESS` with Windows Authentication and the ODBC Driver 17 by default.
If yours is different, set these environment variables:

| Variable | Default | When to change it |
|---|---|---|
| `DB_SERVER` | `localhost\SQLEXPRESS` | Your server/instance name, e.g. `localhost` or `MYPC\SQLEXPRESS` |
| `DB_NAME` | `AIRoadmap` | Only if you renamed the database in `schema.sql` |
| `DB_DRIVER` | `{ODBC Driver 17 for SQL Server}` | Use `{ODBC Driver 18 for SQL Server}` if you have driver 18 |
| `DB_USER` / `DB_PASSWORD` | *(empty)* | Set both to use SQL Server login instead of Windows Authentication |

Example (saved permanently for your user; open a **new** terminal afterwards):

```powershell
setx DB_SERVER "localhost\SQLEXPRESS"
setx DB_DRIVER "{ODBC Driver 18 for SQL Server}"
```

### 6. Start the app

**Double-click `run.bat`.** It starts the server and opens **http://127.0.0.1:8000** in your browser after a few seconds.

Or start it manually:

```powershell
cd backend
.venv\Scripts\python.exe main.py
```

Then open **http://127.0.0.1:8000**.

> Always open the app through `http://127.0.0.1:8000`. Opening `index.html` directly from the folder will not work.

To stop the server, close its terminal window (or press `Ctrl+C`).

---

## First steps in the app

1. Open **Settings** (bottom of the sidebar).
2. Under **Active Profile Details**, set your **name** and your **start date**. The calendar, current month and DSA schedule are all based on the start date.
3. Choose your **study schedule** and a **theme** you like.
4. *(Optional)* Under **Profiles**, create more profiles, e.g. one per roadmap or one per person.
5. Go to **Overview** or the current month and start ticking topics.

The database icon in the top bar is **green** when your progress is being saved.
If it turns **red**, the app can't reach SQL Server. You can keep working: changes are saved in your browser and uploaded to the database automatically when it reconnects. Resetting progress and managing profiles and milestones need the database online.

---

## Running on macOS / Linux

SQL Server runs on Linux and in Docker, so the app works there too:

1. Start SQL Server in Docker:
   ```bash
   docker run -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD='YourStrong!Passw0rd' -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
   ```
2. Install the **Microsoft ODBC Driver 18 for SQL Server** for your OS (see Microsoft's install guide), plus `unixodbc`.
3. Create the database with `sqlcmd` (or Azure Data Studio):
   ```bash
   sqlcmd -S localhost,1433 -U sa -P 'YourStrong!Passw0rd' -C -i backend/schema.sql
   ```
4. Install dependencies and start the app:
   ```bash
   cd backend
   python3 -m venv .venv
   .venv/bin/pip install -r requirements.txt
   export DB_SERVER="localhost,1433" DB_USER="sa" DB_PASSWORD='YourStrong!Passw0rd' DB_DRIVER="{ODBC Driver 18 for SQL Server}"
   .venv/bin/python main.py
   ```
5. Open **http://127.0.0.1:8000**.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Red database icon / "Server offline" toast | SQL Server isn't running or `DB_SERVER` is wrong. Open **http://127.0.0.1:8000/api/health**: it should say `"database": "connected"`. On Windows, make sure the **SQL Server (SQLEXPRESS)** service is running (`services.msc`). |
| `Data source name not found` / `Can't open lib 'ODBC Driver 17…'` | The ODBC driver isn't installed, or you have a different version. Install it, or set `DB_DRIVER` to the version you have (e.g. 18). |
| `Cannot open database "AIRoadmap"` | You haven't run `backend/schema.sql` yet (step 3). |
| `Login failed for user …` | With Windows Authentication, your Windows user needs access to the server. Otherwise create a SQL login and set `DB_USER` / `DB_PASSWORD`. |
| `run.bat` closes immediately | The virtual environment is missing. Do step 4, then run `run.bat` from a terminal to see the error. |
| Blank page or "module" errors in the browser console | Open the app via `http://127.0.0.1:8000`, not by double-clicking `index.html`. |
| Port 8000 already in use | Change the port at the bottom of `backend/main.py` **and** `API_BASE` in `js/state.js`. |
| Animations feel heavy | Settings → turn off **Background Animation** and **Startup Animation**, or use the Dark theme. |

---

## Your data

- Everything is stored in **your** SQL Server database (`AIRoadmap`), plus a copy in your browser's local storage. Nothing is sent anywhere else.
- **Back up** your progress the same way you back up any SQL Server database (e.g. right-click the database in SSMS → *Tasks → Back Up…*).
- **Settings → Danger Zone → Reset Progress** deletes the active profile's checklists, notes and day-level progress. Your profile and milestones are kept.
- The server only listens on `127.0.0.1` (your own machine) and has **no login**. Don't expose it to the internet.

---

## Customising

- **Roadmap content** (months, weeks, topics, checklists, resources): `js/data.js`
- **Links shown next to topics**: `js/topic-links.js`
- **DSA problem list and order**: `js/dsa-sheet.js`
- **Quotes**: `js/quotes.js`
- **Colours and themes**: `styles.css`

There's no build step. Edit a file and refresh the browser.

> Progress is saved by item position, so if you reorder or insert topics/checklist items in `data.js`, existing ticks will move to different items. Add new items at the end when possible.

---

## Project structure

```
├── index.html          App page
├── styles.css          All styles and themes
├── run.bat             Windows launcher
├── js/                 Frontend (plain JavaScript modules, no build step)
│   ├── data.js         Roadmap content
│   ├── views/          Pages: overview, month, tips, search, settings
│   └── components/     To-dos + calendar, notes editor, link editor
├── backend/
│   ├── main.py         FastAPI server (API + serves the frontend)
│   ├── database.py     SQL Server connection settings
│   ├── schema.sql      Database setup script
│   └── requirements.txt
├── vendor/             Bundled icons, markdown parser and fonts
├── .github/workflows/  GitHub Pages demo deployment
└── postman/            Optional API test collection
```

API documentation is available while the server runs at **http://127.0.0.1:8000/docs**.

---

## Online demo (GitHub Pages)

When the app is opened from any address other than `localhost` / `127.0.0.1`, it runs in **demo mode**: there's no server, and everything is saved in the browser's local storage.

| Works in the demo | Needs the local version |
|---|---|
| Roadmaps (switch in Settings), topics, checklists, calendar | Multiple profiles |
| Notes, to-dos and to-do search, DSA track, Stuck Log, etc. | Custom milestones |
| Themes, intro, all appearance settings, Reset Progress | Note version history, backups |

**Publishing your own demo:**

1. Push the repo to GitHub.
2. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The included workflow (`.github/workflows/pages.yml`) deploys the frontend on every push to `main`. It never uploads the `backend/` folder.
4. Update the demo link at the top of this README to `https://<your-username>.github.io/<repo-name>/`.

To try demo mode locally, open `http://127.0.0.1:8000/?demo`.

---

## License

[MIT](LICENSE). Free to use, modify and share.
