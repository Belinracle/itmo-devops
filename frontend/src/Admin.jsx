import { useState } from "react";
import { Box, Button, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useSnackbar } from "notistack";

import Navbar from "./Navbar.jsx";
import Input from "./Input.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8080";
const apiUrl = `${backendUrl}/api/products`;

const addProduct = (formState, enqueueSnackbar) => {
    let payload = { ...formState };
    Object.entries(formState)
        .filter(([, value]) => value["$isDayjsObject"])
        .forEach(([key, value]) => payload[key] = value.format("YYYY-MM-DD"));

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
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
        });
}

const updateProduct = (formState, enqueueSnackbar) => {
    let payload = { ...formState };
    Object.entries(formState)
        .filter(([, value]) => value["$isDayjsObject"])
        .forEach(([key, value]) => payload[key] = value.format("YYYY-MM-DD"));

    fetch(`${apiUrl}/${formState["id"]}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        .then((response) => {
            if (response.ok) {
                enqueueSnackbar(`Продукт с ID ${formState["id"]} успешно обновлен!`, { variant: "success" });
            } else {
                enqueueSnackbar(`При обновлении произошла ошибка! Код: ${response.status}`, { variant: "error" });
            }
        })
        .catch(() => {
            enqueueSnackbar("При обновлении произошла ошибка связи!", { variant: "error" });
        });
}

const deleteProduct = (formState, enqueueSnackbar) => {
    fetch(`${apiUrl}/${formState["id"]}`, {
        method: "DELETE",
    })
        .then((response) => {
            if (response.ok) {
                enqueueSnackbar(`Продукт с ID ${formState["id"]} успешно удален!`, { variant: "success" });
            } else {
                enqueueSnackbar(`При удалении произошла ошибка! Код: ${response.status}`, { variant: "error" });
            }
        })
        .catch(() => {
            enqueueSnackbar("При удалении произошла ошибка связи!", { variant: "error" });
        });
}

const actions = [
    {
        name: "Добавление",
        callback: addProduct,
        fields: [
            { type: "text", name: "name", label: "Имя", placeholder: "Имя продукта" },
            { type: "number", name: "price", label: "Цена, ₽", placeholder: "От 1 до 1000000" },
            { type: "number", name: "avgRating", label: "Рейтинг", placeholder: "От 1 до 5" },
            { type: "number", name: "reviewCount", label: "Количество отзывов", placeholder: "Любое число" },
            { type: "date", name: "releaseDate", label: "Дата выпуска", actions: [0, 1] },
            { type: "number", name: "countryId", label: "Страна производства", placeholder: "От 1 до 10" },
            { type: "number", name: "manufacturerId", label: "Производитель", placeholder: "От 1 до 100" },
        ]
    },
    {
        name: "Изменение",
        callback: updateProduct,
        fields: [
            { type: "number", name: "id", label: "ID", placeholder: "ID продукта" },
            { type: "text", name: "name", label: "Имя", placeholder: "Имя продукта" },
            { type: "number", name: "price", label: "Цена, ₽", placeholder: "От 1 до 1000000" },
            { type: "number", name: "avgRating", label: "Рейтинг", placeholder: "От 1 до 5" },
            { type: "number", name: "reviewCount", label: "Количество отзывов", placeholder: "Любое число" },
            { type: "date", name: "releaseDate", label: "Дата выпуска", actions: [0, 1] },
            { type: "number", name: "countryId", label: "Страна производства", placeholder: "От 1 до 10" },
            { type: "number", name: "manufacturerId", label: "Производитель", placeholder: "От 1 до 100" },
        ]
    },
    {
        name: "Удаление",
        callback: deleteProduct,
        fields: [
            { type: "number", name: "id", label: "ID", placeholder: "ID продукта" },
        ]
    }
]

const emptyValueMap = { text: "", number: "", date: null };
const emptyState = actions.map(({ fields }) => (
    Object.fromEntries(fields.map(({ type, name }) => [name, emptyValueMap[type]])))
);

const Admin = () => {
    const { enqueueSnackbar } = useSnackbar();

    const [action, setAction] = useState(0);
    const [formState, setFormState] = useState(emptyState[action]);
    const emptyFieldCount = Object.keys(formState).filter((key) => formState[key] === emptyState[action][key]).length;

    const handleActionChange = (e, v) => {
        if (v !== null) {
            setAction(v);
            setFormState(emptyState[v])
        }
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

    const handleResetClick = () => setFormState(emptyState[action]);
    const handleExecuteClick = () => actions[action]?.callback(formState, enqueueSnackbar);

    return (
        <>
            <Navbar/>
            <Box maxWidth="xl" m="auto" p={{ xs: 2, sm: 3 }}>
                <Stack
                    spacing={2}
                    sx={{
                        p: 2,
                        maxWidth: { sm: 336 },
                        bgcolor: 'background.paper',
                        borderRadius: 3
                    }}
                >
                    <Typography variant="h6" fontWeight="bold">Управление продуктами</Typography>
                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            mb={4 / 8}
                            component={Box}
                        >
                            Действие
                        </Typography>
                        <ToggleButtonGroup
                            fullWidth
                            exclusive
                            size="small"
                            value={action}
                            onChange={handleActionChange}
                        >
                            {actions?.map(({ name }, index) => (
                                <ToggleButton key={name} value={index}>{name}</ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </Box>
                    {actions[action]?.fields?.map(({ type, name, label, placeholder, actions }) => (
                        (type === "text" || type === "number") ? (
                            <Input
                                id={name}
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
                                slotProps={{ textField: { label, id: name } }}
                                value={formState[name]}
                                onChange={handleDateChange(name)}
                            />
                        ) : null
                    ))}
                    <Stack direction="row" spacing={1}>
                        <Button
                            fullWidth
                            color="inherit"
                            variant="contained"
                            disabled={emptyFieldCount === actions[action]?.fields?.length}
                            onClick={handleResetClick}
                        >
                            Сброс полей
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            disabled={emptyFieldCount > 0}
                            onClick={handleExecuteClick}
                        >
                            Выполнить
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </>
    );
}

export default Admin;