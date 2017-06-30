const DARK_1 = '#121212';
const DARK_2 = '#181818';
const DARK_3 = '#282828';
const DARK_4 = '#ededed';

const MUTE_1 = '#a0a0a0';
const MUTE_2 = '#282828';
const MUTE_3 = '#404040';
const MUTE_4 = '#343533';
const MUTE_5 = '#ececec';
const MUTE_6 = '#9d9d9d';
const MUTE_7 = '#a1a1a1';
const MUTE_8 = '#4e4e4e';

const WHITE_1 = '#ffffff';
const WHITE_2 = '#f7f7f7';

const GREEN_1 = '#1ed660';
const PINK_1 = '#f94263';

module.exports = {
  darkTheme: {
    primary: GREEN_1,

    navbarBackground: DARK_1,
    navbarText: MUTE_1,
    navbarTextActive: WHITE_1,

    listBackground: DARK_2,
    listBackgroundHover: MUTE_2,
    listDivider: MUTE_2,
    listText: WHITE_1,
    listTextMute: MUTE_1,
    listTextActive: GREEN_1,

    controlBackground: DARK_3,
    controlText: WHITE_1,
    controlMute: MUTE_1,
  },

  lightTheme: {
    primary: PINK_1,

    navbarBackground: WHITE_2,
    navbarText: MUTE_3,
    navbarTextActive: MUTE_2,

    listBackground: WHITE_1,
    listBackgroundHover: DARK_4,
    listDivider: DARK_4,
    listText: MUTE_8,
    listTextMute: MUTE_5,
    listTextActive: PINK_1,

    controlBackground: DARK_4,
    controlText: MUTE_8,
    controlMute: MUTE_7,
  },
};
