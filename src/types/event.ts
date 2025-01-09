export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}
