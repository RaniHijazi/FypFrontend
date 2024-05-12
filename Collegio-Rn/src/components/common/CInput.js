import React from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import {useSelector} from 'react-redux';

//custom imports
import {getHeight, moderateScale} from '../../common/constants';
import {styles} from '../../themes';
import typography from '../../themes/typography';
import CText from './CText';

export default CInput = props => {
  let {
    _value,
    label,
    inputContainerStyle,
    inputBoxStyle,
    toGetTextFieldValue,
    placeHolder,
    keyBoardType,
    _onFocus,
    _onBlur,
    _errorText,
    _autoFocus,
    _isSecure,
    _maxLength,
    _editable = true,
    autoCapitalize,
    required = false,
    labelStyle,
    multiline,
    errorStyle,
    fieldRef,
    insideLeftIcon,
    showError = true,
    rightAccessory,
    labelTextStyle,
    placeholderTextColor,
  } = props;

  const colors = useSelector(state => state.theme.theme);

  // Change Text Input Value
  const onChangeText = val => {
    toGetTextFieldValue(val);
  };

  return (
    <View style={styles.mv10}>
      {label && (
        <View style={[localStyle.labelContainer, labelStyle]}>
          <View style={styles.flexRow}>
            <CText style={[localStyle.labelText, labelTextStyle]} type={'b18'}>
              {label}
            </CText>
            {required && <CText style={{color: colors.redColor}}>{' *'}</CText>}
          </View>
        </View>
      )}
      <View
        style={[
          localStyle.inputContainer,
          {
            height: multiline ? getHeight(75) : getHeight(60),
            backgroundColor: colors.placeholderColor,
          },
          inputContainerStyle,
        ]}>
        {insideLeftIcon ? (
          <View style={styles.pl10}>{insideLeftIcon()}</View>
        ) : null}
        <TextInput
          ref={fieldRef}
          secureTextEntry={_isSecure}
          value={_value}
          maxLength={_maxLength}
          defaultValue={_value}
          autoFocus={_autoFocus}
          autoCorrect={false}
          autoCapitalize={autoCapitalize}
          placeholderTextColor={
            placeholderTextColor ? placeholderTextColor : colors.primary
          }
          onChangeText={onChangeText}
          keyboardType={keyBoardType}
          multiline={multiline}
          editable={_editable}
          onFocus={_onFocus}
          onBlur={_onBlur}
          placeholder={placeHolder}
          style={[
            localStyle.inputBox,
            {color: colors.primary},
            multiline,
            inputBoxStyle,
            _editable == false && {color: colors.placeholderColor},
          ]}
          {...props}
        />
        {/* Right Icon And Content Inside TextInput */}
        <View style={[styles.mr15]}>
          {rightAccessory ? rightAccessory() : null}
        </View>
      </View>
      {/* Error Text Message Of Input */}
      {!!_errorText?.length ? (
        <CText
          type={'r12'}
          style={{
            ...localStyle.errorText,
            ...errorStyle,
            color: colors.redColor,
          }}>
          {_errorText}
        </CText>
      ) : null}

      {_maxLength && showError && _value?.length > _maxLength ? (
        <CText style={{...localStyle.errorText, ...errorStyle}}>
          It should be maximum {_maxLength} character
        </CText>
      ) : null}
    </View>
  );
};

const localStyle = StyleSheet.create({
  labelText: {
    textAlign: 'left',
    opacity: 0.9,
  },
  inputBox: {
    ...typography.fontSizes.f16,
    ...typography.fontWeights.Regular,
    ...styles.ph15,
    ...styles.flex,
  },
  inputContainer: {
    borderRadius: moderateScale(10),
    ...styles.rowSpaceBetween,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#1E9BD4',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 7,
        shadowColor: '#1E9BD4',
      },
    }),
  },
  labelContainer: {
    ...styles.mt10,
    ...styles.rowSpaceBetween,
    ...styles.mb5,
  },
  errorText: {
    textAlign: 'left',
    ...styles.mt5,
    ...styles.ml10,
  },
});
