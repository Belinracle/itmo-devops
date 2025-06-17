import { useEffect, useState } from "react";

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
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

import Navbar from "./Navbar.jsx";
import Filters from "./Filters.jsx";
import ProductPreview from "./ProductPreview.jsx";

const controls = [
    { type: "numberRange", label: "Цена, ₽", filters: ["fromPrice", "toPrice"], placeholders: ["1", "100000"] },
    { type: "numberRange", label: "Рейтинг", filters: ["fromRating", "toRating"], placeholders: ["1", "5"] },
    { type: "number", label: "Производитель", filters: ["manufacturerId"], placeholders: ["Неотрицательное число"] },
    { type: "number", label: "Страна производства", filters: ["countryId"], placeholders: ["Неотрицательное число"] },
    { type: "dateRange", label: "Дата выпуска", filters: ["fromDate", "toDate"] },
];

const emptyValueMap = { number: "", numberRange: "", dateRange: null, };
const emptyState = Object.fromEntries(
    controls.flatMap(({ type, filters }) => filters.map((filter) => [filter, emptyValueMap[type]]))
);

const pageSizes = [10, 20, 30, 40, 50];

const backendUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8080";
const apiUrl = `${backendUrl}/api/products`;
const fetchProducts = (formState, pageNumber, pageSize, setIsLoading, setProducts, setProductCount, setPageCount) => {
    setIsLoading(true);
    setProducts([]);
    setProductCount(0);
    setPageCount(0);

    const requestParams = new URLSearchParams({ pageNumber, pageSize });
    controls.forEach(({ type, filters }) => {
        filters.forEach((filter) => {
            const value = formState[filter];
            if (value === emptyValueMap[type]) {
                return;
            }

            switch (type) {
                case "dateRange":
                    requestParams.append(filter, value.format("YYYY-MM-DD"));
                    break;
                default:
                    requestParams.append(filter, value);
            }
        });
    });

    fetch(`${apiUrl}?${requestParams}`)
        .then((response) => response.json())
        .then(({ content, totalElements, totalPages }) => {
            setProducts(content);
            setProductCount(totalElements);
            setPageCount(totalPages);
        })
        .finally(() => setIsLoading(false));
}

const Home = () => {
    const smIsUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
    const lgIsUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [formState, setFormState] = useState(emptyState);
    const [products, setProducts] = useState([]);
    const [productCount, setProductCount] = useState(0);

    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageCount, setPageCount] = useState(0);

    console.log("TEST CD");

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

    const handleApplyClick = () => {
        setPageNumber(0);
        fetchProducts(formState, 0, pageSize, setIsLoading, setProducts, setProductCount, setPageCount);
    }

    const handlePageSizeChange = (e) => {
        setPageSize(e.target.value);
        setPageNumber(0);
        fetchProducts(formState, 0, e.target.value, setIsLoading, setProducts, setProductCount, setPageCount);
    }

    const handlePageNumberChange = (e, v) => {
        setPageNumber(v - 1);
        fetchProducts(formState, v - 1, pageSize, setIsLoading, setProducts, setProductCount, setPageCount);
    }

    useEffect(() => {
        fetchProducts(formState, pageNumber, pageSize, setIsLoading, setProducts, setProductCount, setPageCount);
    }, []);

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
                    {isLoading ? (
                        <Skeleton animation="wave" variant="rounded" height={42} sx={{ borderRadius: 3 }}/>
                    ) : (
                        <Box sx={{
                            px: 2,
                            py: 1,
                            width: 1,
                            bgcolor: 'background.paper',
                            borderRadius: 3,
                        }}>
                            <Typography variant="button">
                                {productCount ? (
                                    <>Найдено товаров: &nbsp;<b>{productCount}</b></>
                                ) : (
                                    <>Товары не найдены 😔</>
                                )}
                            </Typography>
                        </Box>
                    )}
                    <Grid2 container spacing={{ xs: 2, sm: 3 }} width={1}>
                        {products?.map(({ id, name, avgRating, reviewCount, price }) => (
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
                    {!isLoading && productCount > 0 && (
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
                                count={pageCount}
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
                                    MenuProps={{ keepMounted: true }}
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