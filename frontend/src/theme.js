import { createTheme } from "@mui/material";
import { ruRU } from "@mui/material/locale";
import { ruRU as xdpRuRU } from "@mui/x-date-pickers/locales";
import { blue, deepOrange, green, grey, pink, purple, red, yellow } from "@mui/material/colors";

export const theme = createTheme(
    {
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 900,
                lg: 1200,
                xl: 1440,
            },
        },
        cssVariables: {
            colorSchemeSelector: "class"
        },
        colorSchemes: {
            light: {
                palette: {
                    background: {
                        default: grey[100],
                    },
                    primary: {
                        main: '#4489FF',
                    },
                },
            },
            dark: {
                palette: {
                    background: {
                        paper: grey[900],
                    },
                    primary: {
                        main: '#4489FF',
                    },
                },
            },
        },
        components: {
            MuiButton: {
                defaultProps: {
                    disableElevation: true,
                },
                styleOverrides: {
                    root: {
                        padding: `var(--mui-spacing) calc(2 * var(--mui-spacing))`,
                        borderRadius: 'calc(2 * var(--mui-shape-borderRadius))',
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: 'calc(2 * var(--mui-shape-borderRadius))',
                    },
                },
            },
            MuiMenu: {
                styleOverrides: {
                    paper: {
                        borderRadius: 'calc(2 * var(--mui-shape-borderRadius))',
                    },
                    list: {
                        padding: 0,
                    },
                }
            }
        },
        typography: {
            fontFamily: 'Inter Variable',
            button: {
                textTransform: 'none',
            },
        },
    },
    ruRU,
    xdpRuRU
);

export const gradients = [
    `linear-gradient(to bottom right, ${green[300]}, ${blue[300]})`,
    `linear-gradient(to bottom right, ${yellow[300]}, ${red[300]})`,
    `linear-gradient(to bottom right, ${blue[300]}, ${purple[300]})`,
    `linear-gradient(to bottom right, ${pink[300]}, ${deepOrange[300]})`,
];