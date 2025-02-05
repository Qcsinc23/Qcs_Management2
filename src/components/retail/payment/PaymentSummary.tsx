import {
  Download as DownloadIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { useState } from 'react'

interface PaymentSummaryProps {
  orderDetails: {
    trackingNumber: string
    service: string
    origin: string
    destination: string
    weight: string
    dimensions: string
  }
  pricing: {
    basePrice: number
    insurance?: number
    tax: number
    discount?: number
    total: number
  }
  paymentId?: string
}

export default function PaymentSummary({
  orderDetails,
  pricing,
  paymentId,
}: PaymentSummaryProps) {
  const [generatingInvoice, setGeneratingInvoice] = useState(false)

  const generateInvoice = async () => {
    setGeneratingInvoice(true)
    try {
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([600, 800])
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

      // Header
      page.drawText('INVOICE', {
        x: 50,
        y: 750,
        size: 24,
        font,
      })

      // Order Details
      page.drawText('Order Details', {
        x: 50,
        y: 700,
        size: 16,
        font,
      })

      const orderDetailsText = [
        `Tracking Number: ${orderDetails.trackingNumber}`,
        `Service: ${orderDetails.service}`,
        `Origin: ${orderDetails.origin}`,
        `Destination: ${orderDetails.destination}`,
        `Weight: ${orderDetails.weight}`,
        `Dimensions: ${orderDetails.dimensions}`,
      ]

      orderDetailsText.forEach((text, index) => {
        page.drawText(text, {
          x: 50,
          y: 670 - (index * 20),
          size: 12,
          font: regularFont,
        })
      })

      // Pricing Details
      page.drawText('Pricing Details', {
        x: 50,
        y: 520,
        size: 16,
        font,
      })

      const pricingDetails = [
        `Base Price: $${pricing.basePrice.toFixed(2)}`,
        pricing.insurance && `Insurance: $${pricing.insurance.toFixed(2)}`,
        `Tax: $${pricing.tax.toFixed(2)}`,
        pricing.discount && `Discount: -$${pricing.discount.toFixed(2)}`,
        `Total: $${pricing.total.toFixed(2)}`,
      ].filter(Boolean)

      pricingDetails.forEach((text, index) => {
        page.drawText(text as string, {
          x: 50,
          y: 490 - (index * 20),
          size: 12,
          font: regularFont,
        })
      })

      // Footer
      page.drawText(`Payment ID: ${paymentId || 'Pending'}`, {
        x: 50,
        y: 50,
        size: 10,
        font: regularFont,
      })

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice_${orderDetails.trackingNumber}.pdf`
      link.click()
    }
    catch (error) {
      console.error('Error generating invoice:', error)
    }
    finally {
      setGeneratingInvoice(false)
    }
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <List disablePadding>
        <ListItem>
          <ListItemText
            primary="Tracking Number"
            secondary={orderDetails.trackingNumber}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Service"
            secondary={orderDetails.service}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Route"
            secondary={`${orderDetails.origin} → ${orderDetails.destination}`}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Package Details"
            secondary={`${orderDetails.weight}, ${orderDetails.dimensions}`}
          />
        </ListItem>
      </List>

      <Divider sx={{ my: 2 }} />

      <List disablePadding>
        <ListItem>
          <ListItemText primary="Base Price" />
          <Typography variant="body2">
            $
            {pricing.basePrice.toFixed(2)}
          </Typography>
        </ListItem>
        {pricing.insurance && (
          <ListItem>
            <ListItemText primary="Insurance" />
            <Typography variant="body2">
              $
              {pricing.insurance.toFixed(2)}
            </Typography>
          </ListItem>
        )}
        <ListItem>
          <ListItemText primary="Tax" />
          <Typography variant="body2">
            $
            {pricing.tax.toFixed(2)}
          </Typography>
        </ListItem>
        {pricing.discount && (
          <ListItem>
            <ListItemText primary="Discount" />
            <Typography variant="body2" color="error">
              -$
              {pricing.discount.toFixed(2)}
            </Typography>
          </ListItem>
        )}
        <ListItem>
          <ListItemText primary="Total" />
          <Typography variant="h6" color="primary">
            $
            {pricing.total.toFixed(2)}
          </Typography>
        </ListItem>
      </List>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          startIcon={<ReceiptIcon />}
          variant="outlined"
          onClick={() => void generateInvoice()}
          disabled={generatingInvoice}
          fullWidth
        >
          {generatingInvoice
            ? (
                <CircularProgress size={24} />
              )
            : (
                'Generate Invoice'
              )}
        </Button>
        {paymentId && (
          <Button
            startIcon={<DownloadIcon />}
            variant="outlined"
            onClick={() => void generateInvoice()}
            disabled={generatingInvoice}
            fullWidth
          >
            Download Receipt
          </Button>
        )}
      </Box>
    </Paper>
  )
}
