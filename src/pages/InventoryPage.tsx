import type { Column } from '../components/common/Table/DataTable'
import {
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ErrorOutline as ErrorOutlineIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  Warning as WarningIcon,
} from '@mui/icons-material'
import {
  Box,
  Chip,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  useTheme,
} from '@mui/material'
import React, { useState } from 'react'
import { DataCard, StatCard } from '../components/common/Card'
import DataTable from '../components/common/Table/DataTable'

interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  location: string
  lastUpdated: string
  status: 'In Stock' | 'Low Stock' | 'Out of Stock'
}

const mockInventoryData: InventoryItem[] = [
  {
    id: '001',
    name: 'Standard Box (Small)',
    category: 'Packaging',
    quantity: 150,
    location: 'Warehouse A',
    lastUpdated: '2/4/2025',
    status: 'In Stock',
  },
  {
    id: '002',
    name: 'Standard Box (Medium)',
    category: 'Packaging',
    quantity: 100,
    location: 'Warehouse A',
    lastUpdated: '2/4/2025',
    status: 'Low Stock',
  },
  {
    id: '003',
    name: 'Bubble Wrap Roll',
    category: 'Packaging Materials',
    quantity: 75,
    location: 'Warehouse B',
    lastUpdated: '2/4/2025',
    status: 'In Stock',
  },
]

const filterOptions = [
  { label: 'All Items', value: 'all', selected: true },
  { label: 'Low Stock', value: 'low-stock' },
  { label: 'Out of Stock', value: 'out-of-stock' },
  { label: 'In Stock', value: 'in-stock' },
]

const InventoryPage: React.FC = () => {
  const theme = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilter = (filter: string) => {
    setSelectedFilter(filter)
  }

  const handleAddItem = () => {
    // Implement add item functionality
    console.log('Add item clicked')
  }

  const handleEdit = (id: string) => {
    console.log('Edit item:', id)
  }

  const handleDelete = (id: string) => {
    console.log('Delete item:', id)
  }

  const getStatusChip = (status: InventoryItem['status']) => {
    const statusConfig = {
      'In Stock': {
        color: theme.palette.success.main,
        backgroundColor: `${theme.palette.success.main}10`,
        icon: <CheckCircleIcon fontSize="small" />,
      },
      'Low Stock': {
        color: theme.palette.warning.main,
        backgroundColor: `${theme.palette.warning.main}10`,
        icon: <WarningIcon fontSize="small" />,
      },
      'Out of Stock': {
        color: theme.palette.error.main,
        backgroundColor: `${theme.palette.error.main}10`,
        icon: <ErrorOutlineIcon fontSize="small" />,
      },
    }

    const config = statusConfig[status]
    return (
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Chip
          icon={config.icon}
          label={status}
          size="small"
          sx={{
            bgColor: config.backgroundColor,
            color: config.color,
            fontWeight: 500,
            borderRadius: 1.5,
            height: 24,
            fontSize: '0.75rem',
            '& .MuiChip-icon': {
              color: 'inherit',
              marginLeft: '4px',
            },
            '& .MuiChip-label': {
              padding: '0 8px',
            },
          }}
        />
      </Stack>
    )
  }

  const getActionButtons = (row: InventoryItem) => (
    <Stack direction="row" spacing={1} justifyContent="flex-end">
      <Tooltip title="Edit Item">
        <IconButton
          size="small"
          onClick={() => handleEdit(row.id)}
          sx={{
            color: theme.palette.primary.main,
            bgColor: `${theme.palette.primary.main}08`,
            '&:hover': {
              bgColor: `${theme.palette.primary.main}16`,
            },
            minWidth: 30,
            minHeight: 30,
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Item">
        <IconButton
          size="small"
          onClick={() => handleDelete(row.id)}
          sx={{
            color: theme.palette.error.main,
            bgColor: `${theme.palette.error.main}08`,
            '&:hover': {
              bgColor: `${theme.palette.error.main}16`,
            },
            minWidth: 30,
            minHeight: 30,
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  )

  const columns: Column<InventoryItem>[] = [
    { id: 'id', label: 'ID', minWidth: 70 },
    { id: 'name', label: 'Name', minWidth: 200 },
    { id: 'category', label: 'Category', minWidth: 130 },
    {
      id: 'quantity',
      label: 'Quantity',
      minWidth: 100,
      align: 'right',
      format: value => value.toLocaleString(),
    },
    { id: 'location', label: 'Location', minWidth: 130 },
    { id: 'lastUpdated', label: 'Last Updated', minWidth: 130 },
    {
      id: 'status',
      label: 'Status',
      minWidth: 140,
      format: (value: InventoryItem['status']) => getStatusChip(value),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 100,
      align: 'right',
      format: (_, row: InventoryItem) => getActionButtons(row),
    },
  ]

  const filteredData = mockInventoryData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter 
      = selectedFilter === 'all'
      || item.status.toLowerCase().replace(' ', '-') === selectedFilter

    return matchesSearch && matchesFilter
  })

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Stats Row */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Items"
            value={mockInventoryData.length.toString()}
            icon={<InventoryIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Items"
            value="2"
            icon={<WarningIcon />}
            color="warning"
            trend={{
              value: 2,
              label: 'since last week',
              direction: 'up',
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Out of Stock"
            value="0"
            icon={<ErrorOutlineIcon />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Deliveries"
            value="5"
            icon={<ShippingIcon />}
            color="info"
            trend={{
              value: 3,
              label: 'since last week',
              direction: 'down',
            }}
          />
        </Grid>

        {/* Inventory Table */}
        <Grid item xs={12}>
          <DataCard
            title="Inventory Management"
            subtitle="Manage your inventory items"
            searchable
            filterable
            filterOptions={filterOptions}
            onSearch={handleSearch}
            onFilter={handleFilter}
            actions={[
              {
                label: 'Add New Item',
                onClick: handleAddItem,
                icon: <AddIcon />,
              },
            ]}
            data={(
              <DataTable<InventoryItem>
                columns={columns}
                rows={filteredData}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default InventoryPage