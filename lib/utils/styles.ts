import { StylesConfig } from "react-select";

const selectStyles: StylesConfig = {
  control: (styles) => ({
    ...styles,
    borderColor: "var(--jupyter-igv-dropdown-control-border-color)",
    backgroundColor: "var(--jupyter-igv-dropdown-control-background-color)",
  }),
  menuPortal: (styles) => ({
    ...styles,
    zIndex: 9999,
    fontSize: "var(--bs-body-font-size)",
    fontFamily: "var(--bs-body-font-family)",
  }),
  menu: (styles) => ({
    ...styles,
    width: "100%",
    backgroundColor: "var(--jupyter-igv-dropdown-menu-background-color)",
  }),
  option: (styles, state) => ({
    ...styles,
    color: "var(--jupyter-igv-dropdown-label-color)",
    backgroundColor: state.isFocused
      ? "var(--jupyter-igv-dropdown-option-hover-background-color)"
      : "var(--jupyter-igv-dropdown-option-background-color)",
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "var(--jupyter-igv-dropdown-label-color)",
  }),
  input: (styles) => ({
    ...styles,
    color: "var(--jupyter-igv-dropdown-label-color)",
  }),
  multiValue: (styles) => {
    return {
      ...styles,
      backgroundColor:
        "var(--jupyter-igv-dropdown-multivalue-label-background-color)",
    };
  },
  multiValueLabel: (styles) => ({
    ...styles,
    color: "var(--jupyter-igv-dropdown-label-color)",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    ":hover": {
      backgroundColor: "var(--bs-red)",
      color: "var(--bs-white)",
    },
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "var(--bs-secondary-color)",
  }),
};

export { selectStyles };
