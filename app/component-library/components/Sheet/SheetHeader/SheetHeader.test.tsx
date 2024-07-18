// Third party dependencies.
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

// Internal dependencies.
import SheetHeader from './SheetHeader';
import {
  SHEET_HEADER_ACTION_BUTTON_ID,
  SHEET_HEADER_BACK_BUTTON_ID,
} from './SheetHeader.constants';

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

describe('SheetHeader', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<SheetHeader title={'Title'} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render back button', () => {
    render(<SheetHeader onBack={jest.fn()} title={'Title'} />);
    const backButton = screen.getByTestId(SHEET_HEADER_BACK_BUTTON_ID);
    expect(backButton).toBeTruthy();
  });

  it('should render action button', () => {
    render(
      <SheetHeader
        title={'Title'}
        actionButtonOptions={{ label: 'Action', onPress: jest.fn() }}
      />,
    );
    const actionButton = screen.getByTestId(SHEET_HEADER_ACTION_BUTTON_ID);
    expect(actionButton).toBeTruthy();
  });

  it('should handle back button click', async () => {
    const mockOnBack = jest.fn();
    render(<SheetHeader onBack={mockOnBack} title={'Title'} />);

    try {
      const user = userEvent.setup({ document });
      const backButton = screen.getByTestId(SHEET_HEADER_BACK_BUTTON_ID);

      await user.click(backButton);

      expect(mockOnBack).toHaveBeenCalled();
    } catch (error) {
      console.error('Error in back button click test:', error);
      throw error;
    }
  });

  it('should handle action button click', async () => {
    const mockOnPress = jest.fn();
    render(
      <SheetHeader
        title={'Title'}
        actionButtonOptions={{ label: 'Action', onPress: mockOnPress }}
      />,
    );

    try {
      const user = userEvent.setup({ document });
      const actionButton = screen.getByTestId(SHEET_HEADER_ACTION_BUTTON_ID);

      await user.click(actionButton);

      expect(mockOnPress).toHaveBeenCalled();
    } catch (error) {
      console.error('Error in action button click test:', error);
      throw error;
    }
  });
});
