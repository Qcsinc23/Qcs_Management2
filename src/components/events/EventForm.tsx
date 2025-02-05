import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid } from '@mui/material'
import { createEvent } from '../../services/events'
import type { CreateEventDTO } from '../../types/event'
import {
  StyledForm,
  StyledFormSection,
  StyledTitle,
  StyledTextField,
  StyledButton,
} from '../../styles/components'

const EventForm: React.FC = () => {
  const navigate = useNavigate()
  const [eventData, setEventData] = useState<CreateEventDTO>({
    name: '',
    date: '',
    startTime: '',
    dropOffTime: '',
    pickupTime: '',
    venue: {
      name: '',
      address: '',
    },
    client: {
      name: '',
      id: '',
    },
    contacts: {
      onsite: {
        id: '',
        name: '',
        role: 'onsite',
        phone: '',
        email: '',
      },
      manager: {
        id: '',
        name: '',
        role: 'manager',
        phone: '',
        email: '',
      },
    },
    items: [],
    additionalNotes: '',
    status: 'scheduled',
    pickupDetails: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof CreateEventDTO,
    nestedField?: string,
    subNestedField?: string,
  ) => {
    const value = e.target.value
    setEventData((prevData) => {
      if (field && nestedField && subNestedField) {
        return {
          ...prevData,
          [field]: {
            ...((prevData[field] as any) || {}),
            [nestedField]: {
              ...(((prevData[field] as any)?.[nestedField] as any) || {}),
              [subNestedField]: value,
            },
          },
        }
      } else if (field && nestedField) {
        return {
          ...prevData,
          [field]: {
            ...((prevData[field] as any) || {}),
            [nestedField]: value,
          },
        }
      } else if (field) {
        return {
          ...prevData,
          [field]: value,
        }
      } else {
        return prevData
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createEvent(eventData)
      navigate('/events')
    } catch (error) {
      console.error('Error creating event:', error)
      // TODO: Handle error (e.g., show a notification)
    }
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledTitle variant="h4">Create New Event</StyledTitle>

      {/* Event Details Section */}
      <StyledFormSection>
        <StyledTitle variant="h6">Event Details</StyledTitle>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledTextField
              label="Event Name"
              name="name"
              fullWidth
              required
              value={eventData.name}
              onChange={(e) => handleChange(e, 'name')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Date"
              name="date"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={eventData.date}
              onChange={(e) => handleChange(e, 'date')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Start Time"
              name="startTime"
              type="time"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={eventData.startTime}
              onChange={(e) => handleChange(e, 'startTime')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Drop-Off Time"
              name="dropOffTime"
              type="time"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={eventData.dropOffTime}
              onChange={(e) => handleChange(e, 'dropOffTime')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Pickup Time"
              name="pickupTime"
              type="time"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={eventData.pickupTime}
              onChange={(e) => handleChange(e, 'pickupTime')}
            />
          </Grid>
        </Grid>
      </StyledFormSection>

      {/* Venue Section */}
      <StyledFormSection>
        <StyledTitle variant="h6">Venue Information</StyledTitle>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledTextField
              label="Venue Name"
              name="venueName"
              fullWidth
              required
              value={eventData.venue.name}
              onChange={(e) => handleChange(e, 'venue', 'name')}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              label="Venue Address"
              name="venueAddress"
              fullWidth
              required
              value={eventData.venue.address}
              onChange={(e) => handleChange(e, 'venue', 'address')}
            />
          </Grid>
        </Grid>
      </StyledFormSection>

      {/* Client Section */}
      <StyledFormSection>
        <StyledTitle variant="h6">Client Information</StyledTitle>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledTextField
              label="Client Name"
              name="clientName"
              fullWidth
              required
              value={eventData.client.name}
              onChange={(e) => handleChange(e, 'client', 'name')}
            />
          </Grid>
        </Grid>
      </StyledFormSection>

      {/* Contacts Section */}
      <StyledFormSection>
        <StyledTitle variant="h6">Contact Information</StyledTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="On-site Contact Name"
              name="onSiteContactName"
              fullWidth
              required
              value={eventData.contacts.onsite.name}
              onChange={(e) => handleChange(e, 'contacts', 'onsite', 'name')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="On-site Contact Phone"
              name="onSiteContactPhone"
              fullWidth
              required
              value={eventData.contacts.onsite.phone}
              onChange={(e) => handleChange(e, 'contacts', 'onsite', 'phone')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Manager Name"
              name="managerName"
              fullWidth
              required
              value={eventData.contacts.manager.name}
              onChange={(e) => handleChange(e, 'contacts', 'manager', 'name')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Manager Phone"
              name="managerPhone"
              fullWidth
              required
              value={eventData.contacts.manager.phone}
              onChange={(e) => handleChange(e, 'contacts', 'manager', 'phone')}
            />
          </Grid>
        </Grid>
      </StyledFormSection>

      {/* Additional Notes Section */}
      <StyledFormSection>
        <StyledTitle variant="h6">Additional Information</StyledTitle>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledTextField
              label="Additional Notes"
              name="additionalNotes"
              fullWidth
              multiline
              rows={4}
              value={eventData.additionalNotes}
              onChange={(e) => handleChange(e, 'additionalNotes')}
            />
          </Grid>
        </Grid>
      </StyledFormSection>

      {/* Submit Button */}
      <Grid container justifyContent="flex-end">
        <StyledButton
          variant="contained"
          color="primary"
          type="submit"
          size="large"
        >
          Create Event
        </StyledButton>
      </Grid>
    </StyledForm>
  )
}

export default EventForm