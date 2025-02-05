import React, { useState } from 'react'
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  Button,
  InputAdornment,
  Badge,
  Stack,
  Divider,
  alpha,
} from '@mui/material'
import {
  FilterList as FilterIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from '@mui/icons-material'
import BaseCard from './BaseCard'

interface DataCardProps {
  title: string
  subtitle?: string
  data?: React.ReactNode
  searchable?: boolean
  filterable?: boolean
  filterOptions?: {
    label: string
    value: string
    selected?: boolean
  }[]
  onSearch?: (value: string) => void
  onFilter?: (value: string) => void
  actions?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }[]
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  subtitle,
  data,
  searchable = false,
  filterable = false,
  filterOptions = [],
  onSearch,
  onFilter,
  actions = [],
}) => {
  const theme = useTheme()
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [activeFilters, setActiveFilters] = useState<number>(0)

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setFilterAnchorEl(null)
  }

  const handleFilterSelect = (value: string) => {
    setSelectedFilter(value)
    setActiveFilters(value === 'all' ? 0 : 1)
    onFilter?.(value)
    handleFilterClose()
  }

  const headerActions = (
    <Stack direction="row" spacing={1} alignItems="center">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="contained"
          startIcon={action.icon || <AddIcon />}
          onClick={action.onClick}
          sx={{
            textTransform: 'none',
            px: 2,
            height: 40,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: theme.shadows[2],
            },
          }}
        >
          {action.label}
        </Button>
      ))}
    </Stack>
  )

  return (
    <BaseCard
      title={title}
      subtitle={subtitle}
      action={headerActions}
      headerBorder
    >
      {/* Search and Filter Bar */}
      {(searchable || filterable) && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            mb: 3,
            mt: 1,
            px: 1,
          }}
        >
          {searchable && (
            <TextField
              placeholder="Search..."
              size="small"
              fullWidth
              onChange={(e) => onSearch?.(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: 300,
                '& .MuiOutlinedInput-root': {
                  height: 40,
                  borderRadius: theme.shape.borderRadius,
                  backgroundColor: alpha(theme.palette.background.default, 0.8),
                  transition: theme.transitions.create([
                    'background-color',
                    'box-shadow',
                    'border-color',
                  ]),
                  '&:hover': {
                    backgroundColor: theme.palette.background.default,
                    borderColor: theme.palette.divider,
                  },
                  '&.Mui-focused': {
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: theme.shadows[2],
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          )}
          {filterable && (
            <>
              <Tooltip title="Filter list">
                <Badge 
                  badgeContent={activeFilters} 
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      right: 4,
                      top: 4,
                    },
                  }}
                >
                  <IconButton
                    onClick={handleFilterClick}
                    size="small"
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: filterAnchorEl
                        ? alpha(theme.palette.primary.main, 0.1)
                        : alpha(theme.palette.background.default, 0.8),
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        backgroundColor: theme.palette.background.default,
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    <FilterIcon fontSize="small" />
                  </IconButton>
                </Badge>
              </Tooltip>
              <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1,
                    minWidth: 180,
                    borderRadius: theme.shape.borderRadius,
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                  },
                }}
              >
                {filterOptions.map((option, index) => (
                  <React.Fragment key={option.value}>
                    <MenuItem
                      selected={option.value === selectedFilter}
                      onClick={() => handleFilterSelect(option.value)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&.Mui-selected': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.2),
                          },
                        },
                      }}
                    >
                      <Typography variant="body2">
                        {option.label}
                      </Typography>
                    </MenuItem>
                    {index < filterOptions.length - 1 && (
                      <Divider sx={{ my: 0.5 }} />
                    )}
                  </React.Fragment>
                ))}
              </Menu>
            </>
          )}
        </Box>
      )}

      {/* Content */}
      <Box sx={{ px: 1 }}>
        {data}
      </Box>
    </BaseCard>
  )
}

export default DataCard