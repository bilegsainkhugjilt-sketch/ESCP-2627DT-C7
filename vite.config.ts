import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VoltLane prototype: local only, no external APIs (NFR-09)
export default defineConfig({
  plugins: [react()],
});
