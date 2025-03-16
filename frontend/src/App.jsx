import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"

import { createBrowserRouter, RouterProvider } from "react-router";

import "@fontsource-variable/inter";
import "dayjs/locale/ru";

import { theme } from "./theme.js";
import Home from "./Home.jsx";

// TODO: админская панель
const router = createBrowserRouter([
    { path: "/", element: <Home/> },
]);

const App = () => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <ThemeProvider theme={theme} defaultMode="light" noSsr>
                <CssBaseline/>
                <RouterProvider router={router}/>
            </ThemeProvider>
        </LocalizationProvider>
    );
}

export default App;