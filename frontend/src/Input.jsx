import { FormControl, InputLabel, OutlinedInput } from "@mui/material";

// eslint-disable-next-line no-unused-vars
const Input = ({ id, label, type, placeholder, value, onChange, sx, focused, InputProps, ...rest }) => {
    return (
        <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor={id} shrink>{label}</InputLabel>
            <OutlinedInput
                {...rest}
                {...InputProps}
                id={id}
                size="small"
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                sx={{ mt: 2.5, ...sx }}
            />
        </FormControl>
    );
}

export default Input;