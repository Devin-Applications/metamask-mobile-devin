// Third party dependencies.
import React from 'react';
import { StyleSheet } from 'react-native';
import { render, screen } from '@testing-library/react-native';

// External dependencies.
import Tag from '../../../../Tags/Tag';

// Internal dependencies.
import BadgeBase from './BadgeBase';
import { BADGE_BASE_TEST_ID } from './BadgeBase.constants';

const styles = StyleSheet.create({
  badgeBase: { position: 'absolute', zIndex: 1 },
});

describe('BadgeBase - snapshots', () => {
  it('should render badge correctly', () => {
    const { toJSON } = render(
      <BadgeBase>
        <Tag label={'Children'} />
      </BadgeBase>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('BadgeBase', () => {
  it('should render badge with the given content', () => {
    render(
      <BadgeBase style={styles.badgeBase}>
        <Tag label={'Children'} />
      </BadgeBase>,
    );

    const contentElement = screen.getByTestId(BADGE_BASE_TEST_ID);
    expect(contentElement).toBeTruthy();

    // Check if the BadgeBase contains the Tag component
    const tagElement = screen.getByText('Children');
    expect(tagElement).toBeTruthy();

    // Check that the BadgeBase does not have a specific accessibility role set
    expect(contentElement.props.accessibilityRole).toBeUndefined();

    // Check if the BadgeBase has the expected style properties
    expect(contentElement.props.style).toEqual(
      expect.objectContaining({
        position: 'absolute',
        zIndex: 1,
      }),
    );
  });
});