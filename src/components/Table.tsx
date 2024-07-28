import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import BigNumber from 'bignumber.js';
import Link from 'next/link';
import { TableData } from 'pages';
import * as React from 'react';
import Image from 'next/image';

import { useRouter } from 'next/router';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { maskAddress } from 'src/utils/maskAddress';
type LobbyTableProps = {
  data: TableData[];
};
interface Column {
  id: 'room' | 'status' | 'bbSize' | 'minBuyIn' | 'actions';
  label?: string;
  minWidth?: number;
  width?: number;
  align?: 'right' | 'center' | 'left';
  render?: (value: TableData) => React.ReactNode;
}

const TextWithDot = styled(Typography)`
  position: relative;
  display: inline;
  font-size: 14px;
  &:after {
    content: '';
    position: absolute;
    top: -8px;
    right: 0;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #c1357d;
  }
`;

export interface LeaderboardData {
  address: string;
  balance: number;
  twitter?: string;
}

interface LeaderboardTableProps {
  data: LeaderboardData[];
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ data }) => {
  // Sort data by balance in descending order
  const sortedData = [...data].sort((a, b) => b.balance - a.balance);
  const theme = useTheme();
  const router = useRouter();
  return (
    <TableContainer sx={{ maxHeight: '65vh' }}>
      <Table stickyHeader aria-label='sticky table'>
        <TableHead style={{ backgroundColor: theme.palette.background.paper, zIndex: -1 }}>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Profile</TableCell>
            <TableCell>HighScore ⛽️</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row, index) => {
            return (
              <TableRow
                key={index}
                hover
                onClick={() => router.push(`/profile?address=${row.address}`)}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.twitter ? `@${row.twitter}` : maskAddress(row.address)}</TableCell>
                <TableCell>{row.points}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const LobbyTable: React.FC<LobbyTableProps> = ({ data }) => {
  const theme = useTheme();
  const isLightTheme = theme.palette.mode === 'light';

  const columns: Column[] = [
    {
      id: 'room',
      label: '',
      minWidth: 0,
      align: 'center',
      render: (row: any) => `#${row.tableId}`,
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 90,
      align: 'center',
      render: (row: any) =>
        row.numSeats !== row.numPlayers ? (
          <TextWithDot>{`${row.numPlayers}/${row.numSeats}`}</TextWithDot>
        ) : (
          `${row.numPlayers}/${row.numSeats}`
        ),
    },
    {
      id: 'bbSize',
      label: 'SB/BB Size',
      minWidth: 90,
      render: (row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <span style={{ lineHeight: '14px', marginTop: '3px' }}>
            {row.sbSize}/{row.bbSize}
          </span>
          {'   '}
          ⛽️
        </div>
      ),
      align: 'right',
    },
    {
      id: 'minBuyIn',
      label: 'Buy-In Limit',
      minWidth: 90,
      render: (row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <span style={{ lineHeight: '14px', marginTop: '3px' }}>
            {row.minBuyin}/{row.maxBuyin}
          </span>
          {'   '}
          ⛽️
        </div>
      ),
      align: 'right',
    },
    {
      id: 'actions',
      align: 'center',
      width: 40,
      render: (row: any) => (
        <Link href={`/join/${row.tableId}`}>
          <IconButton sx={{ width: 25, height: 25 }}>
            <ChevronRightIcon />
          </IconButton>
        </Link>
      ),
    },
  ];

  const router = useRouter();

  return (
    <TableContainer sx={{ maxHeight: '64vh' }}>
      <Table stickyHeader aria-label='sticky table'>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth, width: column.width }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => {
            return (
              <TableRow
                key={row.tableId}
                onClick={(event) => {
                  event.stopPropagation();
                  router.push(`/join/${row.tableId}`);
                }}
                sx={{ cursor: 'pointer' }}
              >
                {columns.map((column) => {
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.render ? column.render(row) : row[column.id as keyof TableData]}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
