import { useClerk } from '@clerk/clerk-react';

export interface OrganizationDetails {
  id: string;
  name: string;
  address?: string;
  contactEmail?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export async function fetchOrganizationDetails(organizationId: string, sessionToken: string): Promise<OrganizationDetails> {
  if (!sessionToken) {
    throw new Error('No session token provided');
  }

  try {
    const response = await fetch(`/api/organizations/${organizationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch organization: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      id: data.id,
      name: data.name,
      address: data.address,
      contactEmail: data.contactEmail,
      phoneNumber: data.phoneNumber,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      metadata: data.metadata || {}
    };
  } catch (error) {
    console.error('Error fetching organization details:', error);
    throw error;
  }
}

export const organizationService = {
  fetchDetails: fetchOrganizationDetails
};
