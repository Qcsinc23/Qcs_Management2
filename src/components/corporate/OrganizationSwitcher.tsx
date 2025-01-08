import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  ExitToApp as LeaveIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useUser,
  useClerk,
  useOrganization,
  useOrganizationList,
} from '@clerk/clerk-react';

interface Organization {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  membersCount: number;
  publicMetadata: Record<string, unknown>;
  slug?: string;
  imageUrl?: string;
}

interface OrganizationMembership {
  id: string;
  role: string;
  organization: Organization;
  publicMetadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export default function OrganizationSwitcher() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();
  const { user } = useUser();
  const clerk = useClerk();
  const { organization } = useOrganization();
  const { userMemberships, createOrganization } = useOrganizationList();

  // Safe type assertion since we know the structure matches
  const memberships = (userMemberships?.data || []) as unknown as OrganizationMembership[];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreateClick = () => {
    handleClose();
    setCreateDialogOpen(true);
  };

  const handleCreateClose = () => {
    setCreateDialogOpen(false);
    setNewOrgName('');
    setError(null);
    setSuccess(null);
  };

  const handleCreateOrganization = async () => {
    if (!newOrgName.trim() || !createOrganization) return;

    setIsCreating(true);
    setError(null);
    setSuccess(null);

    try {
      const org = await createOrganization({ name: newOrgName });
      setSuccess(`Organization "${newOrgName}" created successfully`);
      
      // Close dialog after a short delay to show success message
      setTimeout(() => {
        handleCreateClose();
        // Switch to the new organization
        if (org) {
          clerk.setActive({ organization: org.id }).then(() => {
            navigate('/corporate/onboarding');
          });
        }
      }, 1500);
    } catch (err) {
      console.error('Error creating organization:', err);
      setError('Failed to create organization. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSwitchOrganization = async (orgId: string) => {
    handleClose();
    try {
      const membership = memberships.find(
        (mem) => mem.organization.id === orgId
      );
      if (membership) {
        await clerk.setActive({ organization: orgId });
        navigate('/corporate');
      }
    } catch (err) {
      console.error('Error switching organization:', err);
      setError('Failed to switch organization. Please try again.');
    }
  };

  const handleManageOrganizations = () => {
    handleClose();
    navigate('/corporate/settings/organizations');
  };

  return (
    <>
      <Button
        onClick={handleClick}
        startIcon={<BusinessIcon />}
        sx={{
          textTransform: 'none',
          color: 'inherit',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {organization?.name || 'Select Organization'}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {memberships.map((membership) => (
          <MenuItem
            key={membership.organization.id}
            onClick={() => handleSwitchOrganization(membership.organization.id)}
            selected={membership.organization.id === organization?.id}
          >
            <ListItemIcon>
              <BusinessIcon />
            </ListItemIcon>
            <ListItemText primary={membership.organization.name} />
          </MenuItem>
        ))}

        <Divider />

        <MenuItem onClick={handleCreateClick}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Create Organization" />
        </MenuItem>

        <MenuItem onClick={handleManageOrganizations}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Organizations" />
        </MenuItem>
      </Menu>

      <Dialog
        open={createDialogOpen}
        onClose={handleCreateClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Organization</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          <Typography color="text.secondary" paragraph>
            Create a new organization to manage your corporate account.
          </Typography>
          <TextField
            autoFocus
            label="Organization Name"
            fullWidth
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            disabled={isCreating}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose} disabled={isCreating}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateOrganization}
            variant="contained"
            disabled={!newOrgName.trim() || isCreating}
          >
            {isCreating ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
