import { supabase } from './supabase'

export interface OrganizationDetails {
  id: string
  name: string
  address?: string
  contactEmail?: string
  phoneNumber?: string
  createdAt: string
  updatedAt: string
  metadata?: Record<string, unknown>
}

export type Role = 'ADMIN' | 'MANAGER' | 'VIEWER'

export interface TeamMember {
  id: string
  name: string
  email: string
  role: Role
  status: 'active' | 'pending'
  invitedBy?: string
  invitedAt?: string
}

export interface InviteTeamMemberParams {
  email: string
  role: Role
  organizationId: string
}

export async function inviteTeamMember(params: InviteTeamMemberParams): Promise<void> {
  try {
    const { error } = await supabase
      .from('team_members')
      .insert([{
        organization_id: params.organizationId,
        email: params.email,
        role: params.role,
        status: 'pending',
        invited_at: new Date().toISOString(),
      }])

    if (error)
      throw error
  }
  catch (error) {
    console.error('Error inviting team member:', error)
    throw error
  }
}

export async function fetchOrganizationDetails(organizationId: string): Promise<OrganizationDetails> {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single()

    if (error)
      throw error
    if (!data)
      throw new Error('Organization not found')

    return {
      id: data.id,
      name: data.name,
      address: data.address,
      contactEmail: data.contact_email,
      phoneNumber: data.phone_number,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      metadata: data.metadata || {},
    }
  }
  catch (error) {
    console.error('Error fetching organization details:', error)
    throw error
  }
}

export async function updateTeamMemberRole(organizationId: string, memberId: string, role: Role): Promise<void> {
  try {
    const { error } = await supabase
      .from('team_members')
      .update({ role })
      .match({
        organization_id: organizationId,
        id: memberId,
      })

    if (error)
      throw error
  }
  catch (error) {
    console.error('Error updating member role:', error)
    throw error
  }
}

export async function removeTeamMember(organizationId: string, memberId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .match({
        organization_id: organizationId,
        id: memberId,
      })

    if (error)
      throw error
  }
  catch (error) {
    console.error('Error removing team member:', error)
    throw error
  }
}

export async function fetchTeamMembers(organizationId: string): Promise<TeamMember[]> {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('organization_id', organizationId)

    if (error)
      throw error

    return data.map(member => ({
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      status: member.status,
      invitedBy: member.invited_by,
      invitedAt: member.invited_at,
    }))
  }
  catch (error) {
    console.error('Error fetching team members:', error)
    throw error
  }
}

export const organizationService = {
  fetchDetails: fetchOrganizationDetails,
  inviteTeamMember,
  updateTeamMemberRole,
  removeTeamMember,
  fetchTeamMembers,
}
