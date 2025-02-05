import React from 'react'
import { Card, CardContent, CardProps, Typography, Box, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'

interface BaseCardProps extends Omit<CardProps, 'title'> {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  action?: React.ReactNode
  loading?: boolean
  noPadding?: boolean
  headerBorder?: boolean
  minHeight?: number | string
  children?: React.ReactNode
}

export const BaseCard: React.FC<BaseCardProps> = ({
  title,
  subtitle,
  action,
  loading = false,
  noPadding = false,
  headerBorder = false,
  minHeight,
  children,
  sx,
  ...rest
}) => {
  const theme = useTheme()

  return (
    <Card
      sx={{
        position: 'relative',
        minHeight,
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.background.paper,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: theme.shape.borderRadius * 1.5,
        '&:hover': {
          boxShadow: theme.shadows[3],
          borderColor: theme.palette.divider,
        },
        transition: theme.transitions.create(['box-shadow', 'border-color'], {
          duration: theme.transitions.duration.short,
        }),
        ...sx,
      }}
      {...rest}
    >
      {(title || subtitle || action) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            p: 3,
            pb: headerBorder ? 2 : 0,
            borderBottom: headerBorder
              ? `1px solid ${theme.palette.divider}`
              : 'none',
          }}
        >
          <Box>
            {title && (
              <Typography
                variant="h6"
                color="textPrimary"
                sx={{ fontWeight: 600, mb: subtitle ? 0.5 : 0 }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {action && (
            <Box sx={{ ml: 2, mt: title ? 0 : -0.5 }}>
              {action}
            </Box>
          )}
        </Box>
      )}
      <CardContent
        sx={{
          height: '100%',
          padding: noPadding ? '0 !important' : '24px !important',
          '&:first-of-type': {
            pt: (title || subtitle || action) ? 2 : 3,
          },
          '&:last-child': {
            pb: '24px !important',
          },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 200,
            }}
          >
            {/* Add Skeleton or Loading component here */}
          </Box>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}

export default BaseCard