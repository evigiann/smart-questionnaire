import { Container } from 'react-bootstrap';
import Navigation from './navigation';

function Layout({ children }) {
  return (
    <>
      <Navigation />
      <Container className="my-4">
        {children}
      </Container>
    </>
  );
}

export default Layout;