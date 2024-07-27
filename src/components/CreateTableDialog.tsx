import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
  Collapse,
  Autocomplete,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { CloseDialogButton } from 'src/components/CloseDialogButton';
import * as z from 'zod';
import { useState } from 'react';
import { maskAddress } from 'src/utils/maskAddress';
import { readContract } from '@wagmi/core';
import { config } from 'config';
const ERC20_ABI = ['function symbol() external view returns (string)'];

const schema = z.object({
  tokenAddress: z.string().nonempty({ message: 'Required' }),
  smallBlind: z.number().min(1, { message: 'Required' }),
  bigBlind: z.number().min(1, { message: 'Required' }),
  minBuyIn: z.number().min(1, { message: 'Required' }),
  maxBuyIn: z.number().min(1, { message: 'Required' }),
  maxPlayers: z.number().min(2, { message: 'Required' }),
});

type Props = {
  open: boolean;
  handleClose: () => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
};


async function getSymbol(address: `0x${string}`) {
  const result = await readContract(config, {
    abi: ERC20_ABI,
    address: address,
    functionName: 'symbol',
    args: [],
  });

  return result;
}

export const CreateTableDialog = ({ open, handleClose, showSuccess, showError }: Props) => {
  const theme = useTheme();
    const [error, setError] = useState('');

  const [showAdvanced, setShowAdvanced] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      tokenAddress: '',
      smallBlind: 1,
      bigBlind: 2,
      minBuyIn: 100,
      maxBuyIn: 1000,
      maxPlayers: 6,
    },
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    showSuccess('Table opened successfully!');
    handleClose();
  };
  // Assuming maskAddress function is defined elsewhere in the file
  // const maskAddress = (address) => `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

  const tokenOptions = [
    { label: 'Nouns', value: '0xbd146245d19a736d168558d13aB9445afF09A2d9' },
    { label: 'Ape', value: '0xa7a0124fb6298f6e6cC1899Ad13B455bF55f9cbb' },
  ].map((option) => ({ ...option, label: `${option.label} (${maskAddress(option.value)})` }));

  // The rest of the component remains unchanged
  return (
    <Dialog open={open} onClose={handleClose}>
      <CloseDialogButton handleClose={handleClose} />
      <DialogContent>
        <Box component='form' onSubmit={handleSubmit(onSubmit)} p={3}>
          <Typography variant='h6' mb={2}>
            Open a New Table
          </Typography>
          <Controller
            name='tokenAddress'
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                freeSolo
                options={tokenOptions}
                getOptionLabel={(option: any) =>
                  typeof option === 'string' ? option : option.label
                }
                value={field.value || ''}
                onChange={async (event, newValue) => {
                  setError(''); // Reset error message
                  if (typeof newValue === 'string') {
                    if (/^0x[a-fA-F0-9]{40}$/.test(newValue)) {
                      try {
                        const symbol = await getSymbol(newValue as `0x${string}`);
                        console.log(`Token symbol: ${symbol}`); // For debugging, replace with your logic to display the symbol
                        field.onChange(newValue); // Valid ERC20 token address
                      } catch (error) {
                        setError('The entered address is not a valid ERC20 token address.');
                        field.onChange(''); // Clear the field
                      }
                    } else {
                      setError('The entered address is not a valid Ethereum address.');
                      field.onChange(''); // Clear the field
                    }
                  } else if (typeof newValue === 'object' && newValue !== null) {
                    field.onChange(newValue.value); // Use the value property for objects from tokenOptions
                  } else {
                    field.onChange(''); // Clear the field for any other case
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='ERC Token Address'
                    fullWidth
                    error={!!error}
                    helperText={error}
                  />
                )}
              />
            )}
          />
          <Box display='flex' justifyContent='space-between' mb={2}>
            <TextField
              label='Small Blind'
              type='number'
              {...register('smallBlind')}
              fullWidth
              margin='normal'
              InputProps={{
                endAdornment: <InputAdornment position='end'>Chips</InputAdornment>,
              }}
              sx={{ width: '48%' }}
            />
            <TextField
              label='Big Blind'
              type='number'
              {...register('bigBlind')}
              fullWidth
              margin='normal'
              InputProps={{
                endAdornment: <InputAdornment position='end'>Chips</InputAdornment>,
              }}
              sx={{ width: '48%' }}
            />
          </Box>
          <Button onClick={() => setShowAdvanced(!showAdvanced)} sx={{ mb: 2 }}>
            {showAdvanced ? 'Hide Advanced' : 'Advanced Setting'}
          </Button>
          <Collapse in={showAdvanced}>
            <Box display='flex' justifyContent='space-between' mb={2}>
              <TextField
                label='Minimum Buy-In'
                type='number'
                {...register('minBuyIn')}
                fullWidth
                margin='normal'
                sx={{ width: '48%' }}
              />
              <TextField
                label='Maximum Buy-In'
                type='number'
                {...register('maxBuyIn')}
                fullWidth
                margin='normal'
                sx={{ width: '48%' }}
              />
            </Box>
            <Controller
              name='maxPlayers'
              control={control}
              render={({ field }) => (
                <Select {...field} label='Max Players' fullWidth>
                  {[2, 6, 9].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </Collapse>
          <Box mt={2} display='flex' justifyContent='space-between'>
            <Button onClick={handleClose} variant='outlined'>
              Cancel
            </Button>
            <Button type='submit' variant='contained' color='primary'>
              Open Table
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
