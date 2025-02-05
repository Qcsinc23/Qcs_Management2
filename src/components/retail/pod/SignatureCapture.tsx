import {
  Clear as ClearIcon,
  Save as SaveIcon,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { useRef, useState } from 'react'
import SignaturePad from 'react-signature-canvas'

interface SignatureCaptureProps {
  onSave: (signature: string) => void
}

export default function SignatureCapture({ onSave }: SignatureCaptureProps) {
  const signaturePadRef = useRef<SignaturePad>(null)
  const [isEmpty, setIsEmpty] = useState(true)
  const theme = useTheme()

  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear()
      setIsEmpty(true)
    }
  }

  const handleSave = () => {
    if (signaturePadRef.current && !isEmpty) {
      const signatureData = signaturePadRef.current.toDataURL()
      onSave(signatureData)
    }
  }

  const handleBegin = () => {
    setIsEmpty(false)
  }

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Signature
      </Typography>

      <Box
        sx={{
          'border': `2px solid ${theme.palette.divider}`,
          'borderRadius': 1,
          'mb': 2,
          '& canvas': {
            width: '100% !important',
            height: '200px !important',
          },
        }}
      >
        <SignaturePad
          ref={signaturePadRef}
          canvasProps={{
            className: 'signature-canvas',
          }}
          onBegin={handleBegin}
        />
      </Box>

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          startIcon={<ClearIcon />}
          onClick={handleClear}
          variant="outlined"
          color="error"
        >
          Clear
        </Button>
        <Button
          startIcon={<SaveIcon />}
          onClick={handleSave}
          variant="contained"
          disabled={isEmpty}
        >
          Save Signature
        </Button>
      </Stack>
    </Paper>
  )
}
