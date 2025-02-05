import { useClerk, useUser } from '@clerk/clerk-react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type OnboardingStep = 'personal' | 'preferences' | 'review'

export default function RetailOnboarding() {
  const navigate = useNavigate()
  const { user, isLoaded: userLoaded } = useUser()
  const { session } = useClerk()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('personal')
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    preferredContact: 'email' as 'email' | 'phone' | 'sms',
  })

  const steps = [
    { key: 'personal', label: 'Personal Information' },
    { key: 'preferences', label: 'Preferences' },
    { key: 'review', label: 'Review' },
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNext = () => {
    const stepIndex = steps.findIndex(step => step.key === currentStep)
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].key as OnboardingStep)
    }
  }

  const handleBack = () => {
    const stepIndex = steps.findIndex(step => step.key === currentStep)
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].key as OnboardingStep)
    }
  }

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!userLoaded)
        return

      if (!user) {
        navigate('/sign-in?userType=retail')
        return
      }

      // Check if user is already onboarded
      if (user.unsafeMetadata?.onboardingComplete === true) {
        navigate('/retail')
        return
      }

      setIsInitializing(false)
    }

    checkOnboardingStatus()
  }, [user, userLoaded, navigate])

  const handleSubmit = async () => {
    if (!user || !session) {
      setError('Authentication required. Please sign in.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // First update basic information
      await user.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
      })

      // Preserve existing metadata while updating
      const currentMetadata = user.unsafeMetadata || {}
      console.log('Current metadata before update:', currentMetadata)

      const updateResult = await user.update({
        unsafeMetadata: {
          ...currentMetadata,
          userType: 'retail',
          onboardingComplete: true,
          onboardingCompletedAt: Date.now(),
          preferredContact: formData.preferredContact,
          updatedAt: new Date().toISOString(),
        },
      })

      console.log('Update result:', {
        success: !!updateResult,
        newMetadata: updateResult?.unsafeMetadata,
        userId: updateResult?.id,
      })

      // Force session token refresh to include new metadata
      await session.reload()

      // Verify the update was successful
      const updatedUser = await user.reload()
      console.log('Verification:', {
        onboardingComplete: updatedUser.unsafeMetadata?.onboardingComplete,
        userType: updatedUser.unsafeMetadata?.userType,
      })

      // Add a small delay to ensure all updates are processed
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Navigate to retail home
      navigate('/retail')
    }
    catch (err) {
      console.error('Onboarding error:', err)
      setError(err instanceof Error ? err.message : 'Failed to complete onboarding. Please try again.')
    }
    finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <Box sx={{ mt: 4 }}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={e => handleInputChange('firstName', e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={e => handleInputChange('lastName', e.target.value)}
              margin="normal"
              required
            />
          </Box>
        )

      case 'preferences':
        return (
          <Box sx={{ mt: 4 }}>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel>Preferred Contact Method</FormLabel>
              <RadioGroup
                value={formData.preferredContact}
                onChange={e => handleInputChange('preferredContact', e.target.value as 'email' | 'phone' | 'sms')}
              >
                <FormControlLabel value="email" control={<Radio />} label="Email" />
                <FormControlLabel value="phone" control={<Radio />} label="Phone" />
                <FormControlLabel value="sms" control={<Radio />} label="SMS" />
              </RadioGroup>
            </FormControl>
          </Box>
        )

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
              <Typography>
                First Name:
                {formData.firstName}
              </Typography>
              <Typography>
                Last Name:
                {formData.lastName}
              </Typography>
              <Typography>
                Preferred Contact:
                {formData.preferredContact}
              </Typography>
            </Paper>
          </Box>
        )
    }
  }

  if (isInitializing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Complete Your Profile
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Help us personalize your experience with QCS Express
        </Typography>

        <Stepper activeStep={steps.findIndex(step => step.key === currentStep)} sx={{ mb: 4 }}>
          {steps.map(step => (
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
          {currentStep === 'review'
            ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!formData.firstName || !formData.lastName || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Complete Onboarding'}
                </Button>
              )
            : (
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
  )
}
