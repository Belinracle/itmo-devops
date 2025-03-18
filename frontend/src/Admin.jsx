import { useState } from "react";

import { Box, Button, Stack, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import Navbar from "./Navbar.jsx";
import Input from "./Input.jsx";

const fields = [
    { type: "text", name: "name", label: "Имя", placeholder: "Имя продукта" },
    { type: "number", name: "price", label: "Цена, ₽", placeholder: "От 1 до 1000000" },
    { type: "number", name: "avgRating", label: "Рейтинг", placeholder: "От 1 до 5" },
    { type: "number", name: "reviewCount", label: "Количество отзывов", placeholder: "Любое число" },
    { type: "date", name: "releaseDate", label: "Дата выпуска" },
    { type: "number", name: "countryId", label: "Страна производства", placeholder: "От 1 до 10" },
    { type: "number", name: "manufacturerId", label: "Производитель", placeholder: "От 1 до 100" },
];

const emptyValueMap = { text: "", number: "", date: null };
const emptyState = Object.fromEntries(fields.map(({ type, name }) => [name, emptyValueMap[type]]));

const apiUrl = "http://localhost:8080/products";

const Admin = () => {
    const [formState, setFormState] = useState(emptyState);
    const emptyFieldCount = Object.keys(formState).filter((key) => formState[key] === emptyState[key]).length;

    const addProduct = () => {
        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formState)
        }).then();
    }

    const handleInputChange = (name) => (
        (e) => {
            setFormState((prevState) => ({ ...prevState, [name]: e.target.value }));
        }
    );

    const handleDateChange = (name) => (
        (e) => {
            setFormState((prevState) => ({ ...prevState, [name]: e }));
        }
    );

    const handleResetClick = () => setFormState(emptyState);
    const handleApplyClick = () => addProduct();

    return (
        <>
            <Navbar/>
            <Box p={{ xs: 2, sm: 3 }}>
                <Stack spacing={1} sx={{ p: 2, maxWidth: 336, bgcolor: 'background.paper', borderRadius: 3 }} mx="auto">
                    <Typography variant="h6" fontWeight="bold">Добавление продукта</Typography>
                    {fields.map(({ type, name, label, placeholder }) => (
                        (type === "text" || type === "number") ? (
                            <Input
                                key={name}
                                type={type}
                                label={label}
                                value={formState[name]}
                                onChange={handleInputChange(name)}
                                placeholder={placeholder}
                            />
                        ) : type === "date" ? (
                            <DatePicker
                                key={name}
                                disableFuture
                                format="DD.MM.YY"
                                slots={{ textField: Input }}
                                slotProps={{ textField: { label } }}
                                value={formState[name]}
                                onChange={handleDateChange(name)}
                            />
                        ) : null
                    ))}
                    <Stack direction="row" spacing={1} pt={1}>
                        <Button
                            fullWidth
                            color="inherit"
                            variant="contained"
                            disabled={emptyFieldCount === fields.length}
                            onClick={handleResetClick}
                        >
                            Сбросить
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            disabled={emptyFieldCount > 0}
                            onClick={handleApplyClick}
                        >
                            Применить
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </>
    );
}

export default Admin;