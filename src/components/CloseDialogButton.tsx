import { IconButton, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  handleClose: () => void;
};

export const CloseDialogButton = ({ handleClose }: Props) => {
  const theme = useTheme();
  return (
    <IconButton
      sx={{
        position: 'absolute',
        top: 8,
        right: 8,
        background: 'transparent',
        boxShadow: 'none',
        border: 'none',
        zIndex: 3,
      }}
      onClick={handleClose}
    >
      <CloseIcon sx={{ color: theme.palette.text.primary }} />
    </IconButton>
  );
};
