import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Divider,
  TextField,
} from '@mui/material';
import {
  Check as CheckIcon,
  Email as EmailIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import SignatureCapture from './SignatureCapture';
import PhotoUpload from './PhotoUpload';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

interface ProofOfDeliveryProps {
  trackingNumber: string;
  recipientName: string;
  deliveryAddress: string;
  onComplete: () => void;
}

const steps = ['Capture Signature', 'Take Photos', 'Confirm Delivery'];

export default function ProofOfDelivery({
  trackingNumber,
  recipientName,
  deliveryAddress,
  onComplete,
}: ProofOfDeliveryProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [signature, setSignature] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignatureSave = (signatureData: string) => {
    setSignature(signatureData);
    handleNext();
  };

  const handlePhotosSave = (photoData: string[]) => {
    setPhotos(photoData);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const generatePDF = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;

      // Add header
      page.drawText('Proof of Delivery', {
        x: 50,
        y: 750,
        size: 20,
        font,
      });

      // Add delivery details
      page.drawText(`Tracking Number: ${trackingNumber}`, {
        x: 50,
        y: 700,
        size: fontSize,
        font,
      });
      page.drawText(`Recipient: ${recipientName}`, {
        x: 50,
        y: 680,
        size: fontSize,
        font,
      });
      page.drawText(`Address: ${deliveryAddress}`, {
        x: 50,
        y: 660,
        size: fontSize,
        font,
      });
      page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
        x: 50,
        y: 640,
        size: fontSize,
        font,
      });

      // Add signature if available
      if (signature) {
        const signatureImage = await pdfDoc.embedPng(signature);
        page.drawImage(signatureImage, {
          x: 50,
          y: 450,
          width: 200,
          height: 100,
        });
      }

      const pdfBytes = await pdfDoc.save();
      return pdfBytes;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };

  const handleComplete = async () => {
    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      // Generate PDF
      const pdfBytes = await generatePDF();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Simulate sending confirmation email
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Trigger PDF download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `pod_${trackingNumber}.pdf`;
      link.click();

      setSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 2000); // Give user time to see success message
    } catch (error) {
      console.error('Error completing delivery:', error);
      setError('Failed to process delivery confirmation. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <SignatureCapture onSave={handleSignatureSave} />;
      case 1:
        return (
          <PhotoUpload
            onSave={handlePhotosSave}
            maxPhotos={3}
          />
        );
      case 2:
        return (
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Delivery Confirmation
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Delivery Details
              </Typography>
              <Typography>Tracking Number: {trackingNumber}</Typography>
              <Typography>Recipient: {recipientName}</Typography>
              <Typography>Address: {deliveryAddress}</Typography>
              <Typography>Date: {new Date().toLocaleDateString()}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <TextField
              fullWidth
              label="Delivery Notes"
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mb: 3 }}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Delivery confirmation processed successfully
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                startIcon={<EmailIcon />}
                variant="contained"
                onClick={handleComplete}
                disabled={isProcessing || success}
              >
                {isProcessing ? (
                  <CircularProgress size={24} />
                ) : (
                  'Send Confirmation'
                )}
              </Button>
            </Box>
          </Paper>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStepContent(activeStep)}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || isProcessing || success}
        >
          Back
        </Button>
        {activeStep < steps.length - 1 && (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              (activeStep === 0 && !signature) ||
              (activeStep === 1 && photos.length === 0) ||
              isProcessing ||
              success
            }
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
}
