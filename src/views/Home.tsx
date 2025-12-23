import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { theme } from "../theme";
import { homeStyles } from "./home.styles.ts";
import MicIcon from "@mui/icons-material/Mic";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import GastosChart from "../components/spendChart.tsx";
function HomeView() {
  return (
    <Box sx={homeStyles.container}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }} component="div">
          <Typography
            variant="h5"
            sx={{ textAlign: "start", color: theme.palette.primary.light }}
          >
            Hola{" "}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              textAlign: "start",
              fontWeight: "600",
              color: theme.palette.primary.light,
            }}
          >
            Daniel{" "}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} component="div">
          <Card
            sx={{
              border: "none",
              boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
              backgroundColor: "transparent",
            }}
          >
            <CardContent
              sx={{
                padding: "20px",
                backgroundColor: theme.palette.primary.dark,
                border: "none",
                borderRadius: "10px",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    textAlign: "start",
                    color: theme.palette.secondary.main,
                    fontWeight: "500",
                    fontSize: "1.3rem",
                  }}
                >
                  Bienvenido a tu a Mewa wow
                </Typography>
                <Typography
                  sx={{
                    textAlign: "start",
                    color: theme.palette.secondary.main,
                    fontWeight: "500",
                    fontSize: "1rem",
                    mt: 1,
                  }}
                >
                  Tu margen de gastos es de:
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "end",
                  gap: 1,
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    textAlign: "end",
                    color: theme.palette.secondary.main,
                    fontWeight: "300",
                    mt: 2,
                  }}
                >
                  $1.000.000{" "}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    textAlign: "end",
                    color: theme.palette.secondary.main,
                    fontWeight: "300",
                  }}
                >
                  COP
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "end",
                  gap: 1,
                  marginTop: 2,
                }}
              >
                <Button
                  variant="contained"
                  sx={{ paddingLeft: "5px", paddingRight: "5px" }}
                >
                  <PriceCheckIcon />
                </Button>
                <Button variant="contained" color="primary">
                  {" "}
                  <MicIcon />
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} component="div">
          <GastosChart total={1000000} gastado={500000} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default HomeView;
