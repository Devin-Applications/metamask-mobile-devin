import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import Text from '../../../../Base/Text';
import StyledButton from '../../../../UI/StyledButton';
import RangeInput from '../../../../Base/RangeInput';
import InfoModal from '../../../../UI/Swaps/components/InfoModal';
import { strings } from '../../../../../../locales/i18n';
import Alert, { AlertType } from '../../../../Base/Alert';
import HorizontalSelector from '../../../../Base/HorizontalSelector';
import {
  getDecimalChainId,
  isMainnetByChainId,
} from '../../../../../util/networks';
import BigNumber from 'bignumber.js';
import FadeAnimationView from '../../../../UI/FadeAnimationView';
import { MetaMetricsEvents } from '../../../../../core/Analytics';

// Manually declare the types for MaterialCommunityIcons and Ionicons components
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import TimeEstimateInfoModal from '../../../../UI/TimeEstimateInfoModal';
import useModalHandler from '../../../../Base/hooks/useModalHandler';
import AppConstants from '../../../../../core/AppConstants';
import { useGasTransaction } from '../../../../../core/GasPolling/GasPolling';
import { useAppThemeFromContext, mockTheme } from '../../../../../util/theme';
import createStyles from './styles';
import { EditGasFee1559UpdateProps } from './types';
import { EditGasViewSelectorsIDs } from '../../../../../../e2e/selectors/EditGasView.selectors.js';
import {
  GAS_LIMIT_INCREMENT,
  GAS_PRICE_INCREMENT as GAS_INCREMENT,
  GAS_LIMIT_MIN,
  GAS_PRICE_MIN as GAS_MIN,
} from '../../../../../util/gasUtils';
import { useMetrics } from '../../../../../components/hooks/useMetrics';




interface GasTransaction {
  suggestedMaxFeePerGas?: string;
  suggestedMaxPriorityFeePerGas?: string;
  suggestedGasLimit?: string;
  renderableGasFeeMinNative?: string;
  renderableGasFeeMaxNative?: string;
  renderableGasFeeMinConversion?: string;
  renderableGasFeeMaxConversion?: string;
  renderableMaxFeePerGasNative?: string;
  renderableMaxPriorityFeeNative?: string;
  renderableMaxFeePerGasConversion?: string;
  renderableMaxPriorityFeeConversion?: string;
  timeEstimateColor?: string;
  timeEstimate?: string;
  timeEstimateId?: string;
}

interface GasFeeOptions {
  [key: string]: {
    suggestedMaxFeePerGas?: string;
    suggestedMaxPriorityFeePerGas?: string;
  };
}

interface RenderInputProps {
  showAdvanced?: boolean;
  maxFeeThreshold?: string;
  renderableMaxPriorityFeeNative?: string;
  renderableMaxPriorityFeeConversion?: string;
  renderableMaxFeePerGasNative?: string;
  renderableMaxFeePerGasConversion?: string;
  isSubmit?: boolean;
}

