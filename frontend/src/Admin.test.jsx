import { fireEvent, render, screen } from "@testing-library/react";

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
    let addButton, updateButton, deleteButton;
    let id, name, price, avgRating, reviewCount, releaseDate, countryId, manufacturerId;

    beforeEach(() => {
        renderWithContext();
        addButton = screen.getByText("Добавление");
        updateButton = screen.getByText("Изменение");
        deleteButton = screen.getByText("Удаление");
    });

    describe("Режим добавления", () => {
        beforeEach(() => {
            id = screen.queryByLabelText("ID");
            name = screen.queryByLabelText("Имя");
            price = screen.queryByLabelText("Цена, ₽");
            avgRating = screen.queryByLabelText("Рейтинг");
            reviewCount = screen.queryByLabelText("Количество отзывов");
            releaseDate = screen.queryByLabelText("Дата выпуска");
            countryId = screen.queryByLabelText("Страна производства");
            manufacturerId = screen.queryByLabelText("Производитель");
        });

        it("Должен быть выбран по умолчанию", () => {
            expect(addButton).toHaveAttribute("aria-pressed", "true");
            expect(updateButton).toHaveAttribute("aria-pressed", "false");
            expect(deleteButton).toHaveAttribute("aria-pressed", "false");
        });

        it("Должен позволять изменить все параметры, кроме id", () => {
            expect(id).not.toBeInTheDocument();
            expect(name).toBeInTheDocument();
            expect(price).toBeInTheDocument();
            expect(avgRating).toBeInTheDocument();
            expect(reviewCount).toBeInTheDocument();
            expect(releaseDate).toBeInTheDocument();
            expect(countryId).toBeInTheDocument();
            expect(manufacturerId).toBeInTheDocument();
        });
    });

    describe("Режим изменения", () => {
        beforeEach(() => {
            fireEvent.click(updateButton);
            id = screen.queryByLabelText("ID");
            name = screen.queryByLabelText("Имя");
            price = screen.queryByLabelText("Цена, ₽");
            avgRating = screen.queryByLabelText("Рейтинг");
            reviewCount = screen.queryByLabelText("Количество отзывов");
            releaseDate = screen.queryByLabelText("Дата выпуска");
            countryId = screen.queryByLabelText("Страна производства");
            manufacturerId = screen.queryByLabelText("Производитель");
        });

        it("Должен быть включен после нажатии кнопки \"Изменение\"", () => {
            expect(addButton).toHaveAttribute("aria-pressed", "false");
            expect(updateButton).toHaveAttribute("aria-pressed", "true");
            expect(deleteButton).toHaveAttribute("aria-pressed", "false");
        });

        it("Должен позволять изменить все параметры", () => {
            expect(id).toBeInTheDocument();
            expect(name).toBeInTheDocument();
            expect(price).toBeInTheDocument();
            expect(avgRating).toBeInTheDocument();
            expect(reviewCount).toBeInTheDocument();
            expect(releaseDate).toBeInTheDocument();
            expect(countryId).toBeInTheDocument();
            expect(manufacturerId).toBeInTheDocument();
        });
    });

    describe("Режим удаления", () => {
        beforeEach(() => {
            fireEvent.click(deleteButton);
            id = screen.queryByLabelText("ID");
            name = screen.queryByLabelText("Имя");
            price = screen.queryByLabelText("Цена, ₽");
            avgRating = screen.queryByLabelText("Рейтинг");
            reviewCount = screen.queryByLabelText("Количество отзывов");
            releaseDate = screen.queryByLabelText("Дата выпуска");
            countryId = screen.queryByLabelText("Страна производства");
            manufacturerId = screen.queryByLabelText("Производитель");
        });

        it("Должен быть включен после нажатии кнопки \"Удаление\"", () => {
            expect(addButton).toHaveAttribute("aria-pressed", "false");
            expect(updateButton).toHaveAttribute("aria-pressed", "false");
            expect(deleteButton).toHaveAttribute("aria-pressed", "true");
        });

        it("Должен позволять изменить только id", () => {
            expect(id).toBeInTheDocument();
            expect(name).not.toBeInTheDocument();
            expect(price).not.toBeInTheDocument();
            expect(avgRating).not.toBeInTheDocument();
            expect(reviewCount).not.toBeInTheDocument();
            expect(releaseDate).not.toBeInTheDocument();
            expect(countryId).not.toBeInTheDocument();
            expect(manufacturerId).not.toBeInTheDocument();
        });
    });

    /*
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