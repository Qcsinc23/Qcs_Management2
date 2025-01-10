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
  MenuItem,
  Grid,
  TextFieldProps,
} from '@mui/material';
import { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';

type OnboardingStep = 'company' | 'contact' | 'billing' | 'review';

interface FormData {
  companyName: string;
  companySize: string;
  industry: string;
  businessType: string;
  businessContact: {
    businessEmail: string;
    businessPhone: string;
    address: string;
  };
  billingPreferences: {
    billingCycle: 'monthly' | 'quarterly' | 'annually';
    invoiceEmail: string;
  };
}

const companySizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '500+ employees',
] as const;

const industries = [
  'Technology',
  'Manufacturing',
  'Retail',
  'Healthcare',
  'Finance',
  'Education',
  'Other',
] as const;

const businessTypes = [
  'Corporation',
  'LLC',
  'Partnership',
  'Sole Proprietorship',
  'Non-Profit',
] as const;

export default function CorporateOnboarding() {
  const navigate = useNavigate();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { session, loaded: isSessionLoaded } = useClerk();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('company');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useStore();
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    companySize: '',
    industry: '',
    businessType: '',
    businessContact: {
      businessEmail: '',
      businessPhone: '',
      address: '',
    },
    billingPreferences: {
      billingCycle: 'monthly',
      invoiceEmail: '',
    },
  });

  const steps = [
    { key: 'company', label: 'Company Information' },
    { key: 'contact', label: 'Business Contact' },
    { key: 'billing', label: 'Billing Preferences' },
    { key: 'review', label: 'Review' },
  ] as const;

  const handleInputChange = (field: string, value: string) => {
    const fields = field.split('.');
    if (fields.length === 1) {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else {
      const [section, key] = fields;
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof FormData] as Record<string, unknown>),
          [key]: value,
        },
      }));
    }
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

  const validateStep = () => {
    switch (currentStep) {
      case 'company':
        return !!(formData.companyName && formData.companySize && formData.industry && formData.businessType);
      case 'contact':
        return !!(
          formData.businessContact.businessEmail &&
          formData.businessContact.businessPhone &&
          formData.businessContact.address
        );
      case 'billing':
        return !!(formData.billingPreferences.billingCycle && formData.billingPreferences.invoiceEmail);
      default:
        return true;
    }
  };

  useEffect(() => {
    // Debug auth state
    console.log('Auth State:', {
      isUserLoaded,
      isSessionLoaded,
      user: user?.id,
      session: session?.id,
      currentStep,
      formDataValid: validateStep(),
      formData
    });

    // Check if button should be enabled
    if (currentStep === 'review') {
      console.log('Submit Button State:', {
        isValid: validateStep(),
        isSubmitting,
        canSubmit: validateStep() && !isSubmitting
      });
    }
  }, [isUserLoaded, user, isSessionLoaded, session, currentStep, formData, isSubmitting]);

  const handleSubmit = async () => {
    console.log('Submit clicked');
    
    // Validate auth state
    if (!isUserLoaded || !isSessionLoaded) {
      console.error('Auth not ready:', { isUserLoaded, isSessionLoaded });
      addNotification({ 
        type: 'error', 
        message: 'Please wait for authentication to complete.' 
      });
      return;
    }

    if (!user) {
      console.error('No user found');
      addNotification({ 
        type: 'error', 
        message: 'No user found. Please sign in again.' 
      });
      return;
    }

    if (!session) {
      console.error('No session found');
      addNotification({ 
        type: 'error', 
        message: 'No active session found. Please sign in again.' 
      });
      return;
    }

    // Validate form data
    if (!validateStep()) {
      console.error('Form validation failed');
      addNotification({
        type: 'error',
        message: 'Please complete all required fields.'
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Starting submission...');
    
    try {
      console.log('Current form data:', formData);
      console.log('Updating user metadata...');
      
      // Preserve existing metadata while updating
      const currentMetadata = user.unsafeMetadata || {};
      console.log('Current metadata before update:', currentMetadata);

      const updateResult = await user.update({
        unsafeMetadata: {
          ...currentMetadata,
          userType: 'corporate',
          onboardingComplete: true,
          companyName: formData.companyName,
          companySize: formData.companySize,
          industry: formData.industry,
          businessType: formData.businessType,
          businessContact: formData.businessContact,
          billingPreferences: formData.billingPreferences,
          lastUpdated: Date.now(),
        },
      });

      console.log('Update result:', {
        success: !!updateResult,
        newMetadata: updateResult?.unsafeMetadata,
        userId: updateResult?.id
      });

      console.log('Reloading session...');
      await session.reload();
      
      // Verify the update was successful
      const updatedUser = await user.reload();
      console.log('Verification:', {
        onboardingComplete: updatedUser.unsafeMetadata?.onboardingComplete,
        userType: updatedUser.unsafeMetadata?.userType
      });
      
      addNotification({ 
        type: 'success', 
        message: 'Onboarding completed successfully!' 
      });

      console.log('Navigating to dashboard...');
      navigate('/corporate');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Onboarding error:', {
        error: err,
        message: errorMessage,
        formData,
        userId: user.id
      });
      
      addNotification({ 
        type: 'error', 
        message: `Failed to complete onboarding: ${errorMessage}. Please try again.` 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextFieldChange: TextFieldProps['onChange'] = (e) => {
    const { name, value } = e.target;
    handleInputChange(name, value);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'company':
        return (
          <Box sx={{ mt: 4 }}>
            <TextField
              fullWidth
              name="companyName"
              label="Company Name"
              value={formData.companyName}
              onChange={handleTextFieldChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              select
              name="companySize"
              label="Company Size"
              value={formData.companySize}
              onChange={handleTextFieldChange}
              margin="normal"
              required
            >
              {companySizes.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              name="industry"
              label="Industry"
              value={formData.industry}
              onChange={handleTextFieldChange}
              margin="normal"
              required
            >
              {industries.map((industry) => (
                <MenuItem key={industry} value={industry}>
                  {industry}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              name="businessType"
              label="Business Type"
              value={formData.businessType}
              onChange={handleTextFieldChange}
              margin="normal"
              required
            >
              {businessTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        );

      case 'contact':
        return (
          <Box sx={{ mt: 4 }}>
            <TextField
              fullWidth
              name="businessContact.businessEmail"
              label="Business Email"
              type="email"
              value={formData.businessContact.businessEmail}
              onChange={handleTextFieldChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              name="businessContact.businessPhone"
              label="Business Phone"
              value={formData.businessContact.businessPhone}
              onChange={handleTextFieldChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              name="businessContact.address"
              label="Business Address"
              multiline
              rows={3}
              value={formData.businessContact.address}
              onChange={handleTextFieldChange}
              margin="normal"
              required
            />
          </Box>
        );

      case 'billing':
        return (
          <Box sx={{ mt: 4 }}>
            <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
              <FormLabel>Billing Cycle</FormLabel>
              <RadioGroup
                name="billingPreferences.billingCycle"
                value={formData.billingPreferences.billingCycle}
                onChange={handleTextFieldChange}
              >
                <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
                <FormControlLabel value="quarterly" control={<Radio />} label="Quarterly" />
                <FormControlLabel value="annually" control={<Radio />} label="Annually" />
              </RadioGroup>
            </FormControl>
            <TextField
              fullWidth
              name="billingPreferences.invoiceEmail"
              label="Invoice Email"
              type="email"
              value={formData.billingPreferences.invoiceEmail}
              onChange={handleTextFieldChange}
              margin="normal"
              required
            />
          </Box>
        );

      case 'review':
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Company Information
                  </Typography>
                  <Typography>Company Name: {formData.companyName}</Typography>
                  <Typography>Company Size: {formData.companySize}</Typography>
                  <Typography>Industry: {formData.industry}</Typography>
                  <Typography>Business Type: {formData.businessType}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Business Contact
                  </Typography>
                  <Typography>Email: {formData.businessContact.businessEmail}</Typography>
                  <Typography>Phone: {formData.businessContact.businessPhone}</Typography>
                  <Typography>Address: {formData.businessContact.address}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Billing Preferences
                  </Typography>
                  <Typography>
                    Billing Cycle:{' '}
                    {formData.billingPreferences.billingCycle.charAt(0).toUpperCase() +
                      formData.billingPreferences.billingCycle.slice(1)}
                  </Typography>
                  <Typography>Invoice Email: {formData.billingPreferences.invoiceEmail}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Complete Your Corporate Profile
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Set up your business account with QCS Management
        </Typography>

        <Stepper activeStep={steps.findIndex((step) => step.key === currentStep)} sx={{ mb: 4 }}>
          {steps.map((step) => (
            <Step key={step.key}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>


        {renderStep()}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={currentStep === 'company'}
          >
            Back
          </Button>
          {currentStep === 'review' ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!validateStep() || isSubmitting}
            >
              Complete Onboarding
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!validateStep()}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}
