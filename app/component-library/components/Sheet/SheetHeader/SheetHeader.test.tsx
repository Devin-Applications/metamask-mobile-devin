// Third party dependencies.
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

// Internal dependencies.
import SheetHeader from './SheetHeader';
import {
  SHEET_HEADER_ACTION_BUTTON_ID,
  SHEET_HEADER_BACK_BUTTON_ID,
} from './SheetHeader.constants';

// Mock clipboard
jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
  getString: jest.fn(),
}));

describe('SheetHeader', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<SheetHeader title={'Title'} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render back button', () => {
    render(<SheetHeader onBack={jest.fn} title={'Title'} />);
    const backButton = screen.getByTestId(SHEET_HEADER_BACK_BUTTON_ID);
    expect(backButton).toBeTruthy();
  });

  it('should render action button', () => {
    render(
      <SheetHeader
        title={'Title'}
        actionButtonOptions={{ label: 'Action', onPress: jest.fn }}
      />,
    );
    const actionButton = screen.getByTestId(SHEET_HEADER_ACTION_BUTTON_ID);
    expect(actionButton).toBeTruthy();
  });

  it('should render the correct title', () => {
    render(<SheetHeader title={'Test Title'} />);
    expect(screen.getByText('Test Title')).toBeTruthy();
  });

  it('should call onBack when back button is pressed', () => {
    const onBackMock = jest.fn();
    render(<SheetHeader onBack={onBackMock} title={'Title'} />);
    fireEvent.press(screen.getByTestId(SHEET_HEADER_BACK_BUTTON_ID));
    expect(onBackMock).toHaveBeenCalled();
  });

  it('should call onPress when action button is pressed', () => {
    const onPressMock = jest.fn();
    render(
      <SheetHeader
        title={'Title'}
        actionButtonOptions={{ label: 'Action', onPress: onPressMock }}
      />,
    );
    fireEvent.press(screen.getByTestId(SHEET_HEADER_ACTION_BUTTON_ID));
    expect(onPressMock).toHaveBeenCalled();
  });
});
