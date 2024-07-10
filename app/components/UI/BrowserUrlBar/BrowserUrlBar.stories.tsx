import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import BrowserUrlBar from './BrowserUrlBar';

export default {
  title: 'Components/UI/BrowserUrlBar',
  component: BrowserUrlBar,
  argTypes: {
    // Add any props that can be controlled via Storybook here
    url: { control: 'text' },
    isLoading: { control: 'boolean' },
    isSecure: { control: 'boolean' },
  },
} as ComponentMeta<typeof BrowserUrlBar>;

const Template: ComponentStory<typeof BrowserUrlBar> = (args) => <BrowserUrlBar {...args} />;

export const Default = Template.bind({});
Default.args = {
  url: 'https://metamask.io',
  isLoading: false,
  isSecure: true,
};

export const Loading = Template.bind({});
Loading.args = {
  ...Default.args,
  isLoading: true,
};

export const Insecure = Template.bind({});
Insecure.args = {
  ...Default.args,
  isSecure: false,
};

export const EmptyUrl = Template.bind({});
EmptyUrl.args = {
  ...Default.args,
  url: '',
};

export const LongUrl = Template.bind({});
LongUrl.args = {
  ...Default.args,
  url: 'https://very-long-subdomain.another-subdomain.example.com/path/to/page?param1=value1&param2=value2',
};