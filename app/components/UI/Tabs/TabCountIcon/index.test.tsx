import React from 'react';
import TabCountIcon from './';
import configureMockStore from 'redux-mock-store';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';

const mockStore = configureMockStore();
const initialState = {
  browser: {
    tabs: [{ url: 'https://metamask.io' }],
  },
};
const store = mockStore(initialState);

describe('TabCountIcon', () => {
  it('should render correctly', () => {
    const { toJSON } = render(
      <Provider store={store}>
        <TabCountIcon />
      </Provider>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
