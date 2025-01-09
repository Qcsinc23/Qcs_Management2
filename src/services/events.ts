import { Event } from '../types/event';

// Mock data - replace with actual API calls
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Product Launch',
    description: 'Launch of new product line',
    startDate: '2024-01-15T09:00:00',
    endDate: '2024-01-15T12:00:00',
    location: 'Main Conference Room',
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'Team Building',
    description: 'Quarterly team building exercise',
    startDate: '2024-02-01T10:00:00',
    endDate: '2024-02-01T16:00:00',
    location: 'Outdoor Field',
    status: 'scheduled'
  }
];

export async function getEvents(): Promise<Event[]> {
  // Simulate network delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockEvents);
    }, 500);
  });
}
