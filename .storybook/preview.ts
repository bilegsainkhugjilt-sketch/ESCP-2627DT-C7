import type { Preview } from '@storybook/react-vite';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow-semi-condensed/500.css';
import '@fontsource/barlow-semi-condensed/600.css';
import '@fontsource/barlow-semi-condensed/700.css';
import '../src/styles/tokens.css';
import '../src/styles/app.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    backgrounds: { options: { app: { name: 'App background', value: '#EDEFF1' } } },
    a11y: { test: 'error' },
  },
  initialGlobals: { backgrounds: { value: 'app' } },
};
export default preview;
