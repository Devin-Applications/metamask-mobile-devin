import React from 'react';

import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import ButtonReveal from './index';

storiesOf('Components / UI / ButtonReveal', module)
  .addDecorator((getStory) => getStory())
  .add('Default', () => (
    <ButtonReveal
      label={text('label', 'Hold to reveal SRP')}
      onLongPress={action('onLongPress')}
    />
  ))
  .add('Long Label', () => (
    <ButtonReveal
      label={text('label', 'This is a very long label to test text overflow in the button')}
      onLongPress={action('onLongPress')}
    />
  ))
  .add('Empty Label', () => (
    <ButtonReveal
      label={text('label', '')}
      onLongPress={action('onLongPress')}
    />
  ))
  .add('Pressed State', () => (
    <ButtonReveal
      label={text('label', 'Hold to reveal SRP')}
      onLongPress={action('onLongPress')}
      pressed={true}
    />
  ));