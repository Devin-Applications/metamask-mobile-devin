import React from 'react';
import { storiesOf } from '@storybook/react-native';
import CollectibleContractOverview from './CollectibleContractOverview';

const defaultProps = {
  contractName: 'CryptoKitties',
  totalSupply: '10000',
  description: 'Collect and breed digital cats!',
  contractAddress: '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d',
  onPress: () => console.log('Contract pressed'),
};

storiesOf('UI/CollectibleContractOverview', module)
  .add('Default', () => (
    <CollectibleContractOverview {...defaultProps} />
  ))
  .add('With Long Description', () => (
    <CollectibleContractOverview
      {...defaultProps}
      description="This is a very long description that should be truncated in the UI. It goes on and on about the amazing features of this particular NFT collection."
    />
  ))
  .add('Without Description', () => (
    <CollectibleContractOverview
      {...defaultProps}
      description={null}
    />
  ))
  .add('Large Total Supply', () => (
    <CollectibleContractOverview
      {...defaultProps}
      totalSupply="1000000"
    />
  ))
  .add('Loading State', () => (
    <CollectibleContractOverview
      {...defaultProps}
      isLoading={true}
    />
  ));