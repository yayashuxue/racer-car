import { Box, BoxProps, styled } from '@mui/material';

export function numberToCard(cardNumber: number): PokerCard {
  const suits: Suit[] = ['H', 'S', 'C', 'D'];
  const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  const suit = suits[Math.floor(cardNumber / 13)];
  const rank = ranks[cardNumber % 13];

  return `${rank}${suit}` as PokerCard;
}

type Suit = 'C' | 'D' | 'H' | 'S';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export type PokerCard = `${Rank}${Suit}`;
type Props = {
  card?: PokerCard;
  isOpen?: boolean;
} & BoxProps;

export const Card = ({ card, isOpen, ...props }: Props) => {
  return (
    // <Box {...props}>
    //   <img src={`/cards/${card}.png`} style={{ width: '100%', height: '100%' }} />
    // </Box>
    <Box width={65}>
      {isOpen ? (
        <img
          src={`/cards/${card}.png`}
          style={{ width: '100%', height: '100%', border: '1px solid black', borderRadius: '4px' }}
        />
      ) : (
        <img src={`/cards/default-card.png`} style={{ width: '100%', height: '100%' }} />
      )}
    </Box>
  );
};
