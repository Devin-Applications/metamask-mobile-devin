import React from 'react';
import { storiesOf } from '@storybook/react-native';
import CollectibleModal from './CollectibleModal';

const mockCollectible = {
  name: 'Cool NFT',
  description: 'This is a really cool NFT',
  image: 'https://example.com/nft-image.png',
  tokenId: '1234',
  address: '0x1234567890123456789012345678901234567890',
};

storiesOf('CollectibleModal', module)
  .add('Default View', () => (
    <CollectibleModal
      collectible={mockCollectible}
      onClose={() => console.log('Modal closed')}
    />
  ))
  .add('Loading State', () => (
    <CollectibleModal
      collectible={null}
      onClose={() => console.log('Modal closed')}
    />
  ))
  .add('Error State', () => (
    <CollectibleModal
      collectible={null}
      error="Failed to load collectible"
      onClose={() => console.log('Modal closed')}
    />
  ));