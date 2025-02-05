import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoggingService } from '../services/LoggingService'
import { createEvent, checkSchedulingConflicts } from '../services/events'
import type { CreateEventDTO, InventoryItem, Contact } from '../types/event'
import { validateEventData, validateEventTimes, EventValidationError } from '../utils/eventValidation'
import { supabase } from '../services/supabase'
import { PostgrestError } from '@supabase/supabase-js'

interface ContactFormData {
  id: string
  name: string
  phone: string
  email: string
  role: 'onsite' | 'manager'
}

interface FormData {
  name: string
  date: string
  startTime: string
  dropOffTime: string
  pickupTime: string
  venue: {
    name: string
    address: string
  }
  client: {
    name: string
    id: string
  }
  contacts: {
    onsite: ContactFormData
    manager: ContactFormData
  }
  additionalNotes: string
  pickupDetails: string
}

const initialFormData: FormData = {
  name: '',
  date: '',
  startTime: '',
  dropOffTime: '',
  pickupTime: '',
  venue: {
    name: '',
    address: ''
  },
  client: {
    name: '',
    id: ''
  },
  contacts: {
    onsite: {
      id: `temp-onsite-${Date.now()}`,
      name: '',
      phone: '',
      email: '',
      role: 'onsite'
    },
    manager: {
      id: `temp-manager-${Date.now()}`,
      name: '',
      phone: '',
      email: '',
      role: 'manager'
    }
  },
  additionalNotes: '',
  pickupDetails: ''
}

const BookingPage: React.FC = () => {
  const logger = LoggingService.getInstance()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [availableItems, setAvailableItems] = useState<InventoryItem[]>([])
  const [selectedItems, setSelectedItems] = useState<{[key: string]: number}>({})
  const [formData, setFormData] = useState<FormData>(initialFormData)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from('inventory_items')
          .select('*')
          .eq('isAvailable', true)
        
        if (error) throw error
        if (data) {
          setAvailableItems(data as InventoryItem[])
        }
      } catch (err) {
        const pgError = err as PostgrestError
        logger.error('Failed to fetch inventory items', {
          code: pgError.code,
          message: pgError.message,
          details: pgError.details
        })
        setError('Failed to load inventory items')
      }
    }

    fetchItems()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      if (parent && child && parent in formData) {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...(prev[parent as keyof FormData] as Record<string, unknown>),
            [child]: value
          }
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleContactChange = (role: 'onsite' | 'manager', field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [role]: {
          ...prev.contacts[role],
          [field]: value
        }
      }
    }))
  }

  const handleItemChange = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      const newItems = { ...selectedItems }
      delete newItems[itemId]
      setSelectedItems(newItems)
    } else {
      setSelectedItems(prev => ({
        ...prev,
        [itemId]: quantity
      }))
    }
  }

  const validateForm = async (): Promise<boolean> => {
    try {
      // Validate event data structure
      validateEventData(formData)
      
      // Validate event times
      validateEventTimes(formData.startTime, formData.dropOffTime, formData.pickupTime)
      
      // Check for scheduling conflicts
      const hasConflict = await checkSchedulingConflicts(
        formData.date,
        formData.dropOffTime,
        formData.pickupTime
      )

      if (hasConflict) {
        setError('There is a scheduling conflict with another event. Please choose different times.')
        return false
      }

      return true
    } catch (err) {
      if (err instanceof EventValidationError) {
        setError(err.message)
        logger.warn('Event validation failed', {
          error: err.message,
          formData
        })
      } else {
        const error = err as Error
        logger.error('Failed to validate event', {
          name: error.name,
          message: error.message,
          stack: error.stack
        })
        setError('Failed to validate event data. Please check all fields and try again.')
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const isValid = await validateForm()
      if (!isValid) {
        setIsLoading(false)
        return
      }

      const eventData: CreateEventDTO = {
        name: formData.name,
        date: formData.date,
        startTime: formData.startTime,
        dropOffTime: formData.dropOffTime,
        pickupTime: formData.pickupTime,
        venue: formData.venue,
        client: formData.client,
        contacts: {
          onsite: {
            ...formData.contacts.onsite,
            id: formData.contacts.onsite.id || `temp-onsite-${Date.now()}`
          } as Contact,
          manager: {
            ...formData.contacts.manager,
            id: formData.contacts.manager.id || `temp-manager-${Date.now()}`
          } as Contact
        },
        items: Object.entries(selectedItems).map(([itemId, quantity]) => ({
          itemId,
          quantity
        })),
        status: 'scheduled',
        additionalNotes: formData.additionalNotes,
        pickupDetails: formData.pickupDetails
      }

      // Generate a client ID if not provided
      if (!formData.client.id) {
        eventData.client.id = `client-${Date.now()}`
      }

      // Transform selected items to match Event type structure
      eventData.items = Object.entries(selectedItems).map(([itemId, quantity]) => ({
        itemId,
        quantity: Number(quantity)
      }))

      const createdEvent = await createEvent(eventData)
      logger.info('Event created successfully', { eventId: createdEvent.id })
      navigate('/events')
    } catch (err) {
      const error = err as Error
      logger.error('Failed to create event', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
      
      // Display more specific error messages
      if (error.message.includes('scheduling conflict')) {
        setError('There is a scheduling conflict with another event. Please choose different times.')
      } else if (error.message.includes('validation')) {
        setError('Please check all required fields and try again.')
      } else {
        setError('Failed to create event. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">New Event Booking</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Details */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Event Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Event Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Drop-off Time</label>
              <input
                type="time"
                name="dropOffTime"
                value={formData.dropOffTime}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Pickup Time</label>
              <input
                type="time"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        </div>

        {/* Venue Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Venue Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block mb-2">Venue Name</label>
              <input
                type="text"
                name="venue.name"
                value={formData.venue.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Address</label>
              <input
                type="text"
                name="venue.address"
                value={formData.venue.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Client Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Client Name</label>
              <input
                type="text"
                name="client.name"
                value={formData.client.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Client ID</label>
              <input
                type="text"
                name="client.id"
                value={formData.client.id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          
          {/* On-site Contact */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">On-site Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  value={formData.contacts.onsite.name}
                  onChange={(e) => handleContactChange('onsite', 'name', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.contacts.onsite.phone}
                  onChange={(e) => handleContactChange('onsite', 'phone', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  value={formData.contacts.onsite.email}
                  onChange={(e) => handleContactChange('onsite', 'email', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Manager Contact */}
          <div>
            <h3 className="text-lg font-medium mb-3">Manager Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  value={formData.contacts.manager.name}
                  onChange={(e) => handleContactChange('manager', 'name', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.contacts.manager.phone}
                  onChange={(e) => handleContactChange('manager', 'phone', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  value={formData.contacts.manager.email}
                  onChange={(e) => handleContactChange('manager', 'email', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Items Selection */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Items</h2>
          <div className="grid grid-cols-1 gap-4">
            {availableItems.map(item => (
              <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <span className="font-medium">{item.name}</span>
                  {item.itemCode && <span className="ml-2 text-gray-500">({item.itemCode})</span>}
                </div>
                <input
                  type="number"
                  min="0"
                  max={item.quantity}
                  value={selectedItems[item.id] || 0}
                  onChange={(e) => handleItemChange(item.id, parseInt(e.target.value))}
                  className="w-24 p-2 border rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block mb-2">Additional Notes</label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
            <div>
              <label className="block mb-2">Pickup Details</label>
              <textarea
                name="pickupDetails"
                value={formData.pickupDetails}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default BookingPage