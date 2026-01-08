import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import IGVLogo from "./IGVLogo.tsx";
import ReferenceDropdown from "./ReferenceDropdown.tsx";
import TracksDropdown from "./TracksDropdown.tsx";

export default function Header() {
  return (
    <Navbar
      style={{ backgroundColor: "#121212" }}
      className="border-bottom"
      variant="dark"
      expand="lg"
    >
      <Container fluid>
        <Navbar.Brand>Jupyter IGV</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <ReferenceDropdown />
            <TracksDropdown />
          </Nav>
          <Nav>
            <Nav.Link href="https://igv.org/" className="p-0">
              <IGVLogo />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
