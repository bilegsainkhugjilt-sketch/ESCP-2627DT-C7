import type { StorybookConfig } from '@storybook/react-vite';

// Design system / component library (design.md §4). The a11y add-on checks contrast and labels per story.
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true },
};
export default config;
