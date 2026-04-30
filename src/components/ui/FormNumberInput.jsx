import { TextField } from "@mui/material";

const FormNumberInput = ({ label, value, onChange, error, helperText }) => {
  return (
    <TextField
      fullWidth
      type="number"
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      inputProps={{ min: 0 }}
    />
  );
};

export default FormNumberInput;
