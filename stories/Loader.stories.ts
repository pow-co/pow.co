import type { Meta, StoryObj } from '@storybook/react';
import Loader from '../components/Loader';

const meta: Meta<typeof Loader> = {
  title: 'Loader',
  component: Loader,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Primary: Story = {};
