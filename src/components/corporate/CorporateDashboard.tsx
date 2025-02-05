import { Card, Grid } from '@mui/material'
import OrganizationSwitcher from './OrganizationSwitcher'

interface CorporateDashboardProps {
  organizationId: string
}

export default function CorporateDashboard({ organizationId }: CorporateDashboardProps) {
  // TODO: organizationId will be used for fetching organization-specific data
  // when implementing activity feed, quick actions, and usage charts
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <OrganizationSwitcher />
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <h2>Recent Activity</h2>
          {/* Activity feed component will go here */}
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <h2>Quick Actions</h2>
          {/* Quick action buttons will go here */}
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <h2>Usage Overview</h2>
          {/* Usage charts will go here */}
        </Card>
      </Grid>
    </Grid>
  )
}
