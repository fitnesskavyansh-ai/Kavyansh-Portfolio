# MY WORLD // THE GEOGRAPHIC ARCHIVE GUIDE
## KAVYANSH SAXENA PORTFOLIO

This guide explains how to manage your personal travel gallery ("MY WORLD") and synchronise your assets with the portfolio.

---

### 1. DIRECTORY STRUCTURE

The portfolio is designed to automatically discover images placed in the following structure under `public/assets/my-world/`:

```text
public/assets/my-world/
  ├── india/
  │   ├── uttar-pradesh/
  │   │   ├── mathura/
  │   │   │   ├── cover.jpg (Optional: Main card image)
  │   │   │   └── photo1.jpg, photo2.jpg...
  │   │   └── noida/
  │   ├── delhi/
  │   └── gurugram/
  └── other-cities/
```

### 2. ADDING A NEW LOCATION

1.  **Create Folders**: Create the nested folders for the Country, State (if applicable), and City.
2.  **Add Photos**: Drop your high-resolution photographs into the city folder.
3.  **Run Sync**: Open your terminal and run:
    ```bash
    npm run assets:sync
    ```
    This script will scan the folders and update `src/data/my-world.json` with the new file paths.

### 3. UPDATING METADATA

After running the sync script, you may want to add custom captions, dates, or coordinates.
1.  Open `src/data/my-world.json`.
2.  Find the entry for your new city.
3.  Update the fields:
    - `caption`: A personal tagline for the trip.
    - `description`: A detailed story or memory.
    - `date`: Month/Year of visit.
    - `coordinates`: [Latitude, Longitude] for the strategic map simulation.
    - `category`: e.g., "Personal", "Business", "Event".

### 4. THE COMMAND CENTER

The portfolio includes a hidden "Command Center" at the bottom of the page.
- **Access**: Click the tiny "Access Command Center" text at the very bottom.
- **Function**: View the current state of your JSON databases and copy them easily if you need to back up or edit them externally.

---
*Verified by System Architect // Kavyansh Saxena*
