import { Box, Container, Typography } from "@mui/material";

const Settings = () => {
  return (
    <Container maxWidth="md">
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Typography variant="h1" component="h1">
                Settings
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Typography variant="h4" component="h2">
                Settings page goes here
              </Typography>
            </Box>
          </Container>
  );
};

export default Settings;