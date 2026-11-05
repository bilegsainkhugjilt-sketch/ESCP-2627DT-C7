import type { Preview } from '@storybook/react-vite';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '../src/styles/tokens.css';
import '../src/styles/app.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    backgrounds: { options: { app: { name: 'App background', value: '#F2F2ED' } } },
    a11y: { test: 'error' },
  },
  initialGlobals: { backgrounds: { value: 'app' } },
};
export default preview;
