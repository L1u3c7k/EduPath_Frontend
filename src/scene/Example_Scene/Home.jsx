// src/scene/Home.jsx
import { Container, Typography, Button } from '@mui/material';
import { Header } from '../../components/Example_Components_folder'

export default function Home() {
  return (
    <div>
      <Header />
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Home Page
        </Typography>
        <Button variant="contained">Click Me</Button>
      </Container>
    </div>
  );
}
