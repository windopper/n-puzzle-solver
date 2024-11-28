import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Box,
  Card,
  Chip,
  Divider,
} from "@mui/joy";
import { FaHistory } from "react-icons/fa";

function History({ history, applyHistory }) {
  const historyList = history
    .map((hist, index) => {
      const { nodes, edges, result, options, rootNode } = hist;
      const { size, algorithm, simulationState } = options;
      const { attempts, least_attempts, time } = result;

      return (
        <AccordionDetails
          key={index}
          slotProps={{ content: { sx: { paddingBottom: 0 } } }}
          onClick={() => applyHistory(index)}
        >
          <Card
            variant="plain"
            sx={{
              width: "100%",
              padding: "1px",
              margin: "1px",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                cursor: "pointer",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "5px",
                alignItems: "center",
                flexWrap: 1,
                overflowX: "scroll",
                overflowY: "hidden",
                scrollbarWidth: "none",
                userSelect: "none",
                padding: "5px",
              }}
            >
              <Chip
                size="sm"
                variant="soft"
                color="primary"
                label={`#${index + 1}`}
              >{`#${index + 1}`}</Chip>
              <Chip size="sm" variant="soft" color="neutral" label={algorithm}>
                {algorithm}
              </Chip>
              <Chip size="sm" variant="soft" color="neutral" label={size}>
                {`${time ? Math.round(time * 100) / 100 : 0}ms`}
              </Chip>
              <Box
                sx={{
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: "#f9f9f9",
                  fontSize: 11,
                  fontWeight: 600,
                  flexWrap: 0,
                }}
              >
                <Box
                  sx={{ display: "flex", whiteSpace: "nowrap" }}
                >{`${attempts} 시도`}</Box>
                <Divider orientation="vertical" />
                <Box
                  sx={{ display: "flex", whiteSpace: "nowrap" }}
                >{`최소 시도 ${least_attempts}`}</Box>
              </Box>
            </Box>
          </Card>
        </AccordionDetails>
      );
    })
    .reverse();

  return (
    <AccordionGroup sx={{ width: "100%", paddingX: 1 }}>
      <Accordion title="History">
        <AccordionSummary sx={{ fontWeight: 800 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            기록
            <FaHistory size="12" />
          </div>
        </AccordionSummary>
        <Box
          flex
          flexDirection="column"
          sx={{
            maxHeight: "200px",
            overflowY: "scroll",
            overflowX: "hidden",
            scrollbarWidth: "none",
          }}
          justifyContent={"flex-start"}
          alignItems={"center"}
        >
          {historyList}
        </Box>
      </Accordion>
    </AccordionGroup>
  );
}

export default History;
