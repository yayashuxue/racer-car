export const MuiTableContainerLight = {
  MuiTableContainer: {
    styleOverrides: {
      root: {
        borderRadius: '20px',
        border: '1.5px solid #000000',
        boxShadow: '0px 8px #3D7AFB',
      },
    },
  },
};
export const MuiTableContainerDark = {
  MuiTableContainer: {
    styleOverrides: {
      root: {
        borderRadius: '20px',
        border: '1.5px solid #ffffff',
        boxShadow: '0px 8px #0052FF',
        ' .MuiTableBody-root .MuiTableRow-root:last-child .MuiTableCell-root': {
          border: 'none',
        },
      },
    },
  },
};
