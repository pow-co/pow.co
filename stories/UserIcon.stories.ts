import type { Meta, StoryObj } from '@storybook/react';
import UserIcon from '../components/UserIcon';

// Define some sample props to use in the stories
const props = {
  size: 36,
  src: 'https://i.pravatar.cc/',
};

// Define the metadata for the UserIcon component
const meta: Meta<typeof UserIcon> = {
  title: 'UserIcon',
  component: UserIcon,
  argTypes: {
    size: { control: 'number' },
    src: { control: 'text' },
  },
};

export default meta;

// Create a Storybook story for the UserIcon component
type Story = StoryObj<typeof UserIcon>;

export const Small: Story = {
  args: {
    size: props.size,
    src: `${props.src}/${props.size}`,
  },
};

export const Large: Story = {
  args: {
    size: 100,
    src: `${props.src}/${100}`,
  },
};

export const NoImgSrc: Story = {
  args: {
    size: props.size,
    src: '',
  },
};
