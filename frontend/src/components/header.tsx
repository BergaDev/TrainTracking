import { Typography } from '@mui/material';

const Header = () => (
  <header>
    <Typography
      variant="h5"
      component="div"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        m: 3,
        color: '#FFD600',
        fontWeight: 700,
      }}
    >
      Matthew Bergamini
    </Typography>
  </header>
);

export default Header;
