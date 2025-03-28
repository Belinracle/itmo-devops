import { render, screen } from "@testing-library/react";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SnackbarProvider } from "notistack";
import { createBrowserRouter, RouterProvider } from "react-router";

import "dayjs/locale/ru";

import { theme } from "./theme.js";
import Admin from "./Admin.jsx";

const renderWithContext = () => render(
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
        <ThemeProvider theme={theme} defaultMode="light" noSsr>
            <SnackbarProvider>
                <CssBaseline/>
                <RouterProvider router={createBrowserRouter([{ path: "/", element: <Admin/> }])}/>
            </SnackbarProvider>
        </ThemeProvider>
    </LocalizationProvider>
);

describe("Admin component", () => {
    it("Должен рендериться", () => {
        renderWithContext();
        expect(screen.getByText("Управление продуктами")).toBeInTheDocument();
    });

    /*

    it("должен переключать действия", () => {
        render(
            <SnackbarProvider>
                <Admin/>
            </SnackbarProvider>
        );

        const addButton = screen.getByText("Добавление");
        const updateButton = screen.getByText("Изменение");

        fireEvent.click(updateButton);
        expect(updateButton).toHaveAttribute("aria-pressed", "true");
        expect(addButton).toHaveAttribute("aria-pressed", "false");
    });

    it("должен отправлять запрос при клике", async () => {
        render(
            <SnackbarProvider>
                <Admin/>
            </SnackbarProvider>
        );

        fireEvent.click(screen.getByText("Отправить"));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith("/api/some-endpoint", expect.any(Object));
        });
    });*/
});