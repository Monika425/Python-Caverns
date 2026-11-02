# THE PYTHON CAVERNS

An immersive, client-side academic portfolio for Advanced Python Programming, built with Next.js, TypeScript, Tailwind CSS and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build for deployment

```bash
npm run build
npm start
```

The project is compatible with Vercel's standard Next.js deployment flow. No backend, database, authentication or CMS is required.

## Populate the portfolio

Edit `src/data/portfolio.ts`:

- Update the `profile` object with student and course details.
- Edit the `activities` array to update the ten chambers.
- Add media files under `public/assets/` and set each media item's `src` to `/assets/filename.ext`.
- Add custom `stages` to any activity to control its own progressive left/right exploration cards. Each stage supports `name`, `left` and `right` arrays. Cards support `text`, `image`, `document` and `video` kinds.
- If `stages` is omitted, four sensible stages are assembled from the existing activity fields and media slots.

## Controls

- Left click on the cave background: move forward.
- Right click on the cave background: move backward.
- W / Arrow Up: move forward.
- S / Arrow Down: move backward.
- A / Arrow Left: look left.
- D / Arrow Right: look right.
- Mouse movement: subtle camera look / parallax.
- Touch swipe: move forward or backward.
- Escape: close Field Notes and the chamber menu.

The immersive environment uses CSS 3D perspective, layered cave geometry, animated particles and perspective-positioned information cards. It does not require WebGL and therefore has a graceful, lightweight fallback across devices.

## Minecart expedition update

The immersive view now uses a first-person mine-railway composition built with layered CSS 3D perspective: a converging track bed, two metal rails, moving sleepers, a rocky floor, enclosing cave walls and ceiling, a cart nose in the foreground, and a persistent distant light. Stage changes animate the railway and tunnel surfaces while the wall-mounted exhibit frames recede and new content appears.

### Controls

- **Next / Move Deeper:** travel to the next stage; at the end of a chamber, enter the next chamber.
- **Previous:** travel back to the previous stage or chamber.
- **Left click on the cave environment:** move forward.
- **Right click on the cave environment:** move backward (the browser context menu is suppressed inside the experience).
- **W / Arrow Up:** move forward.
- **S / Arrow Down:** move backward.
- **A / Arrow Left** and **D / Arrow Right:** turn the view.
- **Escape:** close Field Notes or the chamber selector.
- **Field Notes:** opens a compact scrollable drawer without resetting the current position.

The existing ten activity records and their media/text placeholders remain in `src/data/portfolio.ts`. The minecart scene is a lightweight CSS 3D perspective implementation; it does not require a WebGL runtime or additional 3D packages.

### Run locally

```bash
npm install
npm run dev
```

For deployment, run `npm run build` before publishing to Vercel.

### Interactive control audit

- Global **Home**, **Explore**, and **Visualize** navigation switches views; switching between Explore and Visualize retains the selected activity and stage.
- Journey **Exit** returns to the landing page.
- **Field Notes** opens the compact drawer; its close button and Escape close it without changing the selected activity or stage.
- **Chamber** opens the activity selector; selecting an item jumps to that chamber's first stage. Escape closes the selector.
- Stage progress markers navigate to their corresponding stage.
- **Previous** and **Move Deeper / Next Chamber** navigate the stage sequence and are locked during transitions to prevent duplicate input.
- Clicking the cave environment advances; right-clicking moves backward.
- Keyboard and swipe navigation provide alternatives to the visible controls.
- Image placeholders open an instructions modal; the modal backdrop, close control and Got It button dismiss it.
- Explore-mode activity entries and previous/next activity controls navigate the portfolio.

## Minecart v5 visual refinements

This revision refines the existing immersive journey without changing the portfolio data model:

- Cave walls and ceiling use layered geological shading, irregular silhouettes, rock relief and shadowing.
- The railway is narrowed and kept in the centre, with rocky floor space around it.
- Wall exhibits are larger and use Z-axis rotation for their visible tilt.
- Stage transitions animate old exhibits forward and outward while new exhibits emerge from depth at the same time.
- A first-person wooden cart rim and stylized gripping hands are layered into the foreground.

The cave remains a CSS 3D/perspective environment rather than a physically simulated 3D scene. The first-person hands are vector artwork, not a scanned or rigged 3D hand model.

