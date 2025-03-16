import { useCallback, useEffect, useMemo, useState } from "react";

import {
    Box,
    Button,
    Drawer,
    drawerClasses,
    Grid2,
    MenuItem,
    Pagination,
    paginationClasses,
    paginationItemClasses,
    Select,
    selectClasses,
    Skeleton,
    Stack,
    Typography,
    useMediaQuery
} from "@mui/material";
import { yellow } from "@mui/material/colors";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

import useWebSocket from "react-use-websocket";

import Navbar from "./Navbar.jsx";
import Filters from "./Filters.jsx";
import ProductPreview from "./ProductPreview.jsx";

const controls = [
    { type: "numberRange", label: "Цена, ₽", filters: ["fromPrice", "toPrice"], placeholders: ["1", "100000"] },
    { type: "numberRange", label: "Рейтинг", filters: ["fromRating", "toRating"], placeholders: ["1", "5"] },
    { type: "autoComplete", label: "Производитель", filters: ["manufacturers"] },
    { type: "autoComplete", label: "Страна производства", filters: ["countries"] },
    { type: "dateRange", label: "Дата выпуска", filters: ["fromDate", "toDate"] },
];

const emptyValueMap = { numberRange: "", dateRange: null, autoComplete: [] };
const emptyState = Object.fromEntries(
    controls.flatMap(({ type, filters }) => filters.map((filter) => [filter, emptyValueMap[type]]))
);

const pageSizes = [10, 20, 30, 40, 50];

const fetchUrl = "http://localhost:80/products";

