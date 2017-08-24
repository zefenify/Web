const DARK_1 = '#121212';
const DARK_2 = '#181818';
const DARK_3 = '#282828';
const DARK_4 = '#ededed';
const DARK_5 = '#657786';
const DARK_6 = '#000000';

const MUTE_1 = '#a0a0a0';
const MUTE_2 = '#282828';
const MUTE_3 = '#404040';
const MUTE_4 = '#ececec';
const MUTE_5 = '#a1a1a1';
const MUTE_6 = '#4e4e4e';

const WHITE_1 = '#ffffff';
const WHITE_2 = '#f7f7f7';
const WHITE_3 = '#d8d8d8';

const GREEN_1 = '#1ed660';
const BLUE_1 = '#31a8e6';

module.exports = {
  darkTheme: {
    primary: GREEN_1,

    navbarBackground: DARK_1,
    navbarText: MUTE_1,
    navbarTextActive: WHITE_1,
    navBarBoxShadow: DARK_6,

    listBackground: DARK_2,
    listBackgroundHover: MUTE_2,
    listDivider: MUTE_2,
    listText: WHITE_1,
    listTextMute: MUTE_1,
    listTextActive: GREEN_1,
    listBoxShadow: DARK_6,

    controlBackground: DARK_3,
    controlText: WHITE_1,
    controlMute: MUTE_1,
  },

  lightTheme: {
    primary: BLUE_1,

    navbarBackground: WHITE_2,
    navbarText: MUTE_3,
    navbarTextActive: MUTE_2,
    navBarBoxShadow: WHITE_3,

    listBackground: WHITE_1,
    listBackgroundHover: DARK_4,
    listDivider: DARK_4,
    listText: MUTE_6,
    listTextMute: MUTE_4,
    listTextActive: BLUE_1,
    listBoxShadow: DARK_5,

    controlBackground: DARK_4,
    controlText: MUTE_6,
    controlMute: MUTE_5,
  },
};
