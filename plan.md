# React Developer Dashboard — Implementation Plan

## 1. Project Overview

Build a **single-page React dashboard** that gives a developer one place to:

- Track GitHub activity and profile statistics
- Manage personal tasks locally
- View current weather and a short forecast for their city
- Refresh external data without a backend
- Work entirely with free public APIs and browser storage

### Core constraint

**No custom backend.** All external data comes directly from public APIs. Task data is stored in the browser with `localStorage`.

---

## 2. Recommended Tech Stack

- **React** — UI and component architecture
- **Vite** — development/build tooling
- **JavaScript** — implementation language
- **CSS** — responsive styling
- **React Icons** — icons
- **Fetch API** — HTTP requests
- **localStorage** — persistent task storage
- **GitHub REST API** — GitHub data
- **Open-Meteo API** — weather data
- **Open-Meteo Geocoding API** — city-to-coordinate lookup

> API keys are intentionally avoided. This keeps the project simple and makes local setup easier.

---

## 3. Public APIs

### GitHub REST API

Use GitHub's public REST API for:

- User profile information
- Public repository count
- Followers/following
- Repository activity
- Recent public events

Example endpoints:

```text
https://api.github.com/users/{username}
https://api.github.com/users/{username}/repos
https://api.github.com/users/{username}/events/public
```

The dashboard should accept a GitHub username from the user rather than hard-coding one.

### Open-Meteo Geocoding API

Use it to convert a city name into latitude/longitude:

```text
https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1
```

### Open-Meteo Weather API

Use the returned coordinates to request current weather and a short forecast:

```text
https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto
```

---

# 4. Dashboard Layout

Create a responsive single-page layout.

```text
-------------------------------------------------------
| Sidebar / Navigation          | Main Dashboard       |
|                               |                     |
|  Developer Dashboard          | Welcome / Header    |
|  Overview                     |                     |
|  GitHub                       | ------------------  |
|  Tasks                        | GitHub Stats       |
|  Weather                      | ------------------  |
|                               | Recent Activity    |
|                               | ------------------  |
|                               | Tasks | Weather   |
-------------------------------------------------------
```

### Desktop

Use a two-column structure:

- Fixed/narrow sidebar
- Flexible main content area

### Mobile

Collapse the sidebar/navigation into a top navigation or hamburger menu.

Avoid horizontal overflow.

---

# 5. Component Architecture

Recommended structure:

```text
src/
├── components/
│   ├── Layout/
│   │   ├── Layout.jsx
│   │   └── Layout.css
│   │
│   ├── Sidebar/
│   │   ├── Sidebar.jsx
│   │   └── Sidebar.css
│   │
│   ├── Header/
│   │   ├── Header.jsx
│   │   └── Header.css
│   │
│   ├── Github/
│   │   ├── GithubSection.jsx
│   │   ├── GithubStats.jsx
│   │   ├── GithubActivity.jsx
│   │   └── Github.css
│   │
│   ├── Tasks/
│   │   ├── TaskSection.jsx
│   │   ├── TaskForm.jsx
│   │   ├── TaskList.jsx
│   │   ├── TaskItem.jsx
│   │   └── Tasks.css
│   │
│   ├── Weather/
│   │   ├── WeatherWidget.jsx
│   │   └── Weather.css
│   │
│   ├── UI/
│   │   ├── Card.jsx
│   │   ├── Loading.jsx
│   │   ├── ErrorMessage.jsx
│   │   └── EmptyState.jsx
│   │
│   └── Dashboard/
│       ├── Dashboard.jsx
│       └── Dashboard.css
│
├── services/
│   ├── githubApi.js
│   ├── weatherApi.js
│   └── geocodingApi.js
│
├── utils/
│   ├── weatherCodes.js
│   └── storage.js
│
├── App.jsx
├── main.jsx
└── index.css
```

---

# 6. Main Features

## A. GitHub Activity Tracker

### User input

Provide a small form where the developer enters their GitHub username.

Use a real `<form>`:

```jsx
<form onSubmit={handleSubmit}>
  <input
    type="text"
    value={username}
    onChange={handleChange}
    placeholder="Enter GitHub username"
  />

  <button type="submit">
    Track
  </button>
</form>
```

### GitHub profile card

Display:

