import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SnackbarProvider } from "notistack";
import { createBrowserRouter, RouterProvider } from "react-router";

import "dayjs/locale/ru";

import { theme } from "./theme.js";
import Home from "./Home.jsx";

const renderWithContext = () => render(
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
        <ThemeProvider theme={theme} defaultMode="light" noSsr>
            <SnackbarProvider>
                <CssBaseline/>
                <RouterProvider router={createBrowserRouter([{ path: "/", element: <Home/> }])}/>
            </SnackbarProvider>
        </ThemeProvider>
    </LocalizationProvider>
);

const product = {
    id: 1,
    name: "iPhone 16",
    price: 100000,
    avgRating: 4.9,
    reviewCount: 10000,
    releaseDate: "2024-09-09",
    countryId: 2,
    manufacturerId: 3,
}

const firstPage = {
    "content": Array.from({ length: 10 }, (_, id) => ({ ...product, id })),
    "totalPages": 3,
    "totalElements": 27,
}

const lastPage = {
    "content": Array.from({ length: 7 }, (_, id) => ({ ...product, id })),
    "totalPages": 3,
    "totalElements": 27,
}

const hugePage = {
    "content": Array.from({ length: 27 }, (_, id) => ({ ...product, id })),
    "totalPages": 1,
    "totalElements": 27,
}

describe("Home component", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("Должен отображать сообщение о том, что товаров нет", async () => {
        global.fetch = vi.fn(() => Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve([])
        }));
        renderWithContext();

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        const [url] = global.fetch.mock.calls[0];

        expect(url).toBe("http://localhost:8080/api/products?pageNumber=0&pageSize=10");
        expect(screen.queryByText("Товары не найдены 😔")).toBeInTheDocument();
    });

    it("Должен отображать сообщение о том, что найдено 27 товаров", async () => {
        global.fetch = vi.fn(() => Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(firstPage)
        }));
        renderWithContext();

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        const [url] = global.fetch.mock.calls[0];

        expect(url).toBe("http://localhost:8080/api/products?pageNumber=0&pageSize=10");
        const span = screen.queryByText(/Найдено товаров/);
        expect(span).toBeInTheDocument();
        expect(within(span).queryByText("27")).toBeInTheDocument();
    });

    it("Должен отображать 10 товаров на станице 1", async () => {
        global.fetch = vi.fn(() => Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(firstPage)
        }));
        renderWithContext();

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        const [url] = global.fetch.mock.calls[0];

        expect(url).toBe("http://localhost:8080/api/products?pageNumber=0&pageSize=10");
        expect(screen.getAllByText("iPhone 16").length).toBe(10);
    });

    it("Должен отображать 7 товаров на станице 3", async () => {
        global.fetch = vi.fn()
            .mockImplementationOnce(() => Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(firstPage),
            }))
            .mockImplementationOnce(() => Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(lastPage),
            }));
        renderWithContext();

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        fireEvent.click(screen.getByRole("button", { name: "Перейти на 3 страницу" }));
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));

        const [url] = global.fetch.mock.calls[1];
        expect(url).toBe("http://localhost:8080/api/products?pageNumber=2&pageSize=10");
        expect(screen.getAllByText("iPhone 16").length).toBe(7);
    });

    it("Должен отображать 27 товаров при смене размера страницы на 30", async () => {
        global.fetch = vi.fn()
            .mockImplementationOnce(() => Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(firstPage),
            }))
            .mockImplementationOnce(() => Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(hugePage),
            }));
        renderWithContext();

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        fireEvent.click(screen.getByText("30"));
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));

        const [url] = global.fetch.mock.calls[1];
        expect(url).toBe("http://localhost:8080/api/products?pageNumber=0&pageSize=30");
        expect(screen.getAllByText("iPhone 16").length).toBe(27);
    });
});