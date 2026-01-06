import Form from "react-bootstrap/Form";
import { OptionalBadge } from "./Badges";
import { FieldErrors, UseFormRegisterReturn } from "react-hook-form";
import { InputGroup } from "react-bootstrap";

interface FormFieldProps {
  name: string;
  title: string;
  placeholder: string;
  description: string;
  required?: boolean;
  errors: FieldErrors;
  register: UseFormRegisterReturn;
  prefix?: string;
}

export function FormField(props: FormFieldProps) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>
        {props.title}
        {!props.required && <OptionalBadge />}
      </Form.Label>
      <InputGroup>
        {!!props.prefix && <InputGroup.Text>{props.prefix}</InputGroup.Text>}
        <Form.Control
          type="text"
          placeholder={props.placeholder}
          isInvalid={!!props.errors[props.name]}
          {...props.register}
        />
      </InputGroup>
      <Form.Text className="text-muted">{props.description}</Form.Text>
      <div className="small text-danger">
        {props.errors[props.name]?.message}
      </div>
    </Form.Group>
  );
}
