export const MuiSliderLight = {
  MuiSlider: {
    styleOverrides: {
      root: {
        '.MuiSlider-rail': {
          backgroundColor: '#000000',
          opacity: 1,
          boxShadow: '0px 2px #6999FF',
          height: 4,
        },
        '.MuiSlider-track': {
          backgroundColor: 'transparent',
        },
        '.MuiSlider-thumb::before': {
          backgroundColor: '#000000',
          border: '4px solid #6999FF',
          outline: '1px solid #000000',
        },
      },
    },
  },
};
export const MuiSliderDark = {
  MuiSlider: {
    styleOverrides: {
      root: {
        '.MuiSlider-rail': {
          backgroundColor: '#ffffff',
          opacity: 1,
          boxShadow: '0px 2px #0052FF',
          height: 4,
        },
        '.MuiSlider-track': {
          backgroundColor: 'transparent',
        },
        '.MuiSlider-thumb::before': {
          backgroundColor: '#ffffff',
          border: '4px solid #0052FF',
          outline: '1px solid #ffffff',
        },
      },
    },
  },
};
