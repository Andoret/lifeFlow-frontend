import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography, Grid } from "@mui/material";
import { theme } from "../theme";
type GastosChartProps = {
  total: number;
  gastado: number;
};

export default function GastosChart({ total, gastado }: GastosChartProps) {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Grid size={{ xs: 6, md: 6 }}>
        <PieChart
          series={[
            {
              data: [
                { value: gastado, color: theme.palette.primary.contrastText },
                {
                  value: total - gastado,
                  color: theme.palette.background.default,
                },
              ],
              innerRadius: 40,
              outerRadius: 72,
              paddingAngle: 3,
              cornerRadius: 6,
            },
          ]}
          width={160}
          height={160}
          colors={[
            theme.palette.primary.contrastText,
            theme.palette.primary.light,
          ]}
        />
      </Grid>
      <Box
        sx={{
          width: "60%",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          alignItems: "center",
          gap: { xs: 2, sm: 0 },
          color: theme.palette.primary.light,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box></Box>
          {/* Labels con colores */}
          <Grid
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: theme.palette.primary.contrastText,
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: theme.palette.primary.contrastText }}
              >
                Gastado
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: theme.palette.background.default,
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: theme.palette.background.default }}
              >
                Disponible
              </Typography>
            </Box>
          </Grid>
        </Box>
        <Box
          sx={{
            textAlign: { xs: "center", sm: "end" },
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", sm: "end" },
            justifyContent: "end",
            gap: 1,
            position: { xs: "static", sm: "absolute" },
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Gastado
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            ${gastado.toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
