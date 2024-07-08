import React from 'react';
import { render, screen } from '@testing-library/react-native';
import userEvent from '@testing-library/user-event';
import NetworkInfo from './';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import initialBackgroundState from '../../../util/test/initial-background-state.json';

const mockStore = configureMockStore();
const initialState = {
  privacy: {
    approvedHosts: {},
  },
  engine: {
    backgroundState: initialBackgroundState,
  },
};

const store = mockStore(initialState);

describe('NetworkInfo', () => {
  it('should render correctly', () => {
    const { toJSON } = render(
      <Provider store={store}>
        <NetworkInfo type={''} onClose={jest.fn()} ticker={''} />
      </Provider>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should display the correct heading', () => {
    render(
      <Provider store={store}>
        <NetworkInfo type={''} onClose={jest.fn()} ticker={''} />
      </Provider>,
    );
    expect(screen.getByRole('heading')).toHaveTextContent(
      'Network Information',
    );
  });

  it('should call onClose when close button is clicked', async () => {
    const onCloseMock = jest.fn();
    render(
      <Provider store={store}>
        <NetworkInfo type={''} onClose={onCloseMock} ticker={''} />
      </Provider>,
    );
    const closeButton = screen.getByText('Close');
    await userEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalled();
  });
});
