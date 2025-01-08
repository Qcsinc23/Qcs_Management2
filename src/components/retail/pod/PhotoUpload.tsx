import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  Stack,
  CircularProgress,
  ImageList,
  ImageListItem,
  useTheme,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  AddAPhoto as AddPhotoIcon,
} from '@mui/icons-material';

interface PhotoUploadProps {
  onSave: (photos: string[]) => void;
  maxPhotos?: number;
}

export default function PhotoUpload({ onSave, maxPhotos = 3 }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      const newPhotos: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        if (photos.length + newPhotos.length >= maxPhotos) break;
        
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        const reader = new FileReader();
        const photoDataUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        newPhotos.push(photoDataUrl);
      }

      const updatedPhotos = [...photos, ...newPhotos];
      setPhotos(updatedPhotos);
      onSave(updatedPhotos);
    } catch (error) {
      console.error('Error processing photos:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    onSave(updatedPhotos);
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Delivery Photos
      </Typography>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        multiple
        onChange={handleFileSelect}
      />

      {photos.length > 0 ? (
        <Box sx={{ mb: 2 }}>
          <ImageList cols={3} gap={8}>
            {photos.map((photo, index) => (
              <ImageListItem key={index} sx={{ position: 'relative' }}>
                <img
                  src={photo}
                  alt={`Delivery photo ${index + 1}`}
                  loading="lazy"
                  style={{
                    borderRadius: theme.shape.borderRadius,
                    height: '150px',
                    width: '100%',
                    objectFit: 'cover',
                  }}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                  onClick={() => handleDelete(index)}
                >
                  <DeleteIcon sx={{ color: 'white' }} />
                </IconButton>
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      ) : (
        <Box
          sx={{
            border: `2px dashed ${theme.palette.divider}`,
            borderRadius: 1,
            p: 3,
            mb: 2,
            textAlign: 'center',
          }}
        >
          <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography color="text.secondary">
            No photos uploaded yet
          </Typography>
        </Box>
      )}

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          startIcon={isUploading ? <CircularProgress size={20} /> : <AddPhotoIcon />}
          onClick={handleAddClick}
          variant="contained"
          disabled={isUploading || photos.length >= maxPhotos}
        >
          Add Photo{photos.length > 0 ? ` (${photos.length}/${maxPhotos})` : ''}
        </Button>
      </Stack>
    </Paper>
  );
}