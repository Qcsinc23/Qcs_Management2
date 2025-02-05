import React from 'react'
import { Box, Skeleton, useTheme } from '@mui/material'

interface ContentSkeletonProps {
  variant?: 'text' | 'rectangular' | 'rounded'
  animation?: 'pulse' | 'wave'
  rows?: number
  height?: number | string
  width?: number | string | ((index: number) => number | string)
  spacing?: number
}

export const ContentSkeleton: React.FC<ContentSkeletonProps> = ({
  variant = 'rectangular',
  animation = 'wave',
  rows = 3,
  height = 20,
  width = '100%',
  spacing = 2,
}) => {
  const theme = useTheme()

  const getWidth = (index: number): number | string => {
    if (typeof width === 'function') {
      return width(index)
    }
    return width
  }

  return (
    <Box sx={{ width: '100%' }}>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton
          key={index}
          variant={variant}
          animation={animation}
          height={height}
          width={getWidth(index)}
          sx={{
            marginBottom: index === rows - 1 ? 0 : theme.spacing(spacing),
            borderRadius: theme.shape.borderRadius,
          }}
        />
      ))}
    </Box>
  )
}

interface CardSkeletonProps {
  headerHeight?: number
  contentRows?: number
  contentHeight?: number
  withAction?: boolean
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  headerHeight = 40,
  contentRows = 3,
  contentHeight = 20,
  withAction = false,
}) => {
  const theme = useTheme()

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Skeleton
            variant="rectangular"
            animation="wave"
            height={headerHeight}
            width="60%"
            sx={{ borderRadius: theme.shape.borderRadius }}
          />
        </Box>
        {withAction && (
          <Skeleton
            variant="rectangular"
            animation="wave"
            height={headerHeight}
            width={100}
            sx={{ borderRadius: theme.shape.borderRadius }}
          />
        )}
      </Box>
      <ContentSkeleton
        rows={contentRows}
        height={contentHeight}
        animation="wave"
      />
    </Box>
  )
}

interface StatCardSkeletonProps {
  withIcon?: boolean
}

export const StatCardSkeleton: React.FC<StatCardSkeletonProps> = ({
  withIcon = true,
}) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
      }}
    >
      {withIcon && (
        <Skeleton
          variant="circular"
          animation="wave"
          width={48}
          height={48}
        />
      )}
      <Box sx={{ flex: 1 }}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          height={24}
          width="40%"
          sx={{ mb: 1, borderRadius: theme.shape.borderRadius }}
        />
        <Skeleton
          variant="rectangular"
          animation="wave"
          height={32}
          width="70%"
          sx={{ borderRadius: theme.shape.borderRadius }}
        />
      </Box>
    </Box>
  )
}

export default {
  Content: ContentSkeleton,
  Card: CardSkeleton,
  StatCard: StatCardSkeleton,
}