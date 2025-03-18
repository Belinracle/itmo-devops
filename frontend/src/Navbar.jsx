import {
    AppBar,
    Box,
    Button,
    IconButton,
    Stack,
    Toolbar,
    Typography,
    useColorScheme,
    useMediaQuery,
} from "@mui/material";

import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";

import { useNavigate } from "react-router";

const Navbar = ({ children }) => {
    const { mode, setMode } = useColorScheme();
    const smIsUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
    const navigate = useNavigate();

    const handleCatalogClick = () => navigate("/");
    const handleAdminClick = () => navigate("/admin");
    const handleSwitchClick = () => setMode(mode === "light" ? "dark" : "light");

    return (
        <AppBar
            position="sticky"
            elevation={0}
            enableColorOnDark
            sx={{
                alignItems: 'center',
                color: 'text.primary',
                bgcolor: 'background.paper',
                borderBottom: '1px solid',
                borderBottomColor: 'divider',
            }}
        >
            <Toolbar disableGutters sx={{ px: { xs: 2, sm: 3, }, gap: { xs: 2, sm: 3, }, width: 1, maxWidth: 'xl' }}>
                <Typography variant="h5" fontWeight="bold" color="primary" sx={{ userSelect: 'none' }}>DOS</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                    {smIsUp ? (
                        <Button
                            size="large"
                            variant="contained"
                            startIcon={<GridViewRoundedIcon/>}
                            onClick={handleCatalogClick}
                        >
                            Каталог
                        </Button>
                    ) : (
                        <Button size="large" variant="contained" sx={{ p: 1, minWidth: 0 }}
                                onClick={handleCatalogClick}>
                            <GridViewRoundedIcon/>
                        </Button>
                    )}
                    {children}
                </Stack>
                <Box sx={{ flex: 1 }}/>
                <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton onClick={handleAdminClick}>
                        <SecurityRoundedIcon sx={{ color: 'text.secondary' }}/>
                    </IconButton>
                    <IconButton>
                        <ShoppingCartOutlinedIcon sx={{ color: 'text.secondary' }}/>
                    </IconButton>
                    <IconButton onClick={handleSwitchClick}>
                        {mode && (mode === "light" ? (
                            <DarkModeOutlinedIcon sx={{ color: 'text.secondary' }}/>
                        ) : (
                            <LightModeOutlinedIcon sx={{ color: 'text.secondary' }}/>
                        ))}
                    </IconButton>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;