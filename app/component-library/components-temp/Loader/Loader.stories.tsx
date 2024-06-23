/* eslint-disable react/display-name */
// Third party dependencies.
import React from 'react';

// Internal dependencies.
import { LoaderProps } from './Loader.types';
import Loader from './Loader';

const LoaderMeta = {
  title: 'Component Library / Loader',
  component: Loader,
  argTypes: {
    size: {
      options: ['small', 'large'],
      control: {
        type: 'select',
      },
      defaultValue: 'large',
    },
    color: {
      control: 'color',
    },
  },
};
export default LoaderMeta;

export const DefaultLoader = (args: LoaderProps) => <Loader {...args} />;
DefaultLoader.args = {
  size: 'large',
  color: undefined,
};
