export const MuiOutlinedInputLight = {
  MuiOutlinedInput: {
    defaultProps: {},
    styleOverrides: {
      root: {
        position: 'relative', // Ensure proper stacking
        border: '1px solid #000000',
        boxShadow: '0px 4px #000000',
        borderRadius: '8px',
        fontFamily: 'Aldrich',
        backgroundColor: 'white',
        color: 'black',
        '& .MuiInputBase-input': {
          padding: '18px 14px', // Comfortable padding for input
        },
        '& .MuiInputLabel-outlined': {
          transform: 'translate(14px, 20px) scale(1)', // Default position (no input)
          '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -2px) scale(0.75)', // Corrected shrunk position
          },
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
      },
    },
  },
};

export const MuiOutlinedInputDark = {
  MuiOutlinedInput: {
    defaultProps: {},
    styleOverrides: {
      root: {
        position: 'relative', // Ensure proper stacking
        border: '1px solid #FFFFFFE5',
        boxShadow: '0px 4px #0052FF',
        borderRadius: '8px',
        fontFamily: 'Aldrich',
        backgroundColor: 'black',
        color: 'white',
        '& .MuiInputBase-input': {
          padding: '18px 14px', // Comfortable padding for input
        },
        '& .MuiInputLabel-outlined': {
          transform: 'translate(14px, 20px) scale(1)', // Default position (no input)
          '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -2px) scale(0.75)', // Corrected shrunk position
          },
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
      },
    },
  },
};
