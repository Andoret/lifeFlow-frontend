import { CircularProgress, Container, Box } from '@mui/material'

function Fallback() {
  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vmh' }}>
        <CircularProgress />
      </Box>
    </Container>
  )
}

export default Fallback
