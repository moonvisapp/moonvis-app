# Moon Visibility Explorer

**Global Moon Visibility Explorer**

A React-based web application for exploring lunar crescent visibility predictions worldwide using the Odeh criterion.

## Overview

Moon Visibility Explorer calculates and visualizes when the new crescent moon becomes visible at different locations across the globe. It is optimized for accuracy, ease of use, and production deployment.

### Key Features

- **Global Visibility Map**: Interactive world map showing moon visibility zones (Odeh V-criterion) on a **2°×2° grid**.
- **City-Specific Calculations**: Calculate visibility for 70+ major cities worldwide.
- **Lunar Calendar Generator**: Generate 12-month lunar calendars for any location.
- **Shared Night Analysis**: Explore which locations share the same night window with color-coded overlays.
- **High-Contrast Design**: Modern, accessible color palette for clear data visualization.
- **PDF Export**: Export professional lunar calendars with high-resolution visibility maps.

## Tech Stack

- **Frontend**: React 19 + Vite
- **Visualization**: D3.js + HTML5 Canvas (hybrid rendering)
- **Astronomy**: `astronomy-engine` for precise astronomical calculations
- **Deployment**: Docker, Nginx (Production), Vercel/Netlify support

## Getting Started

### Prerequisites

- Docker and Docker Compose
- OR Node.js 20+

### Running with Docker (Recommended)

```bash
docker compose up --build
```
The app will be available at `http://localhost:5173`.

### Production Deployment

To build a production-ready Docker image (using Nginx):

```bash
docker build -f Dockerfile.prod -t moonvis-prod .
docker run -p 8080:80 moonvis-prod
```
See `DEPLOYMENT.md` for full instructions.

***

## How It Works

### Visibility Zones & Colors

The app uses the **Odeh V-criterion** to categorize visibility, visualized with a high-contrast palette:

- **Green (EV)**: Easily Visible (`#4ade80`)
- **Yellow (VP)**: Visible under Perfect conditions (`#facc15`)
- **Red (VO)**: Visible with Optical aid (`#ef4444`)
- **Slate (NV)**: Not Visible (`#94a3b8`)

### Grid System

- **Resolution**: 2° Latitude × 2° Longitude
- **Coverage**: Global (±59° Latitude)

### Lunar Calendar Logic

The calendar finds the first night of each lunar month using two methods:
1.  **Direct Visibility**: Location sees the crescent directly (EV, VP, or VO zones).
2.  **Shared Night Inheritance**: Location shares the night window with a visible zone.

***

## Project Structure

```
moonvis-yo/
├── src/
│   ├── components/       # React components (MoonMap, LunarCalendarModal)
│   ├── utils/            # Core logic (astronomy, pdfExport)
│   ├── workers/          # Web Workers for parallel calculation
│   └── data/             # City coordinates
├── archive/              # Archived debug/test files
├── Dockerfile.prod       # Production container configuration
├── DEPLOYMENT.md         # Deployment guide
└── docker-compose.yml
```

## Usage

### 1. Check Visibility
1.  Select a **Reference Date**.
2.  (Optional) Select a **City**.
3.  Click **Calculate Visibility**.
4.  Hover to see coordinates in **N/S/E/W** format.

### 2. Generate Calendar
1.  Open the **Lunar Calendar**.
2.  Select Start Date and Location.
3.  View the 12-month prediction.
4.  Click the **[View Map]** button for Night 1 details.

### 3. Shared Night Mode
Double-click any grid cell to activate Shared Night Mode:
- **Yellow Borders**: Earlier/Same sunset (East).
- **Cyan Borders**: Later sunset (West).
- **Orange Borders**: Inherited visibility zones.

## Development Notes

- **Production Logs**: Console logs (`log`, `debug`, `info`) are automatically disabled in production builds.
- **Performance**: Heavy calculations are offloaded to Web Workers.

## License

This project is provided as-is for educational and research purposes.

## Acknowledgments

- Powered by [astronomy-engine](https://github.com/cosinekitty/astronomy)
- World map data from [Natural Earth](https://www.naturalearthdata.com/)
