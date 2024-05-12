//App colors
const LightColor = {
  light: 'light',
  placeholderColor: '#FFFFFF',
  textColor: '#FFFFFF',
  btnColor: '#0F5CA8',
  tabBarColor: '#FFFFFF',
  mainColor: '#0F5CA8',
};

const DarkColor = {
  dark: 'dark',
  backgroundColor: '#000000',
  placeholderColor: '#002029',
  textColor: '#1DFBD3',
  btnColor: '#002029',
  tabBarColor: '#1E9BD4',
  mainColor:'#FFFFFF'
};

// Common colors
export const commonColor = {
  white: '#FFFFFF',
  black: '#000000',
  primary: '#0F5CA8',
  primaryLight: '#0F5CA8',
  grayScale5: '#9E9E9E',
  grayScale4: '#BDBDBD',
  grayScale3: '#E0E0E0',
  redColor: '#F75555',
  addPostBtn: '#002029',
  linearColor1: '#1245A4',
  dotColor: '#FF4141',
  pinnedColor: 'rgba(30, 155, 212, 0.2)',
  modalBackground: 'rgba(118,118,118,0.7)',
};

export const colors = {
  light: {
    ...LightColor,
    ...commonColor,
  },

  dark: {
    ...DarkColor,
    ...commonColor,
  },
};
