import {
  Box,
  Grid,
  Typography,
  Button,
  MenuItem,
  Menu,
  Modal,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { theme } from "../theme";
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot";
import { useState } from "react";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import CheckIcon from "@mui/icons-material/Check";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
type TodoTableProps = {
  tasks: { title: string; description: string }[];
  handleComplete: () => void;
  handleDelete: () => void;
  taskId: number;
};
export default function todoTable({
  tasks,
  handleComplete,
  taskId,
  handleDelete,
}: TodoTableProps) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isRotated, setIsRotated] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const open = Boolean(anchorEl);
  const minDate = dayjs().add(1, 'day').startOf('day'); // Mañana - fecha mínima seleccionable
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setIsRotated(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setIsRotated(false);
  };
  const handleCheck = () => {
    handleComplete();
    setAnchorEl(null);
    setIsRotated(false);
  };
  const handlePostpone = () => {
    setOpenModal(true);
    setDate(dayjs());
    setAnchorEl(null);
    setIsRotated(false);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleClickTask = () => {
    console.log("click");
    navigate(`/task/${taskId}`);
  };
  return (
    <Box sx={{ padding: 1, borderRadius: 2 }}>
      <Grid container spacing={2}>
        {tasks.map((task, index) => (
          <Grid
            onClick={handleClickTask}
            size={{ xs: 12 }}
            component="div"
            sx={{
              backgroundColor: theme.palette.primary.main,
              padding: 2,
              borderRadius: 2,
            }}
          >
            <Grid container spacing={2}>
              <Grid
                size={{ xs: 12 }}
                component="div"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  key={index}
                  color="white"
                  fontWeight="bold"
                >
                  {task.title}
                </Typography>
                <Button onClick={handleClick}>
                  <ScatterPlotIcon
                    sx={{
                      color: theme.palette.primary.light,
                      transform: isRotated ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease-in-out",
                    }}
                  />
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  sx={{
                    padding: 0,
                    "& .MuiPaper-root": {
                      backgroundColor: theme.palette.primary.main,
                      padding: 0,
                    },
                  }}
                >
                  <MenuItem
                    onClick={handleCheck}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.light,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {" "}
                    <CheckIcon /> Completar
                  </MenuItem>
                  <MenuItem
                    onClick={handlePostpone}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.light,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {" "}
                    <MoreTimeIcon /> Posponer
                  </MenuItem>
                  <MenuItem
                    onClick={handleDelete}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.light,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {" "}
                    <RemoveCircleOutlineIcon /> Borrar
                  </MenuItem>
                </Menu>
              </Grid>
              <Grid size={{ xs: 12 }} component="div">
                <Typography variant="subtitle1" color="white">
                  {task.description}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: 450 },
            maxWidth: "95vw",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.light,
          }}
        >
          
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              value={date}
              onChange={(newValue) => setDate(newValue)}
              minDate={minDate}
              sx={{
                backgroundColor: theme.palette.primary.main,
                '& .MuiPickersCalendarHeader-root': {
                  color: theme.palette.primary.contrastText,
                },
                '& .MuiPickersCalendarHeader-label': {
                  color: theme.palette.primary.contrastText,
                },
                '& .MuiPickersDay-root': {
                  color: theme.palette.primary.contrastText,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.dark,
                    color: theme.palette.primary.contrastText,
                  },
                  '&.Mui-disabled': {
                    color: theme.palette.text.disabled,
                  },
                },
                '& .MuiDayCalendar-weekContainer .MuiPickersDay-root': {
                  color: theme.palette.primary.contrastText,
                },
                '& .MuiPickersArrowSwitcher-button': {
                  color: theme.palette.primary.contrastText,
                },
                '& .MuiPickersDay-today': {
                  borderColor: theme.palette.primary.contrastText,
                },
              }}
            />
          </LocalizationProvider>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt:2}}>
                <Button variant="contained" startIcon={<CloseIcon sx={{ color: theme.palette.primary.contrastText }} />} onClick={handleCloseModal} sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }} >Cancelar </Button>
            <Button
            startIcon={<MoreTimeIcon sx={{ color: theme.palette.primary.contrastText }} />}
            variant="contained"
            color="primary"
            onClick={() => {
              if (date) {
                // Aquí puedes agregar la lógica para posponer la tarea con la fecha seleccionada
                // Por ejemplo: handlePostponeTask(date.toDate());
                handleCloseModal();
              }
            }}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '& .MuiButton-startIcon': {
                color: theme.palette.primary.contrastText,
              },
            }}
          >
            Posponer
          </Button>
            </Box>
          
        </Box>
      </Modal>
    </Box>
  );
}
