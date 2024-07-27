import {apiUrl} from "config";

export async function getTableData(tableId: string) {
  try {
    const response = await fetch(`${apiUrl}/getTable?table_id=${tableId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.table_info;
  } catch (error) {
    throw error;
  }
}