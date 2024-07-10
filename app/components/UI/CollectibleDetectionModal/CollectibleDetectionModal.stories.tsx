import React from 'react';
import { storiesOf } from '@storybook/react-native';
import CollectibleDetectionModal from './CollectibleDetectionModal';

const mockNavigation = {
  navigate: () => console.log('Navigate to SecuritySettings')
};

storiesOf('UI/CollectibleDetectionModal', module)
  .add('Default', () => (
    <CollectibleDetectionModal navigation={null} />
  ))
  .add('With Navigation', () => (
    <CollectibleDetectionModal navigation={mockNavigation} />
  ))
  .add('Disabled Detection', () => (
    <CollectibleDetectionModal navigation={mockNavigation} isDetectionEnabled={false} />
  ))
  .add('Enabled Detection', () => (
    <CollectibleDetectionModal navigation={mockNavigation} isDetectionEnabled={true} />
  ))
  .add('Loading State', () => (
    <CollectibleDetectionModal navigation={mockNavigation} isLoading={true} />
  ))
  .add('Error State', () => (
    <CollectibleDetectionModal navigation={mockNavigation} hasError={true} />
  ));