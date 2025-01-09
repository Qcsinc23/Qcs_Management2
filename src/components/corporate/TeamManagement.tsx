import { useState } from 'react';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import { TeamMemberTable } from './';
import { addTeamMember } from '../../services/organization';
import useNotification from '../common/NotificationService';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending';
}

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useNotification();

  const handleAddMember = async () => {
    try {
      setLoading(true);
      const newMember: TeamMember = {
        id: crypto.randomUUID(),
        name: 'New Member',
        email: 'new.member@example.com',
        role: 'Member',
        status: 'pending'
      };
      
      setTeamMembers(prev => [...prev, newMember]);
      await addTeamMember(newMember);
      notifySuccess('Team member added successfully');
    } catch (error) {
      notifyError('Failed to add team member');
      console.error('Add member error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMember = async (member: TeamMember) => {
    try {
      setLoading(true);
      // TODO: Implement actual edit functionality
      notifySuccess('Team member updated successfully');
    } catch (error) {
      notifyError('Failed to update team member');
      console.error('Edit member error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (member: TeamMember) => {
    try {
      setLoading(true);
      setTeamMembers(prev => prev.filter(m => m.id !== member.id));
      notifySuccess('Team member removed successfully');
    } catch (error) {
      notifyError('Failed to remove team member');
      console.error('Remove member error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Box p={3}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h5">Team Management</Typography>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleAddMember}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Team Member'}
            </Button>
          </Grid>
        </Grid>

        <Box mt={3}>
          <TeamMemberTable 
            members={teamMembers}
            onEdit={handleEditMember}
            onRemove={handleRemoveMember}
          />
        </Box>
      </Box>
    </Card>
  );
}
