# Lumina Dental - Cinematic Scrollytelling Landing Page

This project is a hyper-premium, cinematic landing page featuring a scroll-based frame animation.

## How to Run Locally

Since this project uses a `<canvas>` element to draw local images, you need to serve the files using a local web server to ensure optimal performance and avoid any potential local file restrictions in certain browsers.

### Option 1: Using Python (Recommended)
If you have Python installed, you can easily start a local server.
1. Open your terminal or command prompt.
2. Navigate to the project directory: `d:\dental website`
3. Run the following command:
   ```bash
   python -m http.server 8000
   ```
4. Open your web browser and go to: [http://localhost:8000](http://localhost:8000)

### Option 2: Using VS Code Live Server Extension
1. Open this project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (by Ritwick Dey) from the extensions marketplace if you haven't already.
3. Right-click on the `index.html` file in the file explorer.
4. Select **"Open with Live Server"**. The website will automatically open in your default browser.

### Option 3: Using Node.js
If you have Node.js installed, you can use `http-server` or `serve`.
1. Open your terminal in the project directory.
2. Run the following command:
   ```bash
   npx http-server
   ```
   *(or `npx serve`)*
3. Open the provided localhost URL in your browser (usually `http://localhost:8080` or `http://localhost:3000`).

## Features
- **GSAP ScrollTrigger:** For smooth scroll-based animations.
- **Canvas Sequence Rendering:** 240 high-resolution frames rendered efficiently via `<canvas>`.
- **Lighting & Micro-interactions:** Cinematic lighting effects and scroll-triggered text reveals.
- **Premium Design:** Minimalist, Apple-inspired interface with responsive typography.
