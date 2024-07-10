import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import CollectibleMedia from './CollectibleMedia';

export default {
  title: 'Components/UI/CollectibleMedia',
  component: CollectibleMedia,
  argTypes: {
    mediaType: {
      control: {
        type: 'select',
        options: ['image', 'video', 'audio', 'unknown'],
      },
    },
    mediaUrl: { control: 'text' },
    isLoading: { control: 'boolean' },
    error: { control: 'text' },
  },
} as ComponentMeta<typeof CollectibleMedia>;

const Template: ComponentStory<typeof CollectibleMedia> = (args) => <CollectibleMedia {...args} />;

export const Default = Template.bind({});
Default.args = {
  mediaType: 'image',
  mediaUrl: 'https://example.com/sample-image.jpg',
  isLoading: false,
};

export const VideoCollectible = Template.bind({});
VideoCollectible.args = {
  mediaType: 'video',
  mediaUrl: 'https://example.com/sample-video.mp4',
  isLoading: false,
};

export const AudioCollectible = Template.bind({});
AudioCollectible.args = {
  mediaType: 'audio',
  mediaUrl: 'https://example.com/sample-audio.mp3',
  isLoading: false,
};

export const UnknownMediaType = Template.bind({});
UnknownMediaType.args = {
  mediaType: 'unknown',
  mediaUrl: 'https://example.com/unknown-file',
  isLoading: false,
};

export const LoadingState = Template.bind({});
LoadingState.args = {
  mediaType: 'image',
  mediaUrl: 'https://example.com/sample-image.jpg',
  isLoading: true,
};

export const ErrorState = Template.bind({});
ErrorState.args = {
  mediaType: 'image',
  mediaUrl: 'https://example.com/non-existent-image.jpg',
  isLoading: false,
  error: 'Failed to load media',
};