import { memo } from "react";

import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import CollapsibleBox from "./CollapsibleBox.jsx";
import Input from "./Input.jsx";
import StaticAutocomplete from "./StaticAutocomplete.jsx";

const ResetButton = ({ onClick }) => (
    <Typography
        variant="body2"
        onClick={onClick}
        fontWeight="medium"
        color="text.secondary"
        sx={{
            borderBottom: '1px dashed',
            borderBottomColor: 'text.secondary',
        }}
    >
        Сбросить
    </Typography>
)

const Filters = memo(({
                          controls,
                          emptyValueMap,
                          emptyState,
                          formState,
                          setFormState,
                          width,
                          handleCloseClick,
                          handleApplyClick
                      }) => {
    const isEmptyState = !Object.keys(formState).some((key) => formState[key] !== emptyState[key]);

    const handleInputChange = (filterName) => (
        (e) => {
            setFormState((prevState) => ({ ...prevState, [filterName]: e.target.value }));
        }
    );

    const handleDateChange = (filterName) => (
        (e) => {
            setFormState((prevState) => ({ ...prevState, [filterName]: e }));
        }
    );

    const handleResetClick = (type, filters) => (
        (e) => {
            e.stopPropagation();
            setFormState((prevState) => ({
                ...prevState, ...Object.fromEntries(filters.map((filter) => [filter, emptyValueMap[type]]))
            }));
        }
    );

    const handleResetAllClick = () => setFormState(emptyState);

    return (
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, width, flexShrink: 0 }}>
            <Stack direction="row" spacing={2} p={2} pb={1} justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">Фильтры</Typography>
                {handleCloseClick && (
                    <IconButton size="small" sx={{ p: 0, overflow: "visible" }} onClick={handleCloseClick}>
                        <CloseRoundedIcon/>
                    </IconButton>
                )}
            </Stack>
            {controls.map(({ type, label, filters, placeholders }, index) => (
                <CollapsibleBox key={index} summary={
                    <>
                        <Typography variant="body1" fontWeight="bold">{label}</Typography>
                        {filters.some((filter) => formState[filter] !== emptyValueMap[type]) && (
                            <ResetButton onClick={handleResetClick(type, filters)}/>
                        )}
                    </>
                }>
                    {type === "numberRange" ? (
                        <Stack direction="row" spacing={1}>
                            <Input
                                label="От"
                                type="number"
                                id={filters[0]}
                                placeholder={placeholders[0]}
                                value={formState[filters[0]]}
                                onChange={handleInputChange(filters[0])}
                            />
                            <Input
                                label="До"
                                type="number"
                                id={filters[1]}
                                placeholder={placeholders[1]}
                                value={formState[filters[1]]}
                                onChange={handleInputChange(filters[1])}
                            />
                        </Stack>
                    ) : type === "dateRange" ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <DatePicker
                                disableFuture
                                format="DD.MM.YY"
                                slots={{ textField: Input }}
                                slotProps={{ textField: { label: "С" } }}
                                value={formState[filters[0]]}
                                onChange={handleDateChange(filters[0])}
                            />
                            <DatePicker
                                disableFuture
                                format="DD.MM.YY"
                                slots={{ textField: Input }}
                                slotProps={{ textField: { label: "По" } }}
                                value={formState[filters[1]]}
                                onChange={handleDateChange(filters[1])}
                            />
                        </Stack>
                    ) : type === "autoComplete" ? (
                        <StaticAutocomplete
                            value={formState[filters[0]]}
                            filter={filters[0]}
                            setFormState={setFormState}
                            emptyValueMap={emptyValueMap}
                        />
                    ) : type === "number" ? (
                        <Input
                            label="Число"
                            type="number"
                            id={filters[0]}
                            placeholder={placeholders[0]}
                            value={formState[filters[0]]}
                            onChange={handleInputChange(filters[0])}
                        />
                    ) : null}
                </CollapsibleBox>
            ))}
            <Stack direction="row" spacing={1} p={2} pt={1}>
                {!isEmptyState && (
                    <Button fullWidth variant="contained" color="inherit" onClick={handleResetAllClick}>
                        Сбросить все
                    </Button>
                )}
                <Button fullWidth variant="contained" onClick={handleApplyClick}>
                    Применить
                </Button>
            </Stack>
        </Box>
    );
});

export default Filters;