- Avatar
- Username
- Name
- Bio
- Public repositories
- Followers
- Following
- Profile link

### Repository/activity information

Display:

- Recent public activity
- Event type
- Repository name
- Event date
- Basic event description

Possible event types:

- PushEvent
- CreateEvent
- IssuesEvent
- PullRequestEvent
- WatchEvent

Keep the first version simple. Do not attempt to reproduce GitHub's entire activity feed.

### GitHub states

Handle:

```text
Loading
Success
Empty
User not found
Rate limited
Network error
```

---

# 7. Personal Task Manager

Tasks are local because there is no backend.

### Task model

```js
{
  id: 1,
  title: "Build GitHub dashboard",
  completed: false,
  createdAt: "2026-09-18T..."
}
```

### Features

The user should be able to:

- Add a task
- Mark a task complete
- Unmark a task
- Delete a task
- View total tasks
- View completed tasks
- View remaining tasks
- Filter tasks

Recommended filters:

```text
All | Active | Completed
```

### Task form

Use a `<form>`:

```jsx
<form onSubmit={handleSubmit}>
  <input
    type="text"
    value={task}
    onChange={handleChange}
    placeholder="Add a task..."
  />

  <button type="submit">
    Add task
  </button>
</form>
```

### Persistence

Save tasks to `localStorage`.

Flow:

```text
Component loads
      ↓
Read tasks from localStorage
      ↓
Set tasks in React state
      ↓
User adds/edits/deletes task
      ↓
React state changes
      ↓
Save updated tasks to localStorage
```

---

# 8. Live Weather Widget

The weather widget should allow the user to enter a city.

### Flow

```text
User enters city
       ↓
Geocoding API
       ↓
Latitude + longitude
       ↓
Weather API
       ↓
Current weather + forecast
       ↓
Render WeatherWidget
```

### Display

Current conditions:

- City
- Temperature
- Weather description
- Humidity
- Wind speed

Forecast:

- Day
- Weather condition
- High temperature
- Low temperature

### Weather code mapping

Create a utility such as:

```js
const weatherCodes = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  // ...
};
```

Map API weather codes to human-readable descriptions and suitable icons.

### Weather states

Handle:

```text
Loading
Success
City not found
Network error
```

Do not make the whole dashboard fail when weather data cannot be loaded.

---

# 9. React State Design

Keep state close to the feature that owns it.

## App-level state

Only keep shared dashboard state in `App` when multiple components genuinely need it.

Potential shared state:

```js
const [githubUsername, setGithubUsername] = useState("");
```

Most feature state should remain local.

## GitHub state

```js
const [profile, setProfile] = useState(null);
const [events, setEvents] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");
```

## Task state

```js
const [tasks, setTasks] = useState([]);
const [filter, setFilter] = useState("all");
```

## Weather state

```js
const [city, setCity] = useState("");
const [weather, setWeather] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");
```

---

# 10. useEffect Strategy

Use `useEffect` for data that should be fetched when a dependency changes.

Example:

```jsx
useEffect(() => {
  if (!username) return;

  async function fetchGithubData() {
    // fetch data
  }

  fetchGithubData();
}, [username]);
```

For tasks, use an effect to persist changes:

```jsx
useEffect(() => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}, [tasks]);
```

Avoid unnecessary effects. If something can be calculated directly from existing state, calculate it rather than creating another effect.

---

# 11. API Service Layer

Do not put every `fetch()` call directly inside JSX components.

Create service functions.

### `githubApi.js`

```js
export async function getGithubUser(username) {
  const response = await fetch(
    `https://api.github.com/users/${username}`
  );

  if (!response.ok) {
    throw new Error("GitHub user could not be found.");
  }

  return response.json();
}
```

Create similar functions for events and repositories.

### `weatherApi.js`

Create a function that receives coordinates and returns weather data.

### `geocodingApi.js`

Create a function that receives a city name and returns coordinates.

This keeps components focused on UI and state.

---

# 12. Error Handling

Every external request should account for failure.

Use:

```js
try {
  // request
} catch (error) {
  setError(error.message);
} finally {
  setIsLoading(false);
}
```

Also check:

```js
if (!response.ok) {
  throw new Error("Something went wrong.");
}
```

### User-friendly errors

Avoid displaying raw technical errors.

Instead:

```text
GitHub user not found.
```

rather than:

```text
TypeError: Failed to fetch
```

---

# 13. Loading UI

Every API-driven section needs a visible loading state.

Examples:

```text
Loading GitHub profile...
Loading activity...
Loading weather...
```

For a polished version, replace text with skeleton cards.

Start with simple loading text and add skeletons later.

---

# 14. Data Fetching Strategy

Do not make unnecessary API requests.

### GitHub

When the username changes/submits:

```text
GET /users/{username}
GET /users/{username}/events/public
```

Only fetch repositories if the UI actually needs repository data.

### Weather

When the city is submitted:

```text
GET geocoding API
        ↓
