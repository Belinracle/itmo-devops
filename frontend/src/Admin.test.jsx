import { fireEvent, render, screen, waitFor } from "@testing-library/react";

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

const product = {
    id: "1",
    name: "iPhone 16",
    price: "100000",
    avgRating: "4.9",
    reviewCount: "10000",
    releaseDate: "2024-09-08T21:00:00.000Z",
    countryId: "2",
    manufacturerId: "3",
}
const { id, ...productWithoutId } = product;

describe("Admin component", () => {
    let addButton, updateButton, deleteButton, resetButton, executeButton;
    let inputsMap = {};

    beforeEach(() => {
        vi.restoreAllMocks();
        renderWithContext();
        addButton = screen.getByText("Добавление");
        updateButton = screen.getByText("Изменение");
        deleteButton = screen.getByText("Удаление");
        resetButton = screen.getByText("Сброс полей");
        executeButton = screen.getByText("Выполнить");
    });

    describe("Режим добавления", () => {
        beforeEach(() => {
            inputsMap = {
                id: screen.queryByLabelText("ID"),
                name: screen.queryByLabelText("Имя"),
                price: screen.queryByLabelText("Цена, ₽"),
                avgRating: screen.queryByLabelText("Рейтинг"),
                reviewCount: screen.queryByLabelText("Количество отзывов"),
                releaseDate: screen.queryByLabelText("Дата выпуска"),
                countryId: screen.queryByLabelText("Страна производства"),
                manufacturerId: screen.queryByLabelText("Производитель")
            };
        });

        it("Должен быть выбран по умолчанию", () => {
            expect(addButton).toHaveAttribute("aria-pressed", "true");
            expect(updateButton).toHaveAttribute("aria-pressed", "false");
            expect(deleteButton).toHaveAttribute("aria-pressed", "false");
        });

        it("Должен позволять изменить все параметры, кроме id", () => {
            Object.entries(inputsMap).forEach(([key, value]) => {
                if (key === "id") {
                    expect(value).not.toBeInTheDocument();
                } else {
                    expect(value).toBeInTheDocument();
                }
            });
        });

        it("Должен добавлять продукт", async () => {
            global.fetch = vi.fn(() => Promise.resolve({
                ok: true,
                status: 201,
                text: () => Promise.resolve("1")
            }));
            Object.entries(inputsMap).forEach(([key, value]) => {
                if (key === "releaseDate") {
                    fireEvent.change(value, { target: { value: "09.09.24" } });
                } else if (key !== "id") {
                    fireEvent.change(value, { target: { value: product[key] } });
                }
            });
            fireEvent.click(executeButton);

            await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
            const [url, options] = global.fetch.mock.calls[0];

            expect(url).toBe("http://localhost:8080/api/products");
            expect(options.method).toBe("POST");
            expect(options.body).toBe(JSON.stringify(productWithoutId));
            expect(screen.queryByText("Продукт успешно добавлен! Его ID: 1")).toBeInTheDocument();
        });

        it("Не должен добавлять продукт при ошибке сервера", async () => {
            global.fetch = vi.fn(() => Promise.resolve({
                ok: false,
                status: 500,
                text: () => Promise.resolve("Internal error")
            }));
            Object.entries(inputsMap).forEach(([key, value]) => {
                if (key === "releaseDate") {
                    fireEvent.change(value, { target: { value: "09.09.24" } });
                } else if (key !== "id") {
                    fireEvent.change(value, { target: { value: product[key] } });
                }
            });
            fireEvent.click(executeButton);

            await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
            const [url, options] = global.fetch.mock.calls[0];

            expect(url).toBe("http://localhost:8080/api/products");
            expect(options.method).toBe("POST");
            expect(options.body).toBe(JSON.stringify(productWithoutId));
            expect(screen.queryByText("При добавлении произошла ошибка! Код: 500")).toBeInTheDocument();
        });

        it("Не должен добавлять продукт при ошибке связи", async () => {
            global.fetch = vi.fn(() => Promise.reject());
            Object.entries(inputsMap).forEach(([key, value]) => {
                if (key === "releaseDate") {
                    fireEvent.change(value, { target: { value: "09.09.24" } });
                } else if (key !== "id") {
                    fireEvent.change(value, { target: { value: product[key] } });
                }
            });
            fireEvent.click(executeButton);

            await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
            const [url, options] = global.fetch.mock.calls[0];

            expect(url).toBe("http://localhost:8080/api/products");
            expect(options.method).toBe("POST");
            expect(options.body).toBe(JSON.stringify(productWithoutId));
            expect(screen.queryByText("При добавлении произошла ошибка связи!")).toBeInTheDocument();
        });
    });

    describe("Режим изменения", () => {
        beforeEach(() => {
            fireEvent.click(updateButton);
            inputsMap = {
                id: screen.queryByLabelText("ID"),
                name: screen.queryByLabelText("Имя"),
                price: screen.queryByLabelText("Цена, ₽"),
                avgRating: screen.queryByLabelText("Рейтинг"),
                reviewCount: screen.queryByLabelText("Количество отзывов"),
                releaseDate: screen.queryByLabelText("Дата выпуска"),
                countryId: screen.queryByLabelText("Страна производства"),
                manufacturerId: screen.queryByLabelText("Производитель")
            };
        });

        it("Должен быть включен после нажатии кнопки \"Изменение\"", () => {
            expect(addButton).toHaveAttribute("aria-pressed", "false");
            expect(updateButton).toHaveAttribute("aria-pressed", "true");
            expect(deleteButton).toHaveAttribute("aria-pressed", "false");
        });

        it("Должен позволять изменить все параметры", () => {
            Object.values(inputsMap).forEach((value) => expect(value).toBeInTheDocument());
        });

        it("Должен изменять продукт с id 1", async () => {
            global.fetch = vi.fn(() => Promise.resolve({ ok: true, status: 200 }));
            Object.entries(inputsMap).forEach(([key, value]) => {
                if (key === "releaseDate") {
                    fireEvent.change(value, { target: { value: "09.09.24" } });
                } else {
                    fireEvent.change(value, { target: { value: product[key] } });
                }
            });
            fireEvent.click(executeButton);

            await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
            const [url, options] = global.fetch.mock.calls[0];

            expect(url).toBe("http://localhost:8080/api/products/1");
            expect(options.method).toBe("PUT");
            expect(options.body).toBe(JSON.stringify(product));
            expect(screen.queryByText("Продукт с ID 1 успешно обновлен!")).toBeInTheDocument();
        });

        it("Не должен изменять продукт с несуществующим id 2", async () => {
            global.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 404 }));
            Object.entries(inputsMap).forEach(([key, value]) => {
                if (key === "releaseDate") {
                    fireEvent.change(value, { target: { value: "09.09.24" } });
                } else if (key === "id") {
                    fireEvent.change(value, { target: { value: "2" } });
                } else {
                    fireEvent.change(value, { target: { value: product[key] } });
                }
            });
            fireEvent.click(executeButton);

            await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
            const [url, options] = global.fetch.mock.calls[0];

            expect(url).toBe("http://localhost:8080/api/products/2");
            expect(options.method).toBe("PUT");
            expect(options.body).toBe(JSON.stringify({ ...product, id: "2" }));
            expect(screen.queryByText("При обновлении произошла ошибка! Код: 404")).toBeInTheDocument();
        });

        it("Не должен изменять продукт при ошибке связи", async () => {
            global.fetch = vi.fn(() => Promise.reject());
            Object.entries(inputsMap).forEach(([key, value]) => {
                if (key === "releaseDate") {
                    fireEvent.change(value, { target: { value: "09.09.24" } });
                } else {
                    fireEvent.change(value, { target: { value: product[key] } });
                }
            });
            fireEvent.click(executeButton);

            await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
            const [url, options] = global.fetch.mock.calls[0];

            expect(url).toBe("http://localhost:8080/api/products/1");
            expect(options.method).toBe("PUT");
            expect(options.body).toBe(JSON.stringify(product));
            expect(screen.queryByText("При обновлении произошла ошибка связи!")).toBeInTheDocument();
        });
    });

    describe("Режим удаления", () => {
        beforeEach(() => {
            fireEvent.click(deleteButton);
            inputsMap = {
                id: screen.queryByLabelText("ID"),
                name: screen.queryByLabelText("Имя"),
                price: screen.queryByLabelText("Цена, ₽"),
                avgRating: screen.queryByLabelText("Рейтинг"),
                reviewCount: screen.queryByLabelText("Количество отзывов"),
                releaseDate: screen.queryByLabelText("Дата выпуска"),
                countryId: screen.queryByLabelText("Страна производства"),
                manufacturerId: screen.queryByLabelText("Производитель")
            };
        });

        it("Должен быть включен после нажатии кнопки \"Удаление\"", () => {
            expect(addButton).toHaveAttribute("aria-pressed", "false");
            expect(updateButton).toHaveAttribute("aria-pressed", "false");
            expect(deleteButton).toHaveAttribute("aria-pressed", "true");
        });

        it("Должен позволять изменить только id", () => {
            Object.entries(inputsMap).forEach(([key, value]) => {
                if (key === "id") {
                    expect(value).toBeInTheDocument();
                } else {
                    expect(value).not.toBeInTheDocument();
                }
            });
        });

        it("Должен удалять продукт с id 1", async () => {
            global.fetch = vi.fn(() => Promise.resolve({ ok: true, status: 200 }));
            fireEvent.change(inputsMap.id, { target: { value: "1" } });
            fireEvent.click(executeButton);

            await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
            const [url, options] = global.fetch.mock.calls[0];

            expect(url).toBe("http://localhost:8080/api/products/1");
            expect(options.method).toBe("DELETE");
            expect(screen.queryByText("Продукт с ID 1 успешно удален!")).toBeInTheDocument();
        });

        it("Не должен удалять продукт с несуществующим id 2", async () => {
            global.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 404 }));
            fireEvent.change(inputsMap.id, { target: { value: "2" } });
            fireEvent.click(executeButton);

            await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
            const [url, options] = global.fetch.mock.calls[0];

            expect(url).toBe("http://localhost:8080/api/products/2");
            expect(options.method).toBe("DELETE");
            expect(screen.queryByText("При удалении произошла ошибка! Код: 404")).toBeInTheDocument();
        });

        it("Не должен удалять продукт при ошибке связи", async () => {
            global.fetch = vi.fn(() => Promise.reject());
            fireEvent.change(inputsMap.id, { target: { value: "1" } });
            fireEvent.click(executeButton);

            await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
            const [url, options] = global.fetch.mock.calls[0];

            expect(url).toBe("http://localhost:8080/api/products/1");
            expect(options.method).toBe("DELETE");
            expect(screen.queryByText("При удалении произошла ошибка связи!")).toBeInTheDocument();
        });
    });
});