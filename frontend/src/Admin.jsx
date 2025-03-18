import { useState } from "react";
import { Box, Button, Grid2, Stack, Typography, useTheme } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useSnackbar } from "notistack";

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

const apiUrl = "http://localhost:8080/api/products";

const addProduct = (formState, setIsAdding, enqueueSnackbar) => {
    setIsAdding(true);
    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState)
    })
        .then((response) => response.text().then((text) => ({ response, text })))
        .then(({ response, text }) => {
            if (response.ok) {
                enqueueSnackbar(`Продукт успешно добавлен! Его ID: ${text}`, { variant: "success" });
            } else {
                enqueueSnackbar(`При добавлении произошла ошибка! Код: ${response.status}`, { variant: "error" });
            }
        })
        .catch(() => {
            enqueueSnackbar("При добавлении произошла ошибка связи!", { variant: "error" });
        })
        .finally(() => setIsAdding(false));
}

const deleteProduct = (id, setIsDeleting, enqueueSnackbar) => {
    setIsDeleting(true);
    fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
    })
        .then((response) => {
            if (response.ok) {
                enqueueSnackbar(`Продукт с ID ${id} успешно удален!`, { variant: "success" });
            } else {
                enqueueSnackbar(`При удалении произошла ошибка! Код: ${response.status}`, { variant: "error" });
            }
        })
        .catch(() => {
            enqueueSnackbar("При удалении произошла ошибка связи!", { variant: "error" });
        })
        .finally(() => setIsDeleting(false));
}

const Admin = () => {
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();

    const [isAdding, setIsAdding] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [formState, setFormState] = useState(emptyState);
    const [id, setId] = useState("");
    const emptyFieldCount = Object.keys(formState).filter((key) => formState[key] === emptyState[key]).length;

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

    const handleIdChange = (e) => setId(e.target.value);

    const handleResetClick = () => setFormState(emptyState);
    const handleAddClick = () => addProduct(formState, setIsAdding, enqueueSnackbar);
    const handleDeleteClick = () => deleteProduct(id, setIsDeleting, enqueueSnackbar);

    return (
        <>
            <Navbar/>
            <Box maxWidth="xl" m="auto" p={{ xs: 2, sm: 3 }}>
                <Grid2
                    container
                    maxWidth={{ sm: `calc(${336 * 2}px + ${theme.spacing(3)})` }}
                    spacing={{ xs: 2, sm: 3 }}
                >
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Stack spacing={1} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 3 }}>
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
                                    Сброс полей
                                </Button>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    disabled={emptyFieldCount > 0 || isAdding || isDeleting}
                                    onClick={handleAddClick}
                                >
                                    Добавить
                                </Button>
                            </Stack>
                        </Stack>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Stack spacing={1} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 3 }}>
                            <Typography variant="h6" fontWeight="bold">Удаление продукта</Typography>
                            <Input
                                type="number"
                                label="ID продукта"
                                value={id}
                                onChange={handleIdChange}
                                placeholder="Положительное число"
                            />
                            <Stack direction="row" spacing={1} pt={1}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    disabled={id === "" || isAdding || isDeleting}
                                    onClick={handleDeleteClick}
                                >
                                    Удалить
                                </Button>
                            </Stack>
                        </Stack>
                    </Grid2>
                </Grid2>
            </Box>
        </>
    );
}

export default Admin;