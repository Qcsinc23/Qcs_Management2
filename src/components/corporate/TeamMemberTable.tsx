import { useState } from 'react';
import { 
  DataGrid, 
  GridColDef, 
  GridToolbar,
  GridSortModel,
  GridFilterModel
} from '@mui/x-data-grid';
import { 
  Button, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Tooltip
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { TeamMember } from './TeamManagement';
import useNotification from '../common/NotificationService';

interface TeamMemberTableProps {
  members: TeamMember[];
  onEdit: (member: TeamMember) => Promise<void>;
  onRemove: (member: TeamMember) => Promise<void>;
}

export default function TeamMemberTable({ members, onEdit, onRemove }: TeamMemberTableProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'name', sort: 'asc' }]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const { notifyError } = useNotification();

  const handleRemoveClick = (member: TeamMember) => {
    setSelectedMember(member);
    setConfirmOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedMember) return;
    
    setLoading(true);
    try {
      await onRemove(selectedMember);
    } catch (error) {
      notifyError('Failed to remove team member');
      console.error('Remove error:', error);
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200, sortable: true, filterable: true },
    { field: 'email', headerName: 'Email', width: 250, sortable: true, filterable: true },
    { field: 'role', headerName: 'Role', width: 150, sortable: true, filterable: true },
    { field: 'status', headerName: 'Status', width: 120, sortable: true, filterable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit member">
            <IconButton 
              aria-label="edit"
              onClick={() => onEdit(params.row)}
              size="small"
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove member">
            <IconButton 
              aria-label="remove"
              onClick={() => handleRemoveClick(params.row)}
              size="small"
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      )
    }
  ];

  return (
    <>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={members}
          columns={columns}
          loading={loading}
          sortModel={sortModel}
          onSortModelChange={(model) => setSortModel(model)}
          filterModel={filterModel}
          onFilterModelChange={(model) => setFilterModel(model)}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableColumnMenu={false}
          disableRowSelectionOnClick
          aria-label="Team members table"
        />
      </div>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">
          Confirm Removal
        </DialogTitle>
        <DialogContent>
          Are you sure you want to remove {selectedMember?.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmRemove} 
            color="error"
            disabled={loading}
          >
            {loading ? 'Removing...' : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
