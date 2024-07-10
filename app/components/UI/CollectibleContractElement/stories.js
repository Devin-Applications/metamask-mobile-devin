import React from 'react';
import { storiesOf } from '@storybook/react-native';
import CollectibleContractElement from './CollectibleContractElement';

const defaultProps = {
  collectibleContract: {
    name: 'Example NFT Collection',
    address: '0x1234567890123456789012345678901234567890',
    logo: 'https://example.com/logo.png',
    totalBalance: '10',
    balanceUSD: '1000',
  },
  onPress: () => console.log('Contract pressed'),
};

storiesOf('UI/CollectibleContractElement', module)
  .add('Default', () => (
    <CollectibleContractElement {...defaultProps} />
  ))
  .add('Without Logo', () => (
    <CollectibleContractElement
      {...defaultProps}
      collectibleContract={{
        ...defaultProps.collectibleContract,
        logo: null,
      }}
    />
  ))
  .add('Long Name', () => (
    <CollectibleContractElement
      {...defaultProps}
      collectibleContract={{
        ...defaultProps.collectibleContract,
        name: 'This is a very long name for an NFT collection that might need truncation',
      }}
    />
  ))
  .add('High Balance', () => (
    <CollectibleContractElement
      {...defaultProps}
      collectibleContract={{
        ...defaultProps.collectibleContract,
        totalBalance: '1000000',
        balanceUSD: '1000000000',
      }}
    />
  ))
  .add('Zero Balance', () => (
    <CollectibleContractElement
      {...defaultProps}
      collectibleContract={{
        ...defaultProps.collectibleContract,
        totalBalance: '0',
        balanceUSD: '0',
      }}
    />
  ));