# Lunar Calculation Methodology in Moonvis App

This document outlines the exact methodology used in the `moonvis-app` to calculate the start of the lunar month and determine lunar visibility. This logic can be used to replicate the exact same calculations in a React Native app or other environments.

## Core Dependencies
The application relies heavily on the `astronomy-engine` library for all foundational astronomical calculations. You will need this library in your React Native app.
- GitHub: https://github.com/cosinekitty/astronomy
- NPM: `npm install astronomy-engine`

---

## High-Level Execution Flow (`calculateLunarCalendar`)

To determine the current lunar date for a user, the application follows a two-pass chronological stepping algorithm. It does **not** rely on visual UI simulation, but rather a math-based chronological search.

### Pass 1: Find the "Night 1" of each Lunar Month
1. **Find Previous Conjunction**: Given a starting Gregorian date, the algorithm finds the *previous* geocentric new moon conjunction (`getPrevNewMoonConjunction`). This ensures we start searching from the beginning of the lunar month that contains the user's date.
2. **Search for Night 1**: Starting from the conjunction date, the algorithm steps forward day by day (at `00:00:00 UTC`), up to a maximum of 35 days, checking visibility.
3. **Visibility Check Order (Per Day)**:
   For each day checked, it tests:
   - **Check 1: Direct Visibility**. Is the moon directly visible from the user's specific latitude and longitude on this evening?
   - **Check 2: Shared Night Visibility**. If not directly visible, is there *anywhere* else in the world where the moon is directly visible, AND does that location's night overlap with the user's night? (Inherited visibility).
4. **Determine Month Start**: The *first* day that satisfies either Check 1 or Check 2 becomes "Night 1" of the new lunar month.

### Pass 2: Generate Calendar Days
Once "Night 1" is found, the algorithm simply increments the day by 1 to generate Night 2, Night 3, etc., until it reaches the "Night 1" of the *next* lunar month (which is calculated by repeating Pass 1 for the next conjunction).

---

## Mathematical Details & Algorithms

### 1. Direct Visibility (The Odeh Criterion)
The app uses the Mohammed Odeh (2006) criterion. Here is the exact calculation flow for a given date and location (`lat`, `lon`):

1. **Normalize Longitude & Timezone**:
   - Longitude is normalized to `[-180, +180)`.
   - The local timezone offset is calculated strictly by longitude: `tzHours = Math.sign(lon) * Math.round(Math.abs(lon) / 15)`.

2. **Find Sunset & Moonset**:
   - The test date (UTC midnight) is converted to local midnight using `tzHours`.
   - `astronomy-engine` is used to find the next **Sunset** starting from local noon.
   - `astronomy-engine` is used to find the next **Moonset** that occurs *after* the calculated sunset.
   - **Lag** is calculated: `Lag = Moonset - Sunset` (in minutes).
   - *Impossible Condition 1*: If Lag <= 0 (moon sets before or with the sun), visibility is impossible (`NV`/`I`).

3. **Check Conjunction Rule**:
   - *Impossible Condition 2*: If the exact geocentric conjunction time occurs *after* the local sunset but before the next sunrise, the moon is born during the night and is invisible that evening (`NV`/`I`).

4. **Calculate Best Time for Observation (Tb)**:
   - `Tb = Sunset + (4/9) * Lag`

5. **Calculate Topocentric Positions**:
   - At time `Tb`, calculate the topocentric Altitude of the Moon and Sun.
   - **CRITICAL**: These altitudes must be calculated *WITHOUT* atmospheric refraction (airless).
   - `ARCV = Moon Altitude - Sun Altitude` (in degrees).

6. **Calculate Crescent Width (W)**:
   - Calculate Geocentric Elongation (`arcl` in degrees).
   - Calculate the Topocentric distance to the moon in Astronomical Units (AU).
   - Calculate the semi-diameter of the moon (`sdMoon`) in arcminutes.
   - `W = sdMoon * (1 - Math.cos(arcl * Math.PI / 180))` (in arcminutes).

7. **The Odeh Formula (V)**:
   - Calculate the Odeh Limit: `limit = -0.1018*W³ + 0.7319*W² - 6.3226*W + 7.1651`
   - Calculate V-value: `V = ARCV - limit`

8. **Visibility Classification**:
   - `V >= 5.65` : Easily Visible (`EV`) -> **Directly Visible = True**
   - `V >= 2.0` : Visible Under Perfect Conditions (`VP`) -> **Directly Visible = True**
   - `V >= -0.96` : Visible With Optical Aid (`VO`) -> **Directly Visible = True**
   - `V < -0.96` : Not Visible (`NV`) -> **Directly Visible = False**

### 2. Shared Night Visibility (Inheritance)
If the moon is not directly visible at the user's location, the app checks if it inherits visibility from another location.

1. **Calculate User's Night Window**:
   - **Night Start**: The user's Sunset time.
   - **Night End**: Morning Astronomical Twilight (when the sun reaches -18° altitude ascending before sunrise). If twilight doesn't occur (e.g., polar summer), Sunrise is used.

2. **Scan the Globe**:
   - The app scans latitudes from `-59°` to `+59°` (step 2°) and longitudes from `-179°` to `+179°` (step 2°).
   - *Note: In React Native, scanning the entire globe iteratively might block the JS thread. You may need to optimize this grid step size, use Web Workers, or run it asynchronously via `InteractionManager` or `setTimeout` chunks.*

3. **Check Overlap for Each Cell**:
   - For every cell on the globe, calculate its Night Window (Sunset to Astronomical Twilight).
   - Calculate overlap with the user's night window:
     - `Overlap Start = Math.max(User Night Start, Cell Night Start)`
     - `Overlap End = Math.min(User Night End, Cell Night End)`
   - If `Overlap Start < Overlap End`, the two locations "Share the Night".

4. **Verify Inheritance**:
   - If a cell shares the night with the user, the app runs the **Direct Visibility (Odeh Criterion)** on that cell.
   - If the cell's result is `EV`, `VP`, or `VO`, the user **inherits** that visibility.
   - The Shared Night Visibility check returns `True`, and the search stops.

---

## How to use this to return the current Lunar Date in React Native

To build a function `getCurrentLunarDate(userDate, lat, lon)` in React Native:

1. **Calculate the Month's Start**: Pass `userDate` and location into the Pass 1 algorithm (`calculateLunarCalendar` logic).
   - Find the previous conjunction relative to `userDate`.
   - Run the loop (checking Direct then Shared night) to find the "Night 1" Date.
2. **Calculate the Offset**: Once you have the `Night 1` Date, the current lunar date is simply the difference in days:
   - `Lunar Day = Floor( (userDate.getTime() - Night1Date.getTime()) / (1000 * 60 * 60 * 24) ) + 1`
3. **Handle Month Boundaries**:
   - If the `userDate` is equal to or greater than the "Night 1" of the *next* conjunction, it means the new lunar month has started, and you should use that next "Night 1" as your baseline instead.
4. **Performance Consideration**:
   - The global grid scan for Shared Night is computationally heavy. In `moonvis-app`, this is parallelized using Web Workers (`mapCalculation.worker.js`). In React Native, Web Workers are not natively supported out-of-the-box in the same way. You will either need to:
     a) Use a native threading library (like `react-native-threads`).
     b) Chunk the loop using `setImmediate` or `requestAnimationFrame` to avoid freezing the UI.
     c) Reduce the grid resolution (e.g., step 5° instead of 2°).
