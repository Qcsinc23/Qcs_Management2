import { Box, Container, Typography } from '@mui/material'
import PackageTracking from '../../components/retail/PackageTracking'

export default function Track() {
  return (
    <Box>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            textAlign: 'center',
            mb: 4,
            fontWeight: 600,
          }}
        >
          Track Your Package
        </Typography>
        <PackageTracking />
      </Container>
    </Box>
  )
}