GET weather API
```

Do not continuously request weather every few seconds.

"Live weather" means the widget displays current data from the weather API; it does not require aggressive polling.

Add a manual refresh button if desired.

---

# 15. localStorage Strategy

Create utility functions:

```js
export function getTasks() {
  const storedTasks = localStorage.getItem("tasks");

  return storedTasks ? JSON.parse(storedTasks) : [];
}

export function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
```

Initialize state from storage:

```js
const [tasks, setTasks] = useState(getTasks);
```

This allows tasks to survive a page refresh.

---

# 16. Responsive Design

Use a mobile-first approach.

### Mobile

```text
Header
GitHub Stats
GitHub Activity
Weather
Tasks
```

### Tablet

Use a two-column card layout where appropriate.

### Desktop

Use:

```text
Sidebar | Main content
        |
        | GitHub Stats
        |
        | Activity | Weather
        |
        | Tasks
```

Use CSS Grid for the dashboard layout and Flexbox for smaller component layouts.

---

# 17. Accessibility

Make accessibility part of the implementation rather than a final step.

Requirements:

- Use semantic HTML
- Every input needs a label
- Buttons need meaningful text or accessible labels
- Images need useful `alt` text
- Keyboard navigation must work
- Visible focus states
- Do not rely only on color to communicate task status
- Use appropriate heading hierarchy
- Ensure sufficient text/background contrast

Example:

```jsx
<label htmlFor="github-username">
  GitHub username
</label>

<input
  id="github-username"
  type="text"
/>
```

---

# 18. Dashboard UX

The dashboard should answer three questions quickly:

### 1. What is happening with my GitHub?

Show:

- Profile
- Repository count
- Followers
- Recent activity

### 2. What do I need to do?

Show:

- Remaining tasks
- Completed tasks
- Task list
- Add-task form

### 3. What is the weather?

Show:

- Current temperature
- Current conditions
- Humidity/wind
- Short forecast

Keep cards visually distinct but consistent.

---

# 19. Suggested Build Order

Build the project in small milestones rather than implementing everything at once.

## Phase 1 — Project setup

- Create Vite React project
- Remove starter Vite UI
- Create folders
- Create base CSS
- Create `App.jsx`
- Build basic dashboard shell

**Goal:** Empty dashboard layout works.

---

## Phase 2 — Dashboard layout

Build:

- Sidebar
- Header
- Main content
- Responsive cards

Use mock data initially.

**Goal:** The dashboard looks complete before APIs are added.

---

## Phase 3 — Task manager

Implement:

- Task form
- Add task
- Task list
- Complete/uncomplete
- Delete
- Filters
- localStorage

**Goal:** Tasks work without an internet connection.

---

## Phase 4 — GitHub integration

Implement:

1. Username form
2. Profile request
3. Profile card
4. Activity request
5. Activity list
6. Loading state
7. Error handling

**Goal:** Entering a username displays real GitHub information.

---

## Phase 5 — Weather integration

Implement:

1. City form
2. Geocoding request
3. Coordinate extraction
4. Weather request
5. Current weather card
6. Forecast
7. Loading/error states

**Goal:** Entering a city displays real weather information.

---

## Phase 6 — Integration

Connect all sections into the dashboard.

Check:

- API errors don't break other sections
- Loading states are independent
- Tasks remain after refresh
- Forms work with Enter
- Data is displayed consistently

---

## Phase 7 — Polish

Add:

- Icons
- Better empty states
- Skeleton loading
- Animations
- Responsive refinements
- Better spacing
- Hover/focus states
- Date formatting
- Weather icons
- GitHub event icons

Do this after functionality works.

---

# 20. Suggested User Flow

```text
Open dashboard
      ↓
