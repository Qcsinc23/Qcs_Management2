import type { GridColDef } from '@mui/x-data-grid'
import type { ReportItem } from '../../types/reports'
import { Box, Card, CircularProgress, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { getReports } from '../../services/reports'
import useNotification from '../common/NotificationService'

const columns: GridColDef[] = [
  { field: 'type', headerName: 'Type', width: 150 },
  { field: 'period', headerName: 'Period', width: 150 },
  { field: 'generatedAt', headerName: 'Generated At', width: 200 },
  { field: 'status', headerName: 'Status', width: 150 },
  { field: 'downloadUrl', headerName: 'Download', width: 150 },
]

export default function ReportsOverview() {
  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)
  const { notifyError } = useNotification()

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports()
        setReports(data)
      }
      catch (error) {
        notifyError('Failed to load reports')
      }
      finally {
        setLoading(false)
      }
    }

    void fetchReports()
  }, [notifyError])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Card>
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          Reports Overview
        </Typography>

        <Box mt={3} sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={reports}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>
    </Card>
  )
}
