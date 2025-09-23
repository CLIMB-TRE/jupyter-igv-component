import Badge from "react-bootstrap/Badge";

export function RequiredBadge() {
  return (
    <Badge bg="light" style={{ color: "red" }}>
      Required
    </Badge>
  );
}

export function OptionalBadge() {
  return (
    <Badge bg="light" style={{ color: "blue" }}>
      Optional
    </Badge>
  );
}
