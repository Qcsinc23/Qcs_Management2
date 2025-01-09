import { useState, useEffect } from 'react';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useNotification from '../common/NotificationService';
import { getInventory } from '../../services/inventory';

import { InventoryItem } from '../../types/inventory';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'sku', headerName: 'SKU', width: 150 },
  { field: 'quantity', headerName: 'Quantity', width: 150 },
  { field: 'location', headerName: 'Location', width: 200 },
  { field: 'status', headerName: 'Status', width: 150 },
];

export default function InventoryList() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { notifyError } = useNotification();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const data = await getInventory();
        setInventory(data);
      } catch (error) {
        notifyError('Failed to load inventory');
        console.error('Error fetching inventory:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  return (
    <Card>
      <Box p={3}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h5">Inventory</Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary">
              Add Item
            </Button>
          </Grid>
        </Grid>

        <Box mt={3} sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={inventory}
            columns={columns}
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>
    </Card>
  );
}
