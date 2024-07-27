import { get } from 'lodash';
import { WAGMI_ABI, CONTRACT_ADDRESS } from 'src/constants';
import { useSnackBar } from 'src/hook/useSnackBar';
import { useWriteContract } from 'wagmi';

type Props = {
  onSuccess?: () => void;
};

export const useFoldAndLeave = ({ onSuccess }: Props) => {
// export const useFoldAndLeave = () => {
  const { showSuccess, showError } = useSnackBar();

  const {
    writeContract,
    data: hash,
    status,
  } = useWriteContract({
    mutation: {
      onSuccess: (txHash) => {
        showSuccess('Fold and Leave', txHash);
        if (onSuccess) onSuccess();
      },
      onError: (e) => {
        const error = get(e, 'cause.shortMessage', 'Transaction failed');
        showError(error);
      },
    },
  });

  return {
    foldAndLeave: async (tableId: number) => {
      const result = writeContract({
        abi: WAGMI_ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'foldAndLeave',
        args: [BigInt(tableId)],
      });
      return result;
    },
    status,
  };
};