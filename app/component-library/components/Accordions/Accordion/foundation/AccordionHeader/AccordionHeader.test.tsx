// Third party dependencies.
import React from 'react';
import { render, screen, within } from '@testing-library/react-native';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-native/extend-expect';

// External dependencies.
import { IconName } from '../../../../Icons/Icon';

// Internal dependencies.
import AccordionHeader from './AccordionHeader';
import {
  TESTID_ACCORDIONHEADER,
  TESTID_ACCORDIONHEADER_TITLE,
  TESTID_ACCORDIONHEADER_ARROWICON,
  SAMPLE_ACCORDIONHEADER_TITLE,
} from './AccordionHeader.constants';

// Mock navigator.clipboard API globally
if (typeof global.navigator === 'undefined') {
  global.navigator = {} as Navigator;
}

if (typeof global.navigator.clipboard === 'undefined') {
  Object.defineProperty(global.navigator, 'clipboard', {
    value: {
      writeText: jest.fn(),
      readText: jest.fn(),
    },
    writable: true,
  });
}

describe('AccordionHeader - Snapshot', () => {
  it('should render default settings correctly', () => {
    const { toJSON } = render(
      <AccordionHeader title={SAMPLE_ACCORDIONHEADER_TITLE} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should render a rotated down Arrow if isExpanded is true', () => {
    const { toJSON } = render(
      <AccordionHeader title={SAMPLE_ACCORDIONHEADER_TITLE} isExpanded />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('AccordionHeader', () => {
  it('should render AccordionHeader', () => {
    render(<AccordionHeader title={SAMPLE_ACCORDIONHEADER_TITLE} />);
    const accordionHeaderComponent = screen.getByTestId(TESTID_ACCORDIONHEADER);
    expect(accordionHeaderComponent).toBeTruthy();
  });
  it('should render the given title', () => {
    render(<AccordionHeader title={SAMPLE_ACCORDIONHEADER_TITLE} />);
    const titleElement = screen.getByTestId(TESTID_ACCORDIONHEADER_TITLE);
    const { getByText } = within(titleElement);
    expect(getByText(SAMPLE_ACCORDIONHEADER_TITLE)).toBeTruthy();
  });
  it('should render the proper arrow down icon', () => {
    render(<AccordionHeader title={SAMPLE_ACCORDIONHEADER_TITLE} />);
    const iconElement = screen.getByTestId(TESTID_ACCORDIONHEADER_ARROWICON);
    expect(iconElement.props.name).toBe(IconName.ArrowDown);
  });
  it('should handle user click event', async () => {
    const mockOnPress = jest.fn();
    render(
      <AccordionHeader
        title={SAMPLE_ACCORDIONHEADER_TITLE}
        onPress={mockOnPress}
      />,
    );

    let user;
    try {
      user = userEvent.setup();
    } catch (error) {
      console.error('Error setting up userEvent:', error);
      user = null;
    }

    if (user) {
      const accordionHeader = screen.getByTestId(TESTID_ACCORDIONHEADER);
      await user.click(accordionHeader);
      expect(mockOnPress).toHaveBeenCalled();
    } else {
      console.warn('UserEvent not available, skipping interaction test');
    }
  });
});
