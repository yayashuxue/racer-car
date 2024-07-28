import { PaletteMode } from '@mui/material';
import { amber, grey, deepOrange } from '@mui/material/colors';
import zIndex from '@mui/material/styles/zIndex';
import { MuiButtonDark, MuiButtonLight } from 'src/theme/MuiButton';
import { MuiButtonGroupDark, MuiButtonGroupLight } from 'src/theme/MuiButtonGroup';
import { MuiDialogDark, MuiDialogLight } from 'src/theme/MuiDialog';
import { MuiIconButtonDark, MuiIconButtonLight } from 'src/theme/MuiIconButton';
import { MuiSliderDark, MuiSliderLight } from 'src/theme/MuiSlider';
import { MuiTableCellDark, MuiTableCellLight } from 'src/theme/MuiTableCell';
import { MuiTableContainerDark, MuiTableContainerLight } from 'src/theme/MuiTableContainer';
import { MuiOutlinedInputLight, MuiOutlinedInputDark } from 'src/theme/MuiTextField';

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: {
            main: '#6999FF',
          },

          text: { primary: '#000000' },
        }
      : {
          // palette values for dark mode
          primary: {
            main: '#0052FF',
          },

          text: { primary: '#F2F4F5' },
        }),
  },
  typography: {
    fontFamily: [
      'Aldrich',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  components: {
    ...(mode === 'light'
      ? {
          ...MuiButtonLight,
          ...MuiButtonGroupLight,
          ...MuiTableContainerLight,
          ...MuiIconButtonLight,
          ...MuiTableCellLight,
          ...MuiDialogLight,
          ...MuiOutlinedInputLight,
          ...MuiSliderLight,
        }
      : {
          ...MuiButtonDark,
          ...MuiButtonGroupDark,
          ...MuiTableContainerDark,
          ...MuiIconButtonDark,
          ...MuiTableCellDark,
          ...MuiDialogDark,
          ...MuiOutlinedInputDark,
          ...MuiSliderDark,
        }),
  },
});