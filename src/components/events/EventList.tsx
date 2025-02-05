import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import type { Event } from '../../types/event'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AddIcon from '@mui/icons-material/Add'
import { Box, Grid, Tooltip, Typography } from '@mui/material'
import { isEventEditable, isEventViewable, formatEventDuration } from '../../utils/eventValidation'
import {
  StyledCard,
  StyledTitle,
  StyledButton,
  StyledIconButton,
  StyledStatusChip,
  StyledDataGrid,
} from '../../styles/components'
import { colors } from '../../styles/colors'
import { DataGrid } from '@mui/x-data-grid'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEvents } from '../../services/events'
import useNotification from '../common/NotificationService'

function getStatusColor(status: Event['status']) {
  switch (status) {
    case 'scheduled':
      return 'primary'
    case 'in-progress':
      return 'warning'
    case 'completed':
      return 'success'
    case 'cancelled':
      return 'error'
    default:
      return 'default'
  }
}

function formatTime(time: string) {
  return format(new Date(`2000-01-01T${time}`), 'h:mm a')
}

const columns: GridColDef<Event>[] = [
  {
    field: 'name',
    headerName: 'Event Name',
    width: 200,
    renderCell: (params: GridRenderCellParams<Event>) => (
      <Tooltip title={params.row.name}>
        <Typography noWrap>
          {params.row.name}
        </Typography>
      </Tooltip>
    ),
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 120,
    valueFormatter: ({ value }) => format(new Date(value as string), 'MM/dd/yyyy'),
  },
  {
    field: 'times',
    headerName: 'Times',
    width: 200,
    valueGetter: ({ row }: { row: Event }) => row,
    renderCell: (params: GridRenderCellParams<Event>) => (
      <Box>
        <Typography variant="caption" display="block">
          Start:
          {formatTime(params.row.startTime)}
        </Typography>
        <Typography variant="caption" display="block" color="textSecondary">
          Drop-off:
          {formatTime(params.row.dropOffTime)}
        </Typography>
        <Typography variant="caption" display="block" color="textSecondary">
          Pickup:
          {formatTime(params.row.pickupTime)}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'venue',
    headerName: 'Venue',
    width: 200,
    valueGetter: ({ row }: { row: Event }) => row.venue,
    renderCell: (params: GridRenderCellParams<Event>) => (
      <Tooltip title={`${params.row.venue.name}, ${params.row.venue.address}`}>
        <Typography noWrap>
          {params.row.venue.name}
        </Typography>
      </Tooltip>
    ),
  },
  {
    field: 'client',
    headerName: 'Client',
    width: 150,
    valueGetter: ({ row }: { row: Event }) => row.client,
    renderCell: (params: GridRenderCellParams<Event>) => (
      <Tooltip title={`ID: ${params.row.client.id}`}>
        <Typography noWrap>
          {params.row.client.name}
        </Typography>
      </Tooltip>
    ),
  },
  {
    field: 'contacts',
    headerName: 'Contacts',
    width: 200,
    valueGetter: ({ row }: { row: Event }) => row.contacts,
    renderCell: (params: GridRenderCellParams<Event>) => (
      <Box>
        <Typography variant="caption" display="block">
          On-site:
          {params.row.contacts.onsite.name}
        </Typography>
        <Typography variant="caption" display="block">
          Manager:
          {params.row.contacts.manager.name}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params: GridRenderCellParams<Event>) => {
      const status = params.value as Event['status'];
      return (
        <StyledStatusChip
          label={status}
          className={`status-${status}`}
          size="small"
        />
      );
    },
  },
  {
    field: 'duration',
    headerName: 'Duration',
    width: 120,
    valueGetter: ({ row }: { row: Event }) => formatEventDuration(row),
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 120,
    sortable: false,
    renderCell: (params: GridRenderCellParams<Event>) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title="View Details">
          <span>
            <StyledIconButton
              size="small"
              onClick={() => handleViewDetails(params.row.id)}
              disabled={!isEventViewable(params.row)}
            >
              <VisibilityIcon fontSize="small" />
            </StyledIconButton>
          </span>
        </Tooltip>
        <Tooltip title="Edit Event">
          <span>
            <StyledIconButton
              size="small"
              onClick={() => handleEditEvent(params.row.id)}
              disabled={!isEventEditable(params.row)}
            >
              <EditIcon fontSize="small" />
            </StyledIconButton>
          </span>
        </Tooltip>
      </Box>
    ),
  },
]

export default function EventList() {
  const navigate = useNavigate()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const { notifyError } = useNotification()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const data = await getEvents()
        setEvents(data)
      }
      catch (error) {
        notifyError('Failed to load events')
        console.error('Error fetching events:', error)
      }
      finally {
        setLoading(false)
      }
    }

    void fetchEvents()
  }, [notifyError])

  const handleCreateEvent = () => {
    navigate('/booking', { replace: true })
  }

  const handleViewDetails = (eventId: string) => {
    // Will be implemented in future update
    notifyError('Event details view is coming soon')
  }

  const handleEditEvent = (eventId: string) => {
    // Will be implemented in future update
    notifyError('Event editing is coming soon')
  }
return (
  <StyledCard>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <StyledTitle variant="h5">Events</StyledTitle>
          </Grid>
          <Grid item>
            <StyledButton
              variant="contained"
              color="primary"
              onClick={handleCreateEvent}
              startIcon={<AddIcon />}
            >
              Create Event
            </StyledButton>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <StyledDataGrid sx={{ height: 600 }}>
          <DataGrid<Event>
            rows={events}
            columns={columns}
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
              sorting: {
                sortModel: [{ field: 'date', sort: 'desc' }],
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            getRowHeight={() => 'auto'}
            sx={{
              '& .MuiDataGrid-cell': {
                py: 1.5,
                px: 2,
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: colors.background.subtle,
                borderBottom: `1px solid ${colors.neutral[200]}`,
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: colors.background.subtle,
              },
            }}
            slots={{
              loadingOverlay: () => (
                <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <StyledTitle variant="h6" sx={{ ml: 2 }}>Loading events...</StyledTitle>
                  </Box>
                </Box>
              ),
              noRowsOverlay: () => (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                  gap={2}
                  sx={{ p: 3 }}
                >
                  <StyledTitle variant="h6" color="text.secondary">
                    No events found
                  </StyledTitle>
                  <StyledButton
                    variant="outlined"
                    color="primary"
                    onClick={handleCreateEvent}
                    startIcon={<AddIcon />}
                    size="small"
                  >
                    Create your first event
                  </StyledButton>
                </Box>
              ),
            }}
          />
        </StyledDataGrid>
      </Grid>
    </Grid>
  </StyledCard>
);
}
