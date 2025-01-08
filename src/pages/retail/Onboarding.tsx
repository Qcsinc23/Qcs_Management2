import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';

type OnboardingStep = 'personal' | 'preferences' | 'review';

export default function RetailOnboarding() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useUser();
  const { session } = useClerk();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('personal');
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    preferredContact: 'email' as 'email' | 'phone' | 'sms',
  });

  const steps = [
    { key: 'personal', label: 'Personal Information' },
    { key: 'preferences', label: 'Preferences' },
    { key: 'review', label: 'Review' },
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    const stepIndex = steps.findIndex((step) => step.key === currentStep);
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].key as OnboardingStep);
    }
  };

  const handleBack = () => {
    const stepIndex = steps.findIndex((step) => step.key === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].key as OnboardingStep);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!user) throw new Error('No user found');

      // Update user's basic information
      await user.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      // Update user's metadata
      await user.update({
        unsafeMetadata: {
          userType: 'retail',
          onboardingComplete: true,
          preferredContact: formData.preferredContact,
        },
      });

      // Force session token refresh to include new metadata
      await session?.reload();
      navigate('/retail');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete onboarding');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <Box sx={{ mt: 4 }}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              margin="normal"
              required
            />
          </Box>
        );

      case 'preferences':
        return (
          <Box sx={{ mt: 4 }}>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel>Preferred Contact Method</FormLabel>
              <RadioGroup
                value={formData.preferredContact}
                onChange={(e) => handleInputChange('preferredContact', e.target.value as 'email' | 'phone' | 'sms')}
              >
                <FormControlLabel value="email" control={<Radio />} label="Email" />
                <FormControlLabel value="phone" control={<Radio />} label="Phone" />
                <FormControlLabel value="sms" control={<Radio />} label="SMS" />
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case 'review':
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Personal Information
              </Typography>
              <Typography>First Name: {formData.firstName}</Typography>
              <Typography>Last Name: {formData.lastName}</Typography>
              <Typography>Preferred Contact: {formData.preferredContact}</Typography>
            </Paper>
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Complete Your Profile
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Help us personalize your experience with QCS Express
        </Typography>

        <Stepper activeStep={steps.findIndex((step) => step.key === currentStep)} sx={{ mb: 4 }}>
          {steps.map((step) => (
            <Step key={step.key}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {renderStep()}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={currentStep === 'personal'}
          >
            Back
          </Button>
          {currentStep === 'review' ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!formData.firstName || !formData.lastName}
            >
              Complete Onboarding
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                currentStep === 'personal' && (!formData.firstName || !formData.lastName)
              }
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}
