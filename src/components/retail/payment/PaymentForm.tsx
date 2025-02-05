import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useState } from 'react'

// Initialize Stripe (in production, move this to an environment variable)
const stripePromise = loadStripe('your_publishable_key')

interface PaymentFormProps {
  amount: number
  onSuccess: (paymentId: string) => void
  onError: (error: string) => void
}

function PaymentFormContent({ amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [splitPayment, setSplitPayment] = useState(false)
  const [splitDetails, setSplitDetails] = useState({
    numberOfPayments: 2,
    firstPayment: amount / 2,
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)
    setError(null)

    try {
      const cardElement = elements.getElement(CardElement)
      if (!cardElement)
        throw new Error('Card element not found')

      // Create payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          email,
        },
      })

      if (stripeError) {
        throw new Error(stripeError.message)
      }

      if (!paymentMethod) {
        throw new Error('Payment failed')
      }

      // In a real application, you would send this to your server
      // to create a payment intent and confirm the payment
      await new Promise(resolve => setTimeout(resolve, 1000))

      onSuccess(paymentMethod.id)
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed'
      setError(errorMessage)
      onError(errorMessage)
    }
    finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={e => void handleSubmit(e)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Email"
            type="email"
            required
            fullWidth
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ border: 1, borderColor: 'divider', p: 2, borderRadius: 1 }}>
            <CardElement
              options={{
                style: {
                  base: {
                    'fontSize': '16px',
                    'color': '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={splitPayment}
                onChange={e => setSplitPayment(e.target.checked)}
              />
            )}
            label="Split payment into installments"
          />
        </Grid>

        {splitPayment && (
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Number of Payments"
                type="number"
                fullWidth
                value={splitDetails.numberOfPayments}
                onChange={e => setSplitDetails(prev => ({
                  ...prev,
                  numberOfPayments: Number.parseInt(e.target.value),
                  firstPayment: amount / Number.parseInt(e.target.value),
                }))}
                inputProps={{ min: 2, max: 4 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Payment Amount"
                type="number"
                fullWidth
                value={splitDetails.firstPayment}
                onChange={e => setSplitDetails(prev => ({
                  ...prev,
                  firstPayment: Number.parseFloat(e.target.value),
                }))}
                InputProps={{
                  startAdornment: '$',
                }}
              />
            </Grid>
          </Grid>
        )}

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!stripe || processing}
            sx={{ py: 1.5 }}
          >
            {processing
              ? (
                  <CircularProgress size={24} />
                )
              : (
                  `Pay ${splitPayment ? `$${splitDetails.firstPayment.toFixed(2)} now` : `$${amount.toFixed(2)}`}`
                )}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Payment Details
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <PaymentFormContent {...props} />
      </Paper>
    </Elements>
  )
}
