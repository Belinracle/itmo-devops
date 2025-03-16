import { memo, useEffect, useState } from "react";
import { Autocomplete, autocompleteClasses, Checkbox, TextField } from "@mui/material";

const fetchUrl = "http://localhost:80";

// TODO: нужен ли здесь fetch?
const StaticAutocomplete = memo(({ value, filter, setFormState, emptyValueMap }) => {
    const [options, setOptions] = useState([]);

    const handleChange = (e, v) => {
        setFormState((prevState) => ({ ...prevState, [filter]: v.length ? v : emptyValueMap.autoComplete }));
    }

    const fetchOptions = () => {
        fetch(`${fetchUrl}/${filter}`)
            .then((response) => response.json())
            .then((data) => {
                setOptions(data.sort((a, b) => -b.name[0].toUpperCase().localeCompare(a.name[0].toUpperCase())));
            });
    }

    useEffect(() => {
        fetchOptions();
        // eslint-disable-next-line
    }, []);

    return (
        <Autocomplete
            open
            multiple
            disablePortal
            value={value}
            onChange={handleChange}
            forcePopupIcon={false}
            options={options}
            getOptionLabel={(option) => option.name}
            renderOption={({ key, id, ...props }, option, { selected }) => (
                <li key={key} id={id} {...props} aria-selected={false}>
                    <Checkbox id={`${id}:checkbox`} sx={{ p: 0, mr: 1 }} checked={selected}/>
                    {option.name}
                </li>
            )}
            renderInput={(params) => (
                <TextField
                    fullWidth
                    size="small"
                    ref={params.InputProps.ref}
                    placeholder="Найти в списке"
                    slotProps={{ htmlInput: params.inputProps }}
                />
            )}
            slotProps={{
                listbox: {
                    sx: {
                        p: 0,
                        [`.${autocompleteClasses.option}`]: {
                            p: 1,
                        },
                    },
                },
                paper: {
                    elevation: 0,
                    sx: {
                        mt: 1,
                        border: '1px solid',
                        borderColor: 'rgba(var(--mui-palette-common-onBackgroundChannel) / 0.23)',
                        borderRadius: 2,
                        [`.${autocompleteClasses.noOptions}`]: {
                            py: 1,
                        }
                    }
                },
                popper: {
                    sx: {
                        width: '100% !important',
                        transform: 'none !important',
                        position: 'static !important',
                    },
                }
            }}
        />
    );
});

export default StaticAutocomplete;