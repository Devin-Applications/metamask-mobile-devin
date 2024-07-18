// Third party dependencies.
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Platform, View } from 'react-native';

// Internal dependencies.
import SheetBottom from './SheetBottom';

describe('SheetBottom', () => {
  enum PlatformEnum {
    iOS = 'ios',
    Android = 'android',
  }
  const platforms = [PlatformEnum.iOS, PlatformEnum.Android];
  test.each(platforms)('should render correctly on %s', (platform) => {
    Platform.OS = platform;
    render(
      <SheetBottom>
        <View />
      </SheetBottom>,
    );
    expect(screen.toJSON()).toMatchSnapshot(platform);
  });
});
