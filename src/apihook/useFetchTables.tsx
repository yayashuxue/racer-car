import {apiUrl} from 'config';
import { useState, useEffect, useCallback } from 'react';

export const useFetchTables = (setData: (tables: any[]) => void) => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchTables = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/getTables`);
      const data = await response.json();
      const tablesData = data.tables.map((table: any) => ({
        tableId: table.tableId,
        numPlayers: table.numPlayers,
        numSeats: table.numSeats,
        bbSize: table.bigBlind,
        sbSize: table.smallBlind,
        minBuyin: table.minBuyin,
        maxBuyin: table.maxBuyin,
      }));
      setData(tablesData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [setData]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  return { isLoading, fetchTables };
};