Dashboard loads
      ↓
User enters GitHub username
      ↓
GitHub profile + activity appears
      ↓
User enters city
      ↓
Current weather + forecast appears
      ↓
User adds personal tasks
      ↓
Tasks are saved to localStorage
      ↓
User returns later
      ↓
Tasks are still available
```

---

# 21. Important API Considerations

### GitHub rate limits

GitHub's unauthenticated API has rate limits.

Therefore:

- Do not poll GitHub continuously
- Fetch only when needed
- Show a useful rate-limit error
- Consider caching recent results in memory if the app makes repeated requests

Do not build the project around the assumption that unlimited requests are available.

### Weather API

Open-Meteo can be used without requiring an API key for typical non-commercial usage. Check the current provider terms before deploying a production application.

### CORS

The application should call APIs from the browser only when the selected endpoint permits browser requests.

---

# 22. Performance Considerations

Avoid premature optimization.

Start with:

- Small components
- Minimal API calls
- No unnecessary effects
- Proper conditional rendering
- Optimized images
- No giant dependency list

Only introduce memoization such as `useMemo` or `useCallback` when there is an actual performance reason.

---

# 23. Testing Checklist

### GitHub

- [ ] Valid username works
- [ ] Invalid username shows an error
- [ ] Empty username is handled
- [ ] Loading state appears
- [ ] Activity renders correctly
- [ ] GitHub API failure doesn't break tasks/weather

### Tasks

- [ ] Add task
- [ ] Prevent empty task
- [ ] Complete task
- [ ] Uncomplete task
- [ ] Delete task
- [ ] Filter tasks
- [ ] Tasks survive refresh

### Weather

- [ ] Valid city works
- [ ] Invalid city shows an error
- [ ] Loading state appears
- [ ] Current weather renders
- [ ] Forecast renders
- [ ] Weather failure doesn't break GitHub/tasks

### Responsive

- [ ] Mobile layout works
- [ ] Tablet layout works
- [ ] Desktop layout works
- [ ] No horizontal scrolling
- [ ] Forms work on mobile

---

# 24. Definition of Done

The project is complete when:

- [ ] Dashboard is a single-page React application
- [ ] GitHub username can be entered dynamically
- [ ] Real GitHub profile data is displayed
- [ ] Recent GitHub activity is displayed
- [ ] Users can create and manage tasks
- [ ] Tasks persist through browser refreshes
- [ ] Users can search for a city
- [ ] Current weather is displayed
- [ ] A short weather forecast is displayed
- [ ] All external data comes from free public APIs
- [ ] No custom backend is required
- [ ] Loading and error states exist
- [ ] Layout works on mobile, tablet, and desktop
- [ ] Forms and controls are keyboard accessible
- [ ] The code is divided into reusable React components
- [ ] API logic is separated from UI components

---

# 25. Optional Version 2 Features

Only add these after the core dashboard works.

### GitHub

- Repository cards
- Contribution-style activity visualization
- Language statistics
- Repository search
- GitHub streak visualization

### Tasks

- Due dates
- Priority
- Categories
- Drag-and-drop ordering
- Search
- Dark mode

### Weather

- 7-day forecast
- Temperature unit toggle
- Saved cities
- Weather alerts where supported

### Dashboard

- Customizable widgets
- Drag-and-drop dashboard cards
- Theme switcher
- Persisted dashboard preferences

---

# 26. Final Architecture

The final data flow should look like this:

```text
                       ┌─────────────────┐
                       │   React App     │
                       └────────┬────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
        ┌──────────┐      ┌──────────┐      ┌──────────┐
        │  GitHub  │      │  Tasks   │      │ Weather  │
        └────┬─────┘      └────┬─────┘      └────┬─────┘
             │                 │                 │
             ▼                 ▼                 ▼
       GitHub API          localStorage     Geocoding API
                                                 │
                                                 ▼
                                           Weather API
```

The key architectural principle is:

> **React manages the UI and state; public APIs provide external data; localStorage provides local task persistence; no custom backend is necessary.**

This project should be built incrementally. Get the UI working with mock data first, then connect one data source at a time. That approach makes debugging much easier and gives you a working project at every stage.
