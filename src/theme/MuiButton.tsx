export const MuiButtonLight = {
  MuiButton: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: '#4377E4',
          boxShadow: '0px 4px #000000',
        },
        '&:active': {
          backgroundColor: '#6999FF',
          boxShadow: '0px 4px #000000',
        },
        '&.Mui-disabled': {
          backgroundColor: '#DEE8FF',
          color: '#5E6779',
          boxShadow: '0px 4px #6999FF',
        },
        border: '1px solid #000000',
        boxShadow: '0px 4px #000000',
        borderRadius: '4px',
        fontFamily: 'Aldrich',
        backgroundColor: '#6999FF',
        color: 'black',
      },
      outlined: {
        backgroundColor: 'white',
      },
      text: {
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
      },
    },
  },
};
export const MuiButtonDark = {
  MuiButton: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: '#3D7AFB',
          boxShadow: '0px 4px #0052FF',
        },
        '&:active': {
          backgroundColor: '#272DD7',
          boxShadow: '0px 4px #0052FF',
        },
        '&.Mui-disabled': {
          backgroundColor: '#272DD7',
          color: '#FFFFFFB2',
          boxShadow: '0px 4px #272DD7',
        },
        border: '1px solid #FFFFFFE5',
        boxShadow: '0px 4px #0052FF',
        borderRadius: '4px',
        fontFamily: 'Aldrich',
        backgroundColor: '#0052FF',
        color: 'white',
      },
      outlined: {
        backgroundColor: 'white',
        color: 'black',
      },
      text: {
        backgroundColor: 'transparent !important',
        border: 'none',
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
        },
        '&:active': {
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
        },
      },
    },
  },
};
