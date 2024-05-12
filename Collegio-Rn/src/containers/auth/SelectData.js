import {Image, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';

//custom imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import CHeader from '../../components/common/CHeader';
import {styles} from '../../themes';
import {moderateScale} from '../../common/constants';
import images from '../../assets/images';
import CText from '../../components/common/CText';
import strings from '../../i18n/strings';
import CDropdown from '../../components/common/CDropdown';
import {countryData, instituteData, studyingData} from '../../api/constant';
import CButton from '../../components/common/CButton';
import {AuthNav, StackNav} from '../../navigation/NavigationKeys';
import {StoreLoginData} from '../../utils/asyncstorage';

export default function SelectData({route, navigation}) {
  const title = route?.params?.title;
  const [country, setCountry] = useState('');
  const [institute, setInstitute] = useState('');
  const [degree, setDegree] = useState('');

  const onChangeCountry = item => {
    setCountry(item);
  };

  const onChangeInstitute = item => {
    setInstitute(item);
  };

  const onChangeDegree = item => {
    setDegree(item);
  };

  const onPressNext = async () => {
    if (!!title) {
      navigation.navigate(AuthNav.InstituteDetail);
    } else {
      await StoreLoginData(true);
      navigation.reset({
        index: 0,
        routes: [{name: StackNav.TabBar}],
      });
    }
  };

  return (
    <CSafeAreaView>
      <View style={styles.ph20}>
        <CHeader />
        <Image source={images.logo} style={localStyles.logoImgStyle} />
        <CText
          type={'r14'}
          align={'center'}
          style={styles.mb20}
          numberOfLines={2}>
          {strings.selectDes}
        </CText>
        <CDropdown
          data={countryData}
          value={country}
          onChange={onChangeCountry}
          placeholder={strings.country}
        />
        <CDropdown
          data={instituteData}
          placeholder={strings.institutePc}
          value={institute}
          onChange={onChangeInstitute}
        />
        <CDropdown
          data={studyingData}
          placeholder={strings.study}
          value={degree}
          onChange={onChangeDegree}
        />
        <CButton title={strings.next} textType={'s18'} onPress={onPressNext} />
      </View>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  logoImgStyle: {
    width: moderateScale(80),
    height: '25%',
    resizeMode: 'contain',
    ...styles.selfCenter,
    ...styles.mt35,
  },
});
