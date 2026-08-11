import {
  Box,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import { theme, pageGradient } from "../../theme.ts";
import VoiceRecorder from "../../components/VoiceRecorder.tsx";
import Panel from "../../components/ui/Panel.tsx";
import StatTile from "../../components/ui/StatTile.tsx";
import { UserContext } from "../../context/userContext.tsx";
import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../components/NavigationBar.tsx";
import TodayAgenda from "../../components/agenda/TodayAgenda.tsx";
import { useUserId } from "../../hooks/useUserId.ts";
import { useTodaySchedule } from "../../hooks/useScheduleActivities.ts";
import { useExpenseStats } from "../../hooks/useExpenseStats.ts";
import dayjs from "dayjs";
import { formatActivityDate } from "../../utils/scheduleActivity.utils.ts";

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
}

function HomeView() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const userId = useUserId();
  const {
    activities,
    loading,
    complete,
    toggleComplete,
    remove,
  } = useTodaySchedule(userId);

  const monthRange = useMemo(() => {
    const now = dayjs();
    return {
      from: formatActivityDate(now.startOf('month').toDate()),
      to: formatActivityDate(now.endOf('month').toDate()),
    };
  }, []);
  const { stats, loading: loadingStats } = useExpenseStats(userId, monthRange);

  const handleTranscription = (text: string, error?: string) => {
    if (error) {
      console.error("Error voz a texto:", error);
      return;
    }
    if (text) console.log("Transcripción:", text);
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', maxWidth: '100vw', boxSizing: 'border-box', background: pageGradient, padding: '20px', paddingBottom: '110px' }}>
      <Grid container spacing={2} sx={{ pb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }} component="div">
          <Typography
            variant="h5"
            sx={{ textAlign: "start", color: theme.palette.primary.light }}
          >
            Hola
          </Typography>
          <Typography
            variant="h4"
            sx={{
              textAlign: "start",
              fontWeight: "600",
              color: theme.palette.primary.light,
            }}
          >
            {user ? JSON.parse(user).name : ""}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} component="div">
          <Panel sx={{ backgroundColor: theme.palette.primary.dark, color: theme.palette.secondary.main }}>
            <Typography
              sx={{
                textAlign: "start",
                color: theme.palette.secondary.main,
                fontWeight: "500",
                fontSize: "1.3rem",
              }}
            >
              Bienvenido 🍃
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
              Total gastado este mes:
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "end", alignItems: "end", gap: 1 }}>
              <Typography
                variant="h3"
                sx={{ textAlign: "end", color: theme.palette.primary.contrastText, fontWeight: "300", mt: 2 }}
              >
                {loadingStats ? '…' : formatCurrency(stats?.total ?? 0)}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ textAlign: "end", color: theme.palette.secondary.main, fontWeight: "300" }}
              >
                COP
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "end", alignItems: "end", gap: 1, marginTop: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate('/gastos')}
                sx={{ paddingLeft: "10px", paddingRight: "10px" }}
              >
                <PriceCheckIcon />
              </Button>
              <VoiceRecorder onTranscription={handleTranscription} />
            </Box>
          </Panel>
        </Grid>

        <Grid size={{ xs: 12 }} component="div">
          <Panel>
            <TodayAgenda
              activities={activities}
              loading={loading}
              onComplete={complete}
              onToggleComplete={toggleComplete}
              onPostpone={() => navigate("/agenda")}
              onDelete={remove}
            />
          </Panel>
        </Grid>

        <Grid size={{ xs: 12 }} component="div">
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <StatTile
              label="Promedio por gasto"
              value={loadingStats ? '…' : formatCurrency(stats?.averagePerExpense ?? 0)}
            />
            <StatTile
              label="Día con más gasto"
              value={loadingStats ? '…' : stats?.busiestWeekday?.weekday ?? '—'}
              accent="blush"
            />
          </Box>
          <Button
            fullWidth
            onClick={() => navigate('/gastos')}
            sx={{ mt: 1.5, color: theme.palette.primary.light }}
          >
            Ver detalle de gastos
          </Button>
        </Grid>

        <Grid
          size={{ xs: 12, md: 12 }}
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0, p: 2 }}
          component="div"
        >
          <NavigationBar />
        </Grid>
      </Grid>
    </Box>
  );
}

export default HomeView;
