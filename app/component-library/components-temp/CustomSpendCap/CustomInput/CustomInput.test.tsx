import { render, screen } from '@testing-library/react-native';
import userEvent from '@testing-library/user-event';
// Third party dependencies.
import React from 'react';

// External dependencies.
import { TICKER } from '../CustomSpendCap.constants';
// Internal dependencies.
import CustomInput from './CustomInput';
import {
  CUSTOM_SPEND_CAP_INPUT_INPUT_ID,
  CUSTOM_SPEND_CAP_MAX_TEST_ID,
} from './CustomInput.constants';
import { CustomInputProps } from './CustomInput.types';

describe('CustomInput', () => {
  let props: CustomInputProps;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    props = {
      ticker: TICKER,
      value: '123',
      isInputGreaterThanBalance: false,
      isEditDisabled: false,
      setMaxSelected: jest.fn(),
      setValue: jest.fn(),
      tokenDecimal: 4,
    };
    user = userEvent.setup();
  });

  const renderComponent = () => render(<CustomInput {...props} />);

  it('should render correctly', () => {
    const { toJSON } = renderComponent();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should call setMaxSelected when max button is pressed', async () => {
    renderComponent();
    const maxButton = screen.getByTestId(CUSTOM_SPEND_CAP_MAX_TEST_ID);
    await user.click(maxButton);
    expect(props.setMaxSelected).toHaveBeenCalled();
  });

  it('should update value if input is integer', async () => {
    renderComponent();
    const input = screen.getByTestId(CUSTOM_SPEND_CAP_INPUT_INPUT_ID);
    await user.type(input, '123');
    expect(props.setValue).toHaveBeenCalledWith('123');
  });

  it('should update value if input is decimal and decimal points are less than or equal to tokenDecimal', async () => {
    renderComponent();
    const input = screen.getByTestId(CUSTOM_SPEND_CAP_INPUT_INPUT_ID);
    await user.type(input, '123.1234');
    expect(props.setValue).toHaveBeenCalledWith('123.1234');
  });

  it('should not update value if input is decimal and decimal points are greater than tokenDecimal', async () => {
    renderComponent();
    const input = screen.getByTestId(CUSTOM_SPEND_CAP_INPUT_INPUT_ID);
    await user.type(input, '123.1234567');
    expect(props.setValue).not.toHaveBeenCalled();
  });
});
