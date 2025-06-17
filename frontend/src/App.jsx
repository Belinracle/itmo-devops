import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { createBrowserRouter, RouterProvider } from "react-router";
import { SnackbarProvider } from "notistack";

import "@fontsource-variable/inter";
import "dayjs/locale/ru";

import { theme } from "./theme.js";
import Home from "./Home.jsx";
import Admin from "./Admin.jsx";

const router = createBrowserRouter([
    { path: "/", element: <Home/> },
    { path: "/admin", element: <Admin/> },
], {
    basename: "/frontend",
});

const App = () => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <ThemeProvider theme={theme} defaultMode="light" noSsr>
                <SnackbarProvider>
                    <CssBaseline/>
                    <RouterProvider router={router}/>
                </SnackbarProvider>
            </ThemeProvider>
        </LocalizationProvider>
    );
}

export default App;