const Home = () => {
    const smIsUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
    const lgIsUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [formState, setFormState] = useState(emptyState);
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState(null);

    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(0);

    const filterDTO = useMemo(() => Object.fromEntries(
        controls.flatMap(({ type, filters }) => (
            filters.filter((f) => formState[f] !== emptyValueMap[type]).map((f) => {
                switch (type) {
                    case "autoComplete":
                        return [f, formState[f].map((el) => el.id)];
                    case "dateRange":
                        return [f, formState[f].format('YYYY-MM-DD')];
                    default:
                        return [f, formState[f]];
                }
            })
        ))
    ), [formState]);

    const fetchProducts = useCallback(() => {
        setIsLoading(true);
        setProducts([]);
        setStats({ productCount: 0, totalAvgRating: 0 });

        const requestParams = new URLSearchParams({ pageNumber, pageSize });
        Object.entries(filterDTO).forEach(([key, value]) => (
            Array.isArray(value) ? value.forEach((el) => requestParams.append(key, el)) : requestParams.append(key, value)
        ));

        // TODO: упростить?
        fetch(`${fetchUrl}?${requestParams}`)
            .then((response) => {
                if (response.ok) {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder("utf-8");
                    let readStream, buffer = "";
                    reader.read().then(readStream = ({ done, value }) => {
                        if (done) {
                            setIsLoading(false);
                            return;
                        }

                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split("\n");
                        lines.forEach((line) => {
                            if (line.trim()) {
                                try {
                                    const productDTO = JSON.parse(line);
                                    const { totalAvgRating, productCount, ...product } = productDTO;
                                    setStats({ productCount, totalAvgRating });
                                    setProducts((prevState) => [...prevState, product]);
                                } catch (e) {
                                    console.error("Couldn't parse this product: ", line, e);
                                }
                            }
                        });

                        buffer = lines.pop(); // чтобы не потерять неполный объект
                        reader.read().then(readStream);
                    });
                }
            });
    }, [filterDTO, pageNumber, pageSize])

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line
    }, [pageNumber, pageSize]);

    const handleOpenClick = () => {
        if (!isClosing) {
            setIsOpen(true);
        }
    };

    const handleCloseClick = () => {
        setIsClosing(true);
        setIsOpen(false);
    };

    const handleTransitionEnd = () => setIsClosing(false);

    const handleApplyClick = useCallback(() => fetchProducts(), [fetchProducts]);

    const handlePageSizeChange = (e) => setPageSize(e.target.value);

    const handlePageNumberChange = (e, v) => setPageNumber(v - 1);

    return (
        <>
            <Navbar>
                {!lgIsUp && (smIsUp ? (
                    <Button
                        size="large"
                        color="inherit"
                        variant="contained"
                        onClick={handleOpenClick}
                        sx={{ transition: 'none' }}
                        startIcon={<TuneRoundedIcon/>}
                    >
                        Фильтры
                    </Button>
                ) : (
                    <Button
                        size="large"
                        color="inherit"
                        variant="contained"
                        onClick={handleOpenClick}
                        sx={{ p: 1, minWidth: 0, transition: 'none' }}
                    >
                        <TuneRoundedIcon/>
                    </Button>
                ))}
            </Navbar>
            <Stack
                direction="row"
                spacing={{ xs: 2, sm: 3, }}
                sx={{
                    p: { xs: 2, sm: 3, },
                    mx: 'auto',
                    maxWidth: 'xl',
                    alignItems: 'flex-start',
                }}
            >
                {lgIsUp ? (
                    <Filters
                        controls={controls}
                        emptyValueMap={emptyValueMap}
                        emptyState={emptyState}
                        formState={formState}
                        setFormState={setFormState}
                        width={336}
                        handleApplyClick={handleApplyClick}
                    />
                ) : (
                    <Drawer
                        variant="temporary"
                        open={!lgIsUp && isOpen}
                        onClose={handleCloseClick}
                        onTransitionEnd={handleTransitionEnd}
                        ModalProps={{ keepMounted: true }}
                        sx={{
                            [`& .${drawerClasses.paper}`]: {
                                p: 1,
                                width: '100%',
                                bgcolor: 'background.default',
                            },
                        }}
                    >
                        <Filters
                            controls={controls}
                            emptyValueMap={emptyValueMap}
                            emptyState={emptyState}
                            formState={formState}
                            setFormState={setFormState}
                            handleCloseClick={handleCloseClick}
                            handleApplyClick={handleApplyClick}
                        />
                    </Drawer>
                )}
                <Stack spacing={{ xs: 2, sm: 3 }} width={1}>
                    {stats && (isLoading ? (
                        <Skeleton animation="wave" variant="rounded" height={42} sx={{ borderRadius: 3 }}/>
                    ) : (
                        <Box sx={{
                            px: 2,
                            py: 1,
                            width: 1,
                            bgcolor: 'background.paper',
                            borderRadius: 3,
                        }}>
                            {stats.productCount ? (
                                <Typography variant="button">
                                    Найдено <b>&nbsp;{stats.productCount}&nbsp;</b> товаров с общим средним
                                    рейтингом <b>&nbsp;{stats.totalAvgRating.toFixed(1)}&nbsp;</b>
                                    <StarRoundedIcon
                                        sx={{ color: yellow[700], fontSize: 'large', verticalAlign: 'text-bottom' }}
                                    />
                                </Typography>
                            ) : (
                                <Typography variant="button">Товары не найдены 😔</Typography>
                            )}
                        </Box>
                    ))}
                    <Grid2 container spacing={{ xs: 2, sm: 3 }} width={1}>
                        {products && products.map(({ id, name, avgRating, reviewCount, price }) => (
                            <Grid2 key={id} size={{ xs: 6, sm: 4, md: 3, xl: 12 / 5 }}>
                                <ProductPreview
                                    id={id}
                                    name={name}
                                    avgRating={avgRating}
                                    reviewCount={reviewCount}
                                    price={price}
                                />
                            </Grid2>
                        ))}
                    </Grid2>
                    {!isLoading && stats?.productCount > 0 && (
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                                p: 1,
                                width: 1,
                                rowGap: 1,
                                flexWrap: 'wrap',
                                bgcolor: 'background.paper',
                                borderRadius: 3,
                                justifyContent: 'space-between',
                            }}
                        >
                            <Pagination
                                count={Math.ceil(stats.productCount / pageSize)}
                                page={pageNumber + 1}
                                onChange={handlePageNumberChange}
                                sx={{
                                    [`.${paginationClasses.ul}`]: { gap: 1 },
                                    [`.${paginationItemClasses.root}`]: { borderRadius: 2 },
                                }}
                                size="small"
                            />
                            <Stack direction="row" spacing={1}>
                                <Typography variant="button">Размер страницы:</Typography>
                                <Select
                                    size="small"
                                    variant="outlined"
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                    sx={{
                                        [`.${selectClasses.root}`]: { flex: 1 },
                                        [`.${selectClasses.select}`]: { px: 1, py: 0, fontSize: 'body2.fontSize' },
                                        [`.${selectClasses.icon}`]: { right: 5 },
                                    }}
                                >
                                    {pageSizes.map((value) => (
                                        <MenuItem key={value} value={value} sx={{
                                            px: 1,
                                            py: 0,
                                            height: 26,
                                            font: 'body2',
                                        }}>
                                            {value}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Stack>
                        </Stack>
                    )}
                </Stack>
            </Stack>
        </>
    );
}

export default Home;