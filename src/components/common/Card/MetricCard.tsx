import React, { ReactNode } from 'react'
import { Box, Typography, useTheme, IconButton, Tooltip } from '@mui/material'
import { Info as InfoIcon } from '@mui/icons-material'
import { alpha } from '@mui/material/styles'
import BaseCard from './BaseCard'
import { CardSkeleton } from '../Skeleton/ContentSkeleton'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  chart?: ReactNode
  info?: string
  loading?: boolean
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  trend?: {
    value: number
    label: string
    direction: 'up' | 'down' | 'neutral'
  }
  footer?: ReactNode
  height?: number | string
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  chart,
  info,
  loading = false,
  color = 'primary',
  trend,
  footer,
  height,
}) => {
  const theme = useTheme()

  const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return theme.palette.success.main
      case 'down':
        return theme.palette.error.main
      default:
        return theme.palette.text.secondary
    }
  }

  if (loading) {
    return (
      <BaseCard sx={{ height }}>
        <CardSkeleton withAction={!!info} />
      </BaseCard>
    )
  }

  return (
    <BaseCard sx={{ height }}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" color="textPrimary">
                {title}
              </Typography>
              {info && (
                <Tooltip title={info}>
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: theme.palette[color].main,
                fontWeight: 600,
              }}
            >
              {value}
            </Typography>
            {trend && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  backgroundColor: alpha(getTrendColor(trend.direction), 0.1),
                  color: getTrendColor(trend.direction),
                  padding: '4px 8px',
                  borderRadius: '16px',
                }}
              >
                <Typography variant="body2">
                  {trend.value}%
                  {trend.direction === 'up' && '↑'}
                  {trend.direction === 'down' && '↓'}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {chart && (
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              mb: footer ? 2 : 0,
            }}
          >
            {chart}
          </Box>
        )}

        {footer && (
          <Box
            sx={{
              mt: 'auto',
              pt: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            {footer}
          </Box>
        )}
      </Box>
    </BaseCard>
  )
}

export default MetricCard