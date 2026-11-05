import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VoltLane prototype: local only, no external APIs (NFR-09)
export default defineConfig({
  // relative paths, so the build also works when hosted in a sub-folder or as an artifact
  base: './',
  plugins: [react()],
  // 3D truck models (Kenney, CC0) are bundled as assets and inlined with ?inline
  assetsInclude: ['**/*.glb'],
});
