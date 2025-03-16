import { memo } from "react";

import { Box, Button, Stack, Typography } from "@mui/material";
import { yellow } from "@mui/material/colors";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";

import { gradients } from "./theme.js";

const ProductPreview = memo(({ id, name, avgRating, reviewCount, price }) => {
    return (
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 3 }}>
            <Box sx={{
                aspectRatio: 1,
                borderRadius: 3,
                backgroundImage: gradients[id % gradients.length],
            }}/>
            <Box p={2}>
                <Typography
                    href={"/"}
                    component="a"
                    variant="body1"
                    sx={{
                        color: 'inherit',
                        fontWeight: 'medium',
                        textDecoration: 'none',
                        display: '-webkit-box',
                        overflow: 'hidden',
                        lineClamp: 1,
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {name}
                </Typography>
                <Stack direction="row" spacing={2} mt={4 / 8}>
                    <Stack direction="row" spacing={4 / 8}>
                        <StarRoundedIcon sx={{ color: yellow[700], fontSize: 'large' }}/>
                        <Typography variant="caption" fontWeight="bold">{avgRating.toFixed(1)}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={4 / 8}>
                        <ChatBubbleRoundedIcon
                            sx={{ color: 'text.disabled', fontSize: 'medium', alignSelf: 'center' }}
                        />
                        <Typography variant="caption" fontWeight="bold" color="text.disabled">{reviewCount}</Typography>
                    </Stack>
                </Stack>
                <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="bold">{Math.round(price)} ₽</Typography>
                    <Button variant="contained" sx={{ p: 1, minWidth: 36 }}>
                        <ShoppingCartRoundedIcon fontSize="small"/>
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
});

export default ProductPreview;