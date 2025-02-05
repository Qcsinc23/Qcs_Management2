import React from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import BaseCard from './BaseCard'
import { StatCardSkeleton } from '../Skeleton/ContentSkeleton'

interface StatCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
    direction: 'up' | 'down' | 'neutral'
  }
  loading?: boolean
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  loading = false,
  color = 'primary',
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
      <BaseCard>
        <StatCardSkeleton withIcon={!!icon} />
      </BaseCard>
    )
  }

  return (
    <BaseCard>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: theme.spacing(2),
        }}
      >
        {icon && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: alpha(theme.palette[color].main, 0.1),
              color: theme.palette[color].main,
            }}
          >
            {icon}
          </Box>
        )}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mb: 0.5 }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            color="textPrimary"
            sx={{ mb: trend ? 1 : 0 }}
          >
            {value}
          </Typography>
          {trend && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: getTrendColor(trend.direction),
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {trend.value}%
                {trend.direction === 'up' && '↑'}
                {trend.direction === 'down' && '↓'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {trend.label}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </BaseCard>
  )
}

export default StatCard