import Badge, { BadgeProps } from "react-bootstrap/Badge";

export function OptionalBadge(props: BadgeProps) {
  return (
    <Badge bg="light" className="mx-2" style={{ color: "gray" }} {...props}>
      Optional
    </Badge>
  );
}
