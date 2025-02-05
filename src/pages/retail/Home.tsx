import {
  Security as SecurityIcon,
  LocalShipping as ShippingIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    title: 'Fast Delivery',
    description: 'Same-day delivery available for local shipments. Next-day delivery for most domestic locations.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: 'Secure Shipping',
    description: 'End-to-end package tracking and insurance coverage for peace of mind.',
  },
  {
    icon: <ShippingIcon sx={{ fontSize: 40 }} />,
    title: 'Flexible Options',
    description: 'Choose from various shipping speeds and pricing options to suit your needs.',
  },
  {
    icon: <SupportIcon sx={{ fontSize: 40 }} />,
    title: '24/7 Support',
    description: 'Round-the-clock customer service to assist you with any questions or concerns.',
  },
]

export default function RetailHome() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 8,
          mb: 6,
          borderRadius: 2,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              fontSize: { xs: '2.5rem', md: '3.75rem' },
            }}
          >
            Ship with Confidence
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              mb: 4,
              textAlign: 'center',
              fontWeight: 300,
            }}
          >
            Fast, reliable, and secure shipping solutions for everyone
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              component={Link}
              to="/retail/book"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ minWidth: 200 }}
            >
              Book a Delivery
            </Button>
            <Button
              component={Link}
              to="/retail/track"
              variant="outlined"
              color="inherit"
              size="large"
              sx={{ minWidth: 200 }}
            >
              Track Package
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {features.map(feature => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Card
                sx={{
                  'height': '100%',
                  'display': 'flex',
                  'flexDirection': 'column',
                  'transition': 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 2,
                      color: 'primary.main',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h3"
                    align="center"
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" sx={{ ml: 'auto', mr: 'auto' }}>
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
