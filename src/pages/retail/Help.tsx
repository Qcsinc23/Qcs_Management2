import {
  Email as EmailIcon,
  ExpandMore as ExpandMoreIcon,
  QuestionAnswer as FAQIcon,
  Phone as PhoneIcon,
  Support as SupportIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useTheme,
} from '@mui/material'
import ChatWidget from '../../components/common/ChatWidget'

const faqs = [
  {
    question: 'How do I track my package?',
    answer: 'You can track your package by clicking the "Track Package" button in the navigation bar and entering your tracking number. Our real-time tracking system will show you the current status and location of your delivery.',
  },
  {
    question: 'What shipping options are available?',
    answer: 'We offer three shipping options: Standard Delivery (2-3 business days), Express Delivery (next business day), and Same Day Delivery (within 12 hours, available in select areas).',
  },
  {
    question: 'How do I book a delivery?',
    answer: 'Click the "Book Now" button to start the booking process. Fill in the pickup and delivery details, package information, and select your preferred service options. You can then proceed to payment to confirm your booking.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express). We also offer split payment options for larger orders and corporate accounts.',
  },
  {
    question: 'How does the proof of delivery system work?',
    answer: 'Our proof of delivery system includes digital signature capture and photo verification. The recipient will need to sign for the package, and our driver will take photos as evidence of successful delivery.',
  },
  {
    question: 'What if my package is damaged or lost?',
    answer: 'All shipments include basic insurance coverage. For additional protection, you can opt for extended insurance during booking. Contact our support team immediately if you notice any issues with your delivery.',
  },
]

const contactMethods = [
  {
    icon: <PhoneIcon sx={{ fontSize: 40 }} />,
    title: 'Phone Support',
    description: '1-800-XXX-XXXX\nAvailable 24/7',
  },
  {
    icon: <EmailIcon sx={{ fontSize: 40 }} />,
    title: 'Email',
    description: 'support@qcs.com\nResponse within 24 hours',
  },
  {
    icon: <WhatsAppIcon sx={{ fontSize: 40 }} />,
    title: 'WhatsApp',
    description: '+1 (555) XXX-XXXX\nInstant messaging support',
  },
]

export default function Help() {
  const theme = useTheme()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
        Help Center
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FAQIcon color="primary" />
            Frequently Asked Questions
          </Typography>

          {faqs.map((faq, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight={500}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SupportIcon color="primary" />
            Contact Us
          </Typography>

          {contactMethods.map((method, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: theme.palette.primary.main }}>
                    {method.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {method.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ whiteSpace: 'pre-line' }}
                    >
                      {method.description}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 4 }}
          >
            Need immediate assistance? Use our chat support below!
          </Typography>
        </Grid>
      </Grid>

      <ChatWidget />
    </Container>
  )
}