## Minecart v6 visual refinement

- The immersive cave now uses the supplied natural cave-tunnel reference as its photographic environment, with the supplied cave-chamber reference blended subtly into the upper rock texture.
- The previous polygonal CSS wall, ceiling, floor and decorative rock silhouettes are hidden in immersive mode so they do not compete with the photographic cave surfaces.
- Information exhibits are equal-sized translucent holographic projections with fine cyan edges, subtle scan lines and restrained floating motion instead of thick metallic picture frames.
- The railway, cart, navigation, activity data and stage controls are retained.

The two supplied cave references are stored locally in `public/assets/` so the immersive environment does not depend on external image URLs.

### Final cave and minecart adjustment

The immersive chamber now uses `public/assets/cavern-expedition-bg.jpg` as its primary cave environment. The central railway has been narrowed and pushed visually onto the cave floor; the first-person cart rim and hands have been reduced so the side holograms retain clear space. The background is bundled locally and does not require external image hosting.


## Final first-person cavern edition

The immersive view now uses `public/assets/crystal-cavern-final.png` as its local full-screen environment. Railway, minecart, cart rim and hand elements are removed from the experience. Navigation is first-person look-and-move with layered holographic exhibits on both sides, faint distant exhibits, camera parallax, forward running feedback and reduced-motion support. The existing ten-chamber portfolio data and Explore/Field Notes flows remain in place.


## Final 3D cavern build

The immersive experience now uses Three.js directly (not a CSS-only camera simulation). `src/components/CavernScene.tsx` owns the WebGL renderer, perspective camera, 360-degree cave cylinder, spatial hologram meshes, distant exhibits, particles and movement transitions. The chamber HUD remains a separate accessible HTML layer.

The supplied uphill cave artwork is retained as `public/assets/crystal-cavern-final.png`. A mirrored 360-degree environment texture is generated from that artwork at `public/assets/crystal-cavern-360.png`, allowing the camera to turn without exposing empty edges. The original image remains in the assets folder.

Install and run:

```bash
npm install
npm run dev
```

For a production check:

```bash
npm run build
```

If WebGL is unavailable, the scene displays a local image fallback. Portfolio text and exhibit content remain editable in `src/data/portfolio.ts`.


## Latest immersion refinements

- Forward/backward stage movement now uses a single restrained whole-scene push-in and return, paired with a brief screen-wide fade. The cave panorama itself remains static and is not independently zoomed.
- Faint, translucent hologram silhouettes are distributed at multiple depths along both cave walls to suggest a queue of upcoming exhibits.
- Pressing `Escape` in Visualize mode exits to the landing page. The current chamber and stage remain in application state if the user re-enters the journey.


## Final movement refinement

- Removed the extra 16 decorative queue holograms. The stage's existing primary and distant exhibits remain.
- Reworked stage changes into one coordinated 1.55-second eased transition: incoming exhibits emerge from their side-wall depth while outgoing exhibits pass outward and fade together.
- Removed the full-page zoom/fade pulse that made the transition feel abrupt.
- Added a restrained first-person running sensation through a short eased camera lunge, soft vertical footfall bob and tiny lateral sway. The cave background stays fixed; no railway or minecart UI is present.
- The movement lock now matches the exhibit transition duration.


## Populated course portfolio

The supplied `PYTHON_CAVERNS_CONTENT.zip` has been integrated into the portfolio. Student details, all ten activity summaries, learning outcomes, tools/concepts, screenshots, diagrams, and supplied supporting files are included. The `Field Notes` and `Explore` views show the expanded activity descriptions and attachments.

### Included activity assets

- Activities 1–6: classroom participation photo, storyboard, LinguaConnect prototype screens, NeuroSense architecture, quiz photos, and Medium article screenshot.
- Activity 7: Encrypted Diary business-thesis cover, presentation audio, and transcript PDF.
- Activity 8: Encrypted Diary presentation slide previews and complete PDF.
- Activity 9: Google Drive demonstration link.
- Activity 10: assignment cover and complete PDF containing the six LeetCode/OOP questions and additional multithreading work.

The cave progression remains mapped from chamber 1 through chamber 10. Images and documents are stored locally in `public/assets/activities/` so the project does not depend on the original upload ZIP at runtime.