const EditGasFee1559Update = ({
  selectedGasValue,
  gasOptions,
  primaryCurrency,
  chainId,
  onCancel,
  onChange,
  onSave,
  error,
  dappSuggestedGas,
  ignoreOptions,
  updateOption,
  extendOptions = {},
  recommended,
  warningMinimumEstimateOption,
  suggestedEstimateOption,
  animateOnChange,
  isAnimating,
  analyticsParams,
  warning,
  selectedGasObject,
  onlyGas,
}: EditGasFee1559UpdateProps) => {
  const [modalInfo, updateModalInfo] = useState({
    isVisible: false,
    value: '',
  });
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(
    !selectedGasValue,
  );
  const [maxPriorityFeeError, setMaxPriorityFeeError] = useState('');
  const [maxFeeError, setMaxFeeError] = useState('');
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(selectedGasValue);
  const [showInputs, setShowInputs] = useState(!dappSuggestedGas);
  const [gasObject, updateGasObject] = useState({
    suggestedMaxFeePerGas: selectedGasObject.suggestedMaxFeePerGas,
    suggestedMaxPriorityFeePerGas:
      selectedGasObject.suggestedMaxPriorityFeePerGas,
    suggestedGasLimit: selectedGasObject.suggestedGasLimit,
  });

  const [
    isVisibleTimeEstimateInfoModal,
    showTimeEstimateInfoModal,
    hideTimeEstimateInfoModal,
  ] = useModalHandler(false);
  const { colors } = useAppThemeFromContext() || mockTheme;
  const { trackEvent } = useMetrics();
  const styles = createStyles(colors);

  const gasTransaction = useGasTransaction({
    onlyGas,
    gasSelected: selectedOption,
    legacy: false,
    gasObject,
  });

  const suggestedMaxFeePerGas = typeof gasTransaction === 'object' && 'suggestedMaxFeePerGas' in gasTransaction
    ? gasTransaction.suggestedMaxFeePerGas
    : '0';
  const suggestedMaxPriorityFeePerGas = typeof gasTransaction === 'object' && 'suggestedMaxPriorityFeePerGas' in gasTransaction
    ? gasTransaction.suggestedMaxPriorityFeePerGas
    : '0';
  const suggestedGasLimit = typeof gasTransaction === 'object' && 'suggestedGasLimit' in gasTransaction
    ? gasTransaction.suggestedGasLimit
    : '0';

  const getAnalyticsParams = useCallback(() => {
    try {
      return {
        ...analyticsParams,
        chain_id: getDecimalChainId(chainId),
        function_type: analyticsParams.view,
        gas_mode: selectedOption ? 'Basic' : 'Advanced',
        speed_set: selectedOption || undefined,
      };
    } catch (err) {
      return {};
    }
  }, [analyticsParams, chainId, selectedOption]);

  const toggleAdvancedOptions = useCallback(() => {
    if (!showAdvancedOptions) {
      trackEvent(
        MetaMetricsEvents.GAS_ADVANCED_OPTIONS_CLICKED,
        getAnalyticsParams(),
      );
    }
    setShowAdvancedOptions(!showAdvancedOptions);
  }, [getAnalyticsParams, showAdvancedOptions, trackEvent]);

  const toggleLearnMoreModal = useCallback(() => {
    setShowLearnMoreModal(!showLearnMoreModal);
  }, [showLearnMoreModal]);

  const toggleInfoModal = useCallback(
    (value: string) => {
      updateModalInfo({ isVisible: !modalInfo.isVisible, value });
    },
    [updateModalInfo, modalInfo.isVisible],
  );

  const save = useCallback(() => {
    trackEvent(MetaMetricsEvents.GAS_FEE_CHANGED, getAnalyticsParams());

    const newGasPriceObject = {
      suggestedMaxFeePerGas: gasObject?.suggestedMaxFeePerGas,
      suggestedMaxPriorityFeePerGas: gasObject?.suggestedMaxPriorityFeePerGas,
      suggestedGasLimit: gasObject?.suggestedGasLimit,
    };

    onSave(gasTransaction, newGasPriceObject);
  }, [getAnalyticsParams, onSave, gasTransaction, gasObject, trackEvent]);

  const changeGas = useCallback(
    (gas, option) => {
      setSelectedOption(option);
      updateGasObject({
        ...gasObject,
        suggestedMaxFeePerGas: gas.suggestedMaxFeePerGas,
        suggestedMaxPriorityFeePerGas: gas.suggestedMaxPriorityFeePerGas,
        suggestedGasLimit: gas.suggestedGasLimit || gasObject.suggestedGasLimit,
      });
      onChange(option);
    },
    [onChange, gasObject],
  );

  const changedGasLimit = useCallback(
    (value) => {
      const newGas = {
        ...(typeof gasTransaction === 'object' ? gasTransaction : {}),
        suggestedGasLimit: value ?? '',
      };
      changeGas(newGas, null);
    },
    [changeGas, gasTransaction],
  );

  const changedMaxPriorityFee = useCallback(
    (value) => {
      const lowerValue = new BigNumber(
        gasOptions?.[
          warningMinimumEstimateOption as keyof typeof gasOptions
        ]?.suggestedMaxPriorityFeePerGas ?? '0'
      );

      const higherValue = new BigNumber(
        gasOptions?.[suggestedEstimateOption as keyof typeof gasOptions]?.suggestedMaxPriorityFeePerGas ?? '0'
      ).multipliedBy(new BigNumber(1.5));
      const updateFloor = new BigNumber((updateOption as any)?.maxPriorityFeeThreshold ?? '0');

      const valueBN = new BigNumber(value);

      if (updateFloor && !updateFloor.isNaN() && valueBN.lt(updateFloor)) {
        setMaxPriorityFeeError(
          (updateOption as any)?.isCancel
            ? strings('edit_gas_fee_eip1559.max_priority_fee_cancel_low', {
                cancel_value: updateFloor.toString(),
              })
            : strings('edit_gas_fee_eip1559.max_priority_fee_speed_up_low', {
                speed_up_floor_value: updateFloor.toString(),
              })
        );
      } else if (!lowerValue.isNaN() && valueBN.lt(lowerValue)) {
        setMaxPriorityFeeError(
          strings('edit_gas_fee_eip1559.max_priority_fee_low')
        );
      } else if (!higherValue.isNaN() && valueBN.gt(higherValue)) {
        setMaxPriorityFeeError(
          strings('edit_gas_fee_eip1559.max_priority_fee_high')
        );
      } else {
        setMaxPriorityFeeError('');
      }

      const newGas = {
        ...(typeof gasTransaction === 'object' ? gasTransaction : {}),
        suggestedMaxPriorityFeePerGas: value,
      };

      changeGas(newGas, null);
    },
    [
      changeGas,
      gasTransaction,
      gasOptions,
      updateOption,
      warningMinimumEstimateOption,
      suggestedEstimateOption,
    ],
  );

  const changedMaxFeePerGas = useCallback(
    (value) => {
      const lowerValue = new BigNumber(
        gasOptions?.[warningMinimumEstimateOption as keyof typeof gasOptions]?.suggestedMaxFeePerGas ?? '0'
      );
      const higherValue = lowerValue.multipliedBy(new BigNumber(1.5));
      const updateFloor = new BigNumber((updateOption as any)?.maxFeeThreshold ?? '0');

      const valueBN = new BigNumber(value);

      if (updateFloor && !updateFloor.isNaN() && valueBN.lt(updateFloor)) {
        setMaxFeeError(
          (updateOption as any)?.isCancel
            ? strings('edit_gas_fee_eip1559.max_fee_cancel_low', {
                cancel_value: updateFloor.toString(),
              })
            : strings('edit_gas_fee_eip1559.max_fee_speed_up_low', {
                speed_up_floor_value: updateFloor.toString(),
              })
        );
      } else if (!lowerValue.isNaN() && valueBN.lt(lowerValue)) {
        setMaxFeeError(strings('edit_gas_fee_eip1559.max_fee_low'));
      } else if (!higherValue.isNaN() && valueBN.gt(higherValue)) {
        setMaxFeeError(strings('edit_gas_fee_eip1559.max_fee_high'));
      } else {
        setMaxFeeError('');
      }

      const newGas = {
        ...(typeof gasTransaction === 'object' ? gasTransaction : {}),
        suggestedMaxFeePerGas: value,
      };

      changeGas(newGas, null);
    },
    [
      changeGas,
      gasTransaction,
      gasOptions,
      updateOption,
      warningMinimumEstimateOption,
    ],
  );

  const selectOption = useCallback(
    (option: string) => {
      setSelectedOption(option);
      setMaxFeeError('');
      setMaxPriorityFeeError('');
      if (gasOptions && option in gasOptions) {
        const selectedOption = gasOptions[option as keyof typeof gasOptions];
        if (selectedOption) {
          changeGas({ ...selectedOption }, option);
        }
      }
    },
    [changeGas, gasOptions],
  );

  const shouldIgnore = useCallback(
    (option) => ignoreOptions?.find((item: string) => item === option),
    [ignoreOptions],
  );

  const renderOptions = useMemo(
    () =>
      [
        {
          name: AppConstants.GAS_OPTIONS.LOW,
          label: strings('edit_gas_fee_eip1559.low'),
        },
        {
          name: AppConstants.GAS_OPTIONS.MEDIUM,
          label: strings('edit_gas_fee_eip1559.market'),
        },
        {
          name: AppConstants.GAS_OPTIONS.HIGH,
          label: strings('edit_gas_fee_eip1559.aggressive'),
        },
      ]
        .filter(({ name }) => !shouldIgnore(name))
        .map(({ name, label, ...option }) => ({
          name,
          // TODO: Replace "any" with type
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function LabelComponent(selected: any, disabled: any) {
            return (
              <Text bold primary={selected && !disabled}>
                {label}
              </Text>
            );
          },
          topLabel: recommended?.name === name && recommended.render,
          ...option,
          ...extendOptions[name],
        })),
    [recommended, extendOptions, shouldIgnore],
  );

  const isMainnet = isMainnetByChainId(chainId);
  const nativeCurrencySelected = primaryCurrency === 'ETH' || !isMainnet;

  const switchNativeCurrencyDisplayOptions = (
    nativeValue: string,
    fiatValue: string,
  ) => {
    if (nativeCurrencySelected) return nativeValue;
    return fiatValue;
  };

  const valueToWatch = `${suggestedMaxFeePerGas ?? ''}${suggestedMaxPriorityFeePerGas ?? ''}`;

  const LeftLabelComponent = ({
    value,
    infoValue,
  }: {
    value: string;
    infoValue: string;
  }) => (
    <View style={styles.labelTextContainer}>
      <Text black bold noMargin>
        {strings(value)}
      </Text>
      <TouchableOpacity
        hitSlop={styles.hitSlop}
        onPress={() => toggleInfoModal(infoValue)}
      >
        <MaterialCommunityIcons
          name="information"
          size={14}
          style={styles.labelInfo}
          color={colors.text.default}
        />
      </TouchableOpacity>
    </View>
  );

  const RightLabelComponent = ({ value }: { value: string }) => (
    <Text noMargin small grey>
      <Text bold reset>
        {strings(value)}:
      </Text>{' '}
      {gasOptions && suggestedEstimateOption in gasOptions
        ? gasOptions[suggestedEstimateOption as keyof typeof gasOptions]?.suggestedMaxFeePerGas
        : ''} GWEI
    </Text>
  );

  const TextComponent = ({
    title,
    value,
  }: {
    title: string;
    value: string;
  }) => (
    <>
      <Text noMargin primary infoModal bold style={styles.learnMoreLabels}>
        {strings(title)}
      </Text>
      <Text noMargin grey infoModal>
        {strings(value)}
      </Text>
    </>
  );

  const renderInputs = (option: RenderInputProps) => (
    <View>
      <FadeAnimationView
        valueToWatch={valueToWatch}
        animateOnChange={animateOnChange}
      >
        <View>
          <HorizontalSelector
            selected={selectedOption}
            onPress={selectOption}
            options={renderOptions}
            circleSize={24}
            disabled={false}
          />
        </View>
        <View style={styles.advancedOptionsContainer}>
          <TouchableOpacity
            disabled={option?.showAdvanced ?? false}
            onPress={toggleAdvancedOptions}
            style={styles.advancedOptionsButton}
          >
            <Text noMargin link bold>
              {strings('edit_gas_fee_eip1559.advanced_options')}
            </Text>
            <Text noMargin link bold style={styles.advancedOptionsIcon}>
              {showAdvancedOptions ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
          {(showAdvancedOptions || option?.maxFeeThreshold) && (
            <View style={styles.advancedOptionsInputsContainer}>
              <View style={styles.rangeInputContainer}>
                <RangeInput
                  leftLabelComponent={
                    <LeftLabelComponent
                      value="edit_gas_fee_eip1559.gas_limit"
                      infoValue="gas_limit"
                    />
                  }
                  min={GAS_LIMIT_MIN}
                  value={suggestedGasLimit}
                  onChangeValue={changedGasLimit}
                  name={strings('edit_gas_fee_eip1559.gas_limit')}
                  increment={GAS_LIMIT_INCREMENT}
                />
              </View>
              <View
                style={styles.rangeInputContainer}
                testID={EditGasViewSelectorsIDs.MAX_PRIORITY_FEE_INPUT_TEST_ID}
              >
                <RangeInput
                  leftLabelComponent={
                    <LeftLabelComponent
                      value="edit_gas_fee_eip1559.max_priority_fee"
                      infoValue="max_priority_fee"
                    />
                  }
                  rightLabelComponent={
                    <RightLabelComponent value="edit_gas_fee_eip1559.estimate" />
                  }
                  value={suggestedMaxPriorityFeePerGas}
                  name={strings('edit_gas_fee_eip1559.max_priority_fee')}
                  unit={'GWEI'}
                  min={GAS_MIN}
                  increment={GAS_INCREMENT}
                  inputInsideLabel={
                    option?.renderableMaxPriorityFeeNative &&
                    `≈ ${switchNativeCurrencyDisplayOptions(
                      option.renderableMaxPriorityFeeNative,
                      option.renderableMaxPriorityFeeConversion ?? '',
                    )}`
                  }
                  error={maxPriorityFeeError}
                  onChangeValue={changedMaxPriorityFee}
                />
              </View>
              <View style={styles.rangeInputContainer}>
                <RangeInput
                  leftLabelComponent={
                    <LeftLabelComponent
                      value="edit_gas_fee_eip1559.max_fee"
                      infoValue="max_fee"
                    />
                  }
                  rightLabelComponent={
                    <RightLabelComponent value="edit_gas_fee_eip1559.estimate" />
                  }
                  value={suggestedMaxFeePerGas}
                  name={strings('edit_gas_fee_eip1559.max_fee')}
                  unit={'GWEI'}
                  min={GAS_MIN}
                  increment={GAS_INCREMENT}
                  error={maxFeeError}
                  onChangeValue={changedMaxFeePerGas}
                  inputInsideLabel={
                    option?.renderableMaxFeePerGasNative &&
                    `≈ ${switchNativeCurrencyDisplayOptions(
                      option.renderableMaxFeePerGasNative,
                      option.renderableMaxFeePerGasConversion ?? '',
                    )}`
                  }
                />
              </View>
            </View>
          )}
        </View>
      </FadeAnimationView>
      <View>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={toggleLearnMoreModal}
        >
          <Text link centered>
            {strings('edit_gas_fee_eip1559.learn_more.title')}
          </Text>
        </TouchableOpacity>
        <StyledButton
          type={'confirm'}
          onPress={save}
          disabled={Boolean(error) || isAnimating}
        >
          {option?.isSubmit
            ? strings('edit_gas_fee_eip1559.submit')
            : strings('edit_gas_fee_eip1559.save')}
        </StyledButton>
      </View>
    </View>
  );

  const renderWarning = useMemo(() => {
    if (!warning) return null;
    if (typeof warning === 'string')
      return (
        <Alert
          small
          type={AlertType.Warning}
          renderIcon={() => (
            <MaterialCommunityIcons
              name="information"
              size={20}
              color={colors.warning.default}
            />
          )}
          style={styles.warningContainer}
        >
          {() => (
            <View style={styles.warningTextContainer}>
              <Text black style={styles.warningText}>
                {warning}
              </Text>
            </View>
          )}
        </Alert>
      );
    return warning;
  }, [warning, styles, colors]);

  const renderError = useMemo(() => {
    if (!error) return null;
    if (typeof error === 'string')
      return (
        <Alert
          small
          type={AlertType.Error}
          renderIcon={() => (
            <MaterialCommunityIcons
              name="information"
              size={20}
              color={colors.error.default}
            />
          )}
          style={styles.warningContainer}
        >
          {() => (
            <View style={styles.warningTextContainer}>
              <Text red style={styles.warningText}>
                {error}
              </Text>
            </View>
          )}
        </Alert>
      );
    return error;
  }, [error, styles, colors]);

  const renderDisplayTitle = useMemo(() => {
    if (updateOption)
      // @ts-expect-error Deprecated component
      return updateOption.isCancel
        ? strings('edit_gas_fee_eip1559.cancel_transaction')
        : strings('edit_gas_fee_eip1559.speed_up_transaction');
    return strings('edit_gas_fee_eip1559.edit_priority');
  }, [updateOption]);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.wrapper}
        testID={EditGasViewSelectorsIDs.EDIT_PRIORITY_SCREEN_TEST_ID}
      >
        <TouchableWithoutFeedback>
          <View>
            <View>
              <View style={styles.customGasHeader}>
                <TouchableOpacity onPress={onCancel}>
                  <Ionicons
                    name="ios-arrow-back"
                    size={24}
                    color={colors.text.default}
                  />
                </TouchableOpacity>
                <Text bold black>
                  {renderDisplayTitle}
                </Text>
                <Ionicons
                  name="ios-arrow-forward"
                  size={24}
                  color={colors.background.default}
                />
              </View>
              {updateOption && (
                <View style={styles.newGasFeeHeader}>
                  <Text black bold noMargin>
                    {strings('edit_gas_fee_eip1559.new_gas_fee')}{' '}
                  </Text>

                  <TouchableOpacity
                    hitSlop={styles.hitSlop}
                    onPress={() => toggleInfoModal('new_gas_fee')}
                  >
                    <MaterialCommunityIcons
                      name="information"
                      size={14}
                      style={styles.labelInfo}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {renderWarning}
            {renderError}
            <FadeAnimationView
              style={styles.headerContainer}
              valueToWatch={valueToWatch}
              animateOnChange={animateOnChange}
            >
              <View style={styles.headerTitle}>
                <Text
                  black
                  style={styles.headerText}
                  adjustsFontSizeToFit
                  numberOfLines={1}
                  noMargin
                >
                  ~
                  {switchNativeCurrencyDisplayOptions(
                    (gasTransaction as GasTransaction)?.renderableGasFeeMinNative ?? '',
                    (gasTransaction as GasTransaction)?.renderableGasFeeMinConversion ?? '',
                  )}
                </Text>
              </View>
              <Text big black style={styles.subheader} noMargin>
                <Text bold black noMargin>
                  {strings('edit_gas_fee_eip1559.max_fee')}:{' '}
                </Text>
                {switchNativeCurrencyDisplayOptions(
                  (gasTransaction as GasTransaction)?.renderableGasFeeMaxNative ?? '',
                  (gasTransaction as GasTransaction)?.renderableGasFeeMaxConversion ?? '',
                )}{' '}
                (
                {switchNativeCurrencyDisplayOptions(
                  (gasTransaction as GasTransaction)?.renderableGasFeeMaxConversion ?? '',
                  (gasTransaction as GasTransaction)?.renderableGasFeeMaxNative ?? '',
                )}
                )
              </Text>
              <View style={styles.labelTextContainer}>
                <Text
                  green={
                    (gasTransaction as GasTransaction)?.timeEstimateColor === 'green' ||
                    (gasTransaction as GasTransaction)?.timeEstimateId === AppConstants.GAS_TIMES.VERY_LIKELY
                  }
                  red={(gasTransaction as GasTransaction)?.timeEstimateColor === 'red'}
                  bold
                >
                  {(gasTransaction as GasTransaction)?.timeEstimate}
                </Text>
                {(gasTransaction as GasTransaction)?.timeEstimateId ===
                  (AppConstants.GAS_TIMES.MAYBE ||
                    AppConstants.GAS_TIMES.UNKNOWN) && (
                  <TouchableOpacity
                    hitSlop={styles.hitSlop}
                    onPress={() => showTimeEstimateInfoModal()}
                  >
                    <MaterialCommunityIcons
                      name="information"
                      size={14}
                      style={styles.redInfo}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </FadeAnimationView>
            {!showInputs ? (
              <View style={styles.dappEditGasContainer}>
                <StyledButton
                  type={'orange'}
                  onPress={() => setShowInputs(true)}
                >
                  {strings('edit_gas_fee_eip1559.edit_suggested_gas_fee')}
                </StyledButton>
              </View>
            ) : (
              renderInputs(updateOption)
            )}

            <InfoModal
              isVisible={Boolean(modalInfo.isVisible)}
              title={
                modalInfo.value === 'gas_limit'
                  ? strings('edit_gas_fee_eip1559.gas_limit')
                  : modalInfo.value === 'max_priority_fee'
                  ? strings('edit_gas_fee_eip1559.max_priority_fee')
                  : modalInfo.value === 'max_fee'
                  ? strings('edit_gas_fee_eip1559.max_fee')
                  : modalInfo.value === 'new_gas_fee'
                  ? strings('edit_gas_fee_eip1559.new_gas_fee')
                  : null
              }
              toggleModal={() =>
                updateModalInfo({ ...modalInfo, isVisible: false })
              }
              body={
                <View>
                  <Text grey infoModal>
                    {modalInfo.value === 'gas_limit' &&
                      strings('edit_gas_fee_eip1559.learn_more_gas_limit')}
                    {modalInfo.value === 'max_priority_fee' &&
                      strings(
                        'edit_gas_fee_eip1559.learn_more_max_priority_fee',
                      )}
                    {modalInfo.value === 'max_fee' &&
                      strings('edit_gas_fee_eip1559.learn_more_max_fee')}
                    {modalInfo.value === 'new_gas_fee' &&
                    updateOption &&
                    updateOption.isCancel
                      ? strings(
                          'edit_gas_fee_eip1559.learn_more_cancel_gas_fee',
                        )
                      : strings('edit_gas_fee_eip1559.learn_more_new_gas_fee')}
                  </Text>
                </View>
              }
            />
            <InfoModal
              isVisible={showLearnMoreModal}
              title={strings('edit_gas_fee_eip1559.learn_more.title')}
              toggleModal={toggleLearnMoreModal}
              propagateSwipe
              body={
                <View style={styles.learnMoreModal}>
                  <ScrollView>
                    <TouchableWithoutFeedback>
                      <View>
                        <Text noMargin grey infoModal>
                          {strings('edit_gas_fee_eip1559.learn_more.intro')}
                        </Text>
                        <TextComponent
                          title="edit_gas_fee_eip1559.learn_more.low_label"
                          value="edit_gas_fee_eip1559.learn_more.low_text"
                        />
                        <TextComponent
                          title="edit_gas_fee_eip1559.learn_more.market_label"
                          value="edit_gas_fee_eip1559.learn_more.market_text"
                        />
                        <TextComponent
                          title="edit_gas_fee_eip1559.learn_more.aggressive_label"
                          value="edit_gas_fee_eip1559.learn_more.aggressive_text"
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </ScrollView>
                </View>
              }
            />
            <TimeEstimateInfoModal
              isVisible={isVisibleTimeEstimateInfoModal}
              timeEstimateId={timeEstimateId}
              onHideModal={hideTimeEstimateInfoModal}
            />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
};

export default EditGasFee1559Update;
