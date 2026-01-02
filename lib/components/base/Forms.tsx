import Form from "react-bootstrap/Form";
import { OptionalBadge } from "./Badges";
import { FieldErrors, UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps {
  name: string;
  title: string;
  placeholder: string;
  description: string;
  required?: boolean;
  errors: FieldErrors;
  register: UseFormRegisterReturn;
}

export function FormField(props: FormFieldProps) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>
        {props.title}
        {!props.required && <OptionalBadge />}
      </Form.Label>
      <Form.Control
        type="text"
        placeholder={props.placeholder}
        isInvalid={!!props.errors[props.name]}
        {...props.register}
      />
      <Form.Text className="text-muted">{props.description}</Form.Text>
      <div className="small text-danger">
        {props.errors[props.name]?.message}
      </div>
    </Form.Group>
  );
}
