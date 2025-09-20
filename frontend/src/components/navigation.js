import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useEffect, useState } from 'react';

function Navigation() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check admin status from localStorage
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);

    // Listen for storage changes (when admin status changes in other components)
    const handleStorageChange = () => {
      const newAdminStatus = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(newAdminStatus);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check sessionStorage for immediate updates within same tab
    const interval = setInterval(() => {
      const sessionAdminStatus = sessionStorage.getItem('isAdmin') === 'true';
      if (sessionAdminStatus !== isAdmin) {
        setIsAdmin(sessionAdminStatus);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isAdmin]);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm fixed-top" style={{ zIndex: 1030 }}>
      <Container fluid>
        <Navbar.Brand href="/" className="fw-bold fs-3">
          <i className="bi bi-lightning-charge-fill text-warning me-2"></i>
          IntelliQ
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>
                <i className="bi bi-house me-1"></i>
                Home
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/current_questionnaire">
              <Nav.Link>
                <i className="bi bi-clipboard-data me-1"></i>
                Questionnaires
              </Nav.Link>
            </LinkContainer>
            {isAdmin && (
              <LinkContainer to="/admin_page">
                <Nav.Link>
                  <i className="bi bi-gear me-1"></i>
                  Results & Analytics
                </Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;