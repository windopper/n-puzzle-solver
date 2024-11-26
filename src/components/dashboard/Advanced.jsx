import { Accordion, AccordionGroup, AccordionSummary } from "@mui/joy";

export default function Advanced() {
    return (
        <AccordionGroup  sx={{ width: '100%', paddingX: 1, }}>
            <Accordion title="Advanced">
                <AccordionSummary>Advanced</AccordionSummary>

            </Accordion>
        </AccordionGroup>
    )
}