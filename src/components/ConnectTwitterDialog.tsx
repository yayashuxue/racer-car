import { usePrivy } from '@privy-io/react-auth';
import { Dialog, DialogContent, Box, Typography, Button } from '@mui/material';
import { CloseDialogButton } from './CloseDialogButton';

function ConnectTwitterDialog({ open, close }: { open: boolean, close: () => void }) {
  const { ready, authenticated, user, linkTwitter } = usePrivy();

  return (
    <Dialog disableEnforceFocus open={open} PaperProps={{}}>
      <CloseDialogButton handleClose={close} />
      <DialogContent>
        <Box p={{ xs: 2, md: 4, textAlign: 'center' }} pb={{ xs: 0.5, md: 1 }}>
          <Typography fontSize={20}>Link Twitter</Typography>
            <Box py={2}>
              <Typography mb={2}>Link your Twitter to get a free NFT & Token!</Typography>
              <Button variant='contained' onClick={linkTwitter}>
                  Link Twitter
              </Button>
            </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default ConnectTwitterDialog;
