# Asset manifest

- `crystal-cavern-final.png` — supplied uphill crystal cavern image, retained unchanged.
- `crystal-cavern-360.png` — 360-degree cylindrical environment texture derived by placing the supplied image beside its horizontal mirror. This keeps the supplied cavern as the visual source while allowing the first-person camera to rotate around the scene.
- Other legacy cave reference images are retained for compatibility and future content use.


Final environment mapping note: the scene now uses `crystal-cavern-final.png`, the single-opening source image, on an inward-facing sphere. It is rotated so the central blue opening aligns with the camera's forward (-Z) direction. The mirrored `crystal-cavern-360.png` derivative is retained as an asset but is no longer used by the scene.


Final endless cave background: `crystal-cavern-endless.png` is the locally stored generated first-person tunnel image used by the Three.js environment and WebGL fallback. Forward/backward stage changes keep the cave image fixed (no zoom or background translation); a brief screen-wide fade and restrained camera vibration communicate movement while holograms transition along the side walls.
