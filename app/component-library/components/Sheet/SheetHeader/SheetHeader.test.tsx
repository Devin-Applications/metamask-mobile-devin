// Third party dependencies.
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import userEvent from '@testing-library/user-event';

// Internal dependencies.
import SheetHeader from './SheetHeader';
import {
  SHEET_HEADER_ACTION_BUTTON_ID,
  SHEET_HEADER_BACK_BUTTON_ID,
} from './SheetHeader.constants';

describe('SheetHeader', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<SheetHeader title={'Title'} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render back button and title', () => {
    render(<SheetHeader onBack={jest.fn} title={'Title'} />);
    const backButton = screen.getByTestId(SHEET_HEADER_BACK_BUTTON_ID);
    expect(backButton).toBeTruthy();
    expect(backButton.props.accessibilityRole).toBe('button');
    expect(screen.getByText('Title')).toBeTruthy();
  });

  it('should render action button and title', async () => {
    const onPressMock = jest.fn();
    render(
      <SheetHeader
        title={'Title'}
        actionButtonOptions={{ label: 'Action', onPress: onPressMock }}
      />,
    );
    const actionButton = screen.getByTestId(SHEET_HEADER_ACTION_BUTTON_ID);
    expect(actionButton).toBeTruthy();
    expect(screen.getByText('Action')).toBeTruthy();
    expect(screen.getByText('Title')).toBeTruthy();

    const user = userEvent.setup();
    await user.click(actionButton);
    expect(onPressMock).toHaveBeenCalled();
  });

  it('should render correctly without back button or action button', () => {
    render(<SheetHeader title={'Title'} />);
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.queryByTestId(SHEET_HEADER_BACK_BUTTON_ID)).toBeNull();
    expect(screen.queryByTestId(SHEET_HEADER_ACTION_BUTTON_ID)).toBeNull();
  });
});
