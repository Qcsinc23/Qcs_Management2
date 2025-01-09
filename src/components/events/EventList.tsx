import { useState, useEffect } from 'react';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useNotification from '../common/NotificationService';
import { getEvents } from '../../services/events';

import { Event } from '../../types/event';

const columns: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 200 },
  { field: 'startDate', headerName: 'Start Date', width: 150 },
  { field: 'endDate', headerName: 'End Date', width: 150 },
  { field: 'location', headerName: 'Location', width: 200 },
  { field: 'status', headerName: 'Status', width: 150 },
];

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const { notifyError } = useNotification();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        notifyError('Failed to load events');
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Card>
      <Box p={3}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h5">Events</Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary">
              Create Event
            </Button>
          </Grid>
        </Grid>

        <Box mt={3} sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={events}
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
