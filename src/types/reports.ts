export interface ReportItem {
  id: string;
  type: string;
  period: string;
  generatedAt: string;
  status: 'Pending' | 'Processing' | 'Ready' | 'Failed';
  downloadUrl: string;
}
