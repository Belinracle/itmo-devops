import { Accordion, AccordionDetails, AccordionSummary, accordionSummaryClasses, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CollapsibleBox = ({ children, sx, summary }) => {
    return (
        <Box sx={{
            bgcolor: 'background.paper',
            overflow: 'hidden',
            ...sx,
        }}>
            <Accordion defaultExpanded disableGutters elevation={0} sx={{ bgcolor: 'transparent' }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    sx={{
                        px: 2,
                        py: 1,
                        gap: 2,
                        minHeight: 0,
                        [`& .${accordionSummaryClasses.content}`]: {
                            m: 0,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        },
                    }}
                >
                    {summary}
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2, pt: 0, pb: 1, }}>
                    {children}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}

export default CollapsibleBox;