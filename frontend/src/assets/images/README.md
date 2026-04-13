# Exercise Images Directory

This folder is designed to store all exercise images for the FitPlanner application.

## Naming Convention
To ensure images map correctly to the exercise library, please name your files based on the exercise name as follows:
1. Convert to **lowercase**.
2. Replace **spaces** with **hyphens** (`-`).
3. Remove **parentheses** `(` and `)`.
4. Use the `.jpg` extension.

### Examples:
- "Knee Push-ups" -> `knee-push-ups.jpg`
- "Standard Plank" -> `standard-plank.jpg`
- "Inverted Rows (knees bent)" -> `inverted-rows-knees-bent.jpg`

## Exercise Dataset
The dataset in `src/data/exercisesData.js` is already configured to look for these filenames in this directory. If an image is missing, the system will automatically fall back to a styled placeholder.
