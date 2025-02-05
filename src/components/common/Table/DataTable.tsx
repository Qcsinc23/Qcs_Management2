import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  alpha,
} from '@mui/material'

export interface Column<T = any> {
  id: keyof T | 'actions'
  label: string
  minWidth?: number
  align?: 'right' | 'left' | 'center'
  format?: (value: any, row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  hover?: boolean
}

function DataTable<T extends { id: string }>({
  columns,
  rows,
  hover = true,
}: DataTableProps<T>) {
  const theme = useTheme()

  const getCellContent = (column: Column<T>, row: T): React.ReactNode => {
    if (column.id === 'actions') {
      return column.format ? column.format(null, row) : null
    }
    
    const value = row[column.id]
    return column.format ? column.format(value, row) : String(value)
  }

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        boxShadow: 'none',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id.toString()}
                align={column.align}
                style={{ minWidth: column.minWidth }}
                sx={{
                  backgroundColor: alpha(theme.palette.background.default, 0.8),
                  backdropFilter: 'blur(8px)',
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  borderBottom: `2px solid ${theme.palette.divider}`,
                  padding: theme.spacing(2),
                  '&:first-of-type': {
                    paddingLeft: theme.spacing(3),
                  },
                  '&:last-of-type': {
                    paddingRight: theme.spacing(3),
                  },
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.025em',
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              hover={hover}
              key={row.id}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                transition: theme.transitions.create([
                  'background-color',
                  'box-shadow',
                ]),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.action.hover, 0.3),
                  '& td': {
                    color: theme.palette.text.primary,
                  },
                },
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  },
                },
              }}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.id.toString()}
                  align={column.align}
                  sx={{
                    padding: theme.spacing(2),
                    '&:first-of-type': {
                      paddingLeft: theme.spacing(3),
                    },
                    '&:last-of-type': {
                      paddingRight: theme.spacing(3),
                    },
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontSize: '0.875rem',
                    color: theme.palette.text.secondary,
                    transition: theme.transitions.create('color'),
                    ...(column.id === 'actions' && {
                      width: 120,
                      paddingTop: theme.spacing(1),
                      paddingBottom: theme.spacing(1),
                    }),
                  }}
                >
                  {getCellContent(column, row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                sx={{
                  textAlign: 'center',
                  py: 8,
                  color: theme.palette.text.secondary,
                  fontSize: '0.875rem',
                }}
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DataTable