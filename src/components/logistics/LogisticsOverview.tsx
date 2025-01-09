import { useState, useEffect } from 'react';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useNotification from '../common/NotificationService';
import { getLogistics } from '../../services/logistics';

import { LogisticsItem } from '../../types/logistics';

const columns: GridColDef[] = [
  { field: 'shipmentId', headerName: 'Shipment ID', width: 150 },
  { field: 'origin', headerName: 'Origin', width: 200 },
  { field: 'destination', headerName: 'Destination', width: 200 },
  { field: 'status', headerName: 'Status', width: 150 },
  { field: 'estimatedArrival', headerName: 'ETA', width: 150 },
];

export default function LogisticsOverview() {
  const [logistics, setLogistics] = useState<LogisticsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { notifyError } = useNotification();

  useEffect(() => {
    const fetchLogistics = async () => {
      try {
        setLoading(true);
        const data = await getLogistics();
        setLogistics(data);
      } catch (error) {
        notifyError('Failed to load logistics data');
        console.error('Error fetching logistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogistics();
  }, []);

  return (
    <Card>
      <Box p={3}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h5">Logistics Overview</Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary">
              New Shipment
            </Button>
          </Grid>
        </Grid>

        <Box mt={3} sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={logistics}
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
