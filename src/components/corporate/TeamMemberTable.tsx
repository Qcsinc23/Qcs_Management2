import type {
  SelectChangeEvent,
} from '@mui/material'
import type {
  GridColDef,
  GridFilterModel,
  GridSortModel,
} from '@mui/x-data-grid'
import type { Role, TeamMember } from '../../services/organization'
import { Delete, Edit } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from '@mui/material'
import {
  DataGrid,
  GridToolbar,
} from '@mui/x-data-grid'
import { useState } from 'react'
import useNotification from '../common/NotificationService'

interface TeamMemberTableProps {
  members: TeamMember[]
  onEdit: (member: TeamMember, newRole: Role) => Promise<void>
  onRemove: (member: TeamMember) => Promise<void>
  loading?: boolean
}

const ROLES: { label: string, value: Role }[] = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Manager', value: 'MANAGER' },
  { label: 'Viewer', value: 'VIEWER' },
]

export default function TeamMemberTable({ members, onEdit, onRemove, loading = false }: TeamMemberTableProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role>('VIEWER')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'name', sort: 'asc' }])
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] })
  const { notifyError } = useNotification()

  const handleEditClick = (member: TeamMember) => {
    setSelectedMember(member)
    setSelectedRole(member.role)
    setEditDialogOpen(true)
  }

  const handleEditSubmit = async () => {
    if (!selectedMember)
      return

    setIsSubmitting(true)
    try {
      await onEdit(selectedMember, selectedRole)
      setEditDialogOpen(false)
    }
    catch (error) {
      notifyError('Failed to update team member')
      console.error('Edit error:', error)
    }
    finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveClick = (member: TeamMember) => {
    setSelectedMember(member)
    setConfirmOpen(true)
  }

  const handleConfirmRemove = async () => {
    if (!selectedMember)
      return

    setIsSubmitting(true)
    try {
      await onRemove(selectedMember)
    }
    catch (error) {
      notifyError('Failed to remove team member')
      console.error('Remove error:', error)
    }
    finally {
      setIsSubmitting(false)
      setConfirmOpen(false)
    }
  }

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
      renderCell: params => (
        <>
          <Tooltip title="Edit member">
            <IconButton
              aria-label="edit"
              onClick={() => handleEditClick(params.row)}
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
      ),
    },
  ]

  return (
    <>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={members}
          columns={columns}
          loading={loading}
          sortModel={sortModel}
          onSortModelChange={model => setSortModel(model)}
          filterModel={filterModel}
          onFilterModelChange={model => setFilterModel(model)}
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

      {/* Remove Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">
          Confirm Removal
        </DialogTitle>
        <DialogContent>
          Are you sure you want to remove
          {' '}
          {selectedMember?.name}
          ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRemove}
            color="error"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Removing...' : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        aria-labelledby="edit-dialog-title"
      >
        <DialogTitle id="edit-dialog-title">
          Edit Team Member Role
        </DialogTitle>
        <DialogContent>
          <div style={{ minWidth: '300px', marginTop: '16px' }}>
            {selectedMember && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Name:</strong>
                  {' '}
                  {selectedMember.name}
                  <br />
                  <strong>Email:</strong>
                  {' '}
                  {selectedMember.email}
                </div>
                <FormControl fullWidth>
                  <InputLabel id="role-select-label">Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role-select"
                    value={selectedRole}
                    label="Role"
                    onChange={(e: SelectChangeEvent) => setSelectedRole(e.target.value as Role)}
                  >
                    {ROLES.map(role => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={isSubmitting || !selectedMember || selectedRole === selectedMember.role}
          >
            {isSubmitting ? 'Updating...' : 'Update Role'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
