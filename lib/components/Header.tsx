import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import IGVLogo from "./IGVLogo.tsx";
import ReferenceDropdown from "./ReferenceDropdown.tsx";
import TracksDropdown from "./TracksDropdown.tsx";

export default function Header() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary border-bottom border-top">
      <Container fluid>
        <Navbar.Brand>Jupyter IGV</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <ReferenceDropdown />
            <TracksDropdown />
          </Nav>
          <Nav>
            <Nav.Link href="https://igv.org/">
              <IGVLogo />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
