import { Box, Card, FormControlLabel, Switch, Typography } from '@mui/material'
import { useState } from 'react'

export default function SettingsForm() {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    analytics: false,
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [event.target.name]: event.target.checked,
    })
  }

  return (
    <Card>
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          Application Settings
        </Typography>

        <Box mt={2}>
          <FormControlLabel
            control={(
              <Switch
                checked={settings.darkMode}
                onChange={handleChange}
                name="darkMode"
              />
            )}
            label="Dark Mode"
          />
        </Box>

        <Box mt={2}>
          <FormControlLabel
            control={(
              <Switch
                checked={settings.notifications}
                onChange={handleChange}
                name="notifications"
              />
            )}
            label="Enable Notifications"
          />
        </Box>

        <Box mt={2}>
          <FormControlLabel
            control={(
              <Switch
                checked={settings.analytics}
                onChange={handleChange}
                name="analytics"
              />
            )}
            label="Enable Analytics"
          />
        </Box>
      </Box>
    </Card>
  )
}
