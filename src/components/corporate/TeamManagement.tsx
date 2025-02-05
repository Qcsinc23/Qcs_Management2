import type { Role, TeamMember } from '../../services/organization'
import { useOrganization } from '@clerk/clerk-react'
import {
  Alert,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { organizationService } from '../../services/organization'
import useNotification from '../common/NotificationService'
import { TeamMemberTable } from './'

const ROLES: { label: string, value: Role }[] = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Manager', value: 'MANAGER' },
  { label: 'Viewer', value: 'VIEWER' },
]

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(false)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<Role>('VIEWER')
  const { notifySuccess, notifyError } = useNotification()
  const { organization } = useOrganization()

  const loadTeamMembers = async () => {
    if (!organization?.id)
      return

    try {
      setLoading(true)
      const members = await organizationService.fetchTeamMembers(organization.id)
      setTeamMembers(members)
    }
    catch (error) {
      console.error('Error loading team members:', error)
      notifyError('Failed to load team members')
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (organization?.id) {
      void loadTeamMembers()
    }
  }, [organization?.id])

  const handleInviteMember = async () => {
    if (!organization?.id)
      return
    try {
      setLoading(true)
      await organizationService.inviteTeamMember({
        email: inviteEmail,
        role: inviteRole,
        organizationId: organization.id,
      })

      await loadTeamMembers()
      setInviteDialogOpen(false)
      setInviteEmail('')
      setInviteRole('VIEWER')
      notifySuccess('Team member invited successfully')
    }
    catch (error) {
      notifyError('Failed to add team member')
      console.error('Add member error:', error)
    }
    finally {
      setLoading(false)
    }
  }

  const handleEditMember = async (member: TeamMember, newRole: Role) => {
    if (!organization?.id)
      return
    try {
      setLoading(true)
      await organizationService.updateTeamMemberRole(
        organization.id,
        member.id,
        newRole,
      )
      await loadTeamMembers()
      notifySuccess('Team member role updated successfully')
    }
    catch (error) {
      notifyError('Failed to update team member')
      console.error('Edit member error:', error)
    }
    finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (member: TeamMember) => {
    if (!organization?.id)
      return
    try {
      setLoading(true)
      await organizationService.removeTeamMember(organization.id, member.id)
      await loadTeamMembers()
      notifySuccess('Team member removed successfully')
    }
    catch (error) {
      notifyError('Failed to remove team member')
      console.error('Remove member error:', error)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <Box p={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h5">Team Management</Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setInviteDialogOpen(true)}
                  disabled={loading || !organization?.id}
                >
                  Invite Team Member
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            {!organization?.id
              ? (
                  <Alert severity="info">
                    Please select an organization to manage team members.
                  </Alert>
                )
              : (
                  <TeamMemberTable
                    members={teamMembers}
                    onEdit={handleEditMember}
                    onRemove={handleRemoveMember}
                    loading={loading}
                  />
                )}
          </Grid>
        </Grid>

        <Dialog
          open={inviteDialogOpen}
          onClose={() => setInviteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={inviteRole}
                  label="Role"
                  onChange={e => setInviteRole(e.target.value as Role)}
                >
                  {ROLES.map(role => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => void handleInviteMember()}
              variant="contained"
              disabled={!inviteEmail || loading}
            >
              {loading ? 'Inviting...' : 'Send Invite'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Card>
  )
}
