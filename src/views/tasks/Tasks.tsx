import {Box,Grid,Modal,Typography,Button,TextField,FormControl,Select,MenuItem,Fab,Menu} from '@mui/material'
import Slide from '@mui/material/Slide'
import { taskStyles } from './task.styles'
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState, useEffect } from 'react';
import { theme } from '../../theme';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import CheckIcon from "@mui/icons-material/Check";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import type { Task } from '../../types/task';
import { loadTasks, saveTasks } from '../../utils/taskStorage';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [itsOpen, setItsOpen] = useState(false);
  
  // Estados del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(1);
  const [taskDate, setTaskDate] = useState<Dayjs | null>(dayjs().add(1, 'day'));
  const minDate = dayjs().add(1, 'day').startOf('day');

  // Estados para el menú de opciones de cada tarea
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [isRotated, setIsRotated] = useState(false);
  const [openPostponeModal, setOpenPostponeModal] = useState(false);
  const [postponeDate, setPostponeDate] = useState<Dayjs | null>(dayjs().add(1, 'day'));

  // Cargar tareas al montar el componente
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const loadedTasks = await loadTasks();
        setTasks(loadedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const handleOpen = () => {
    setItsOpen(true);
    // Resetear formulario
    setTitle('');
    setDescription('');
    setPriority(1);
    setTaskDate(dayjs().add(1, 'day'));
  };

  const handleClose = () => {
    setItsOpen(false);
  };


  const handleCreateTask = async () => {
    if (!title.trim() || !description.trim() || !taskDate) {
      return; // Validación básica
    }

    const newTask: Task = {
      id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
      title: title.trim(),
      description: description.trim(),
      date: taskDate.toDate(),
      completed: false,
      priority: priority,
    };

    const updatedTasks: Task[] = [...tasks, newTask];
    setTasks(updatedTasks);
    handleClose();
    
    // Guardar tareas
    try {
      await saveTasks(updatedTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  // Funciones para manejar las acciones de las tareas
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, taskId: number) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);
    setIsRotated(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTaskId(null);
    setIsRotated(false);
  };

  const handleComplete = async (taskId: number) => {
    const updatedTasks: Task[] = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    handleMenuClose();
    try {
      await saveTasks(updatedTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const handleDelete = async (taskId: number) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    handleMenuClose();
    try {
      await saveTasks(updatedTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const handlePostpone = (taskId: number) => {
    setSelectedTaskId(taskId);
    setOpenPostponeModal(true);
    setPostponeDate(dayjs().add(1, 'day'));
    handleMenuClose();
  };

  const handlePostponeConfirm = async () => {
    if (selectedTaskId && postponeDate) {
      const updatedTasks: Task[] = tasks.map(task => 
        task.id === selectedTaskId ? { ...task, date: postponeDate.toDate() } : task
      );
      setTasks(updatedTasks);
      setOpenPostponeModal(false);
      try {
        await saveTasks(updatedTasks);
      } catch (error) {
        console.error('Error saving tasks:', error);
      }
    }
  };

  const open = Boolean(anchorEl);
  
  return (
    <Box sx={{ ...taskStyles.container, position: 'relative', pb: 10 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h4" sx={{ color: theme.palette.primary.light, fontWeight: 'bold', mb: 3 }}>
            Tareas
          </Typography>
        </Grid>

        {/* Lista de tareas */}
        {tasks.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ 
              textAlign: 'center', 
              py: 8,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 2,
              px: 2
            }}>
              <Typography variant="h6" sx={{ color: theme.palette.primary.light, mb: 2 }}>
                No hay tareas aún
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.primary.contrastText }}>
                Presiona el botón + para crear tu primera tarea
              </Typography>
            </Box>
          </Grid>
        ) : (
          tasks.map((task) => (
            <Grid key={task.id} size={{ xs: 12 }}>
              <Box
                sx={{
                  backgroundColor: task.completed ? theme.palette.primary.dark : theme.palette.primary.main,
                  padding: 2,
                  borderRadius: 2,
                  opacity: task.completed ? 0.7 : 1,
                  transition: 'all 0.3s ease',
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
                      color="white"
                      fontWeight="bold"
                      sx={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                      }}
                    >
                      {task.title}
                    </Typography>
                    <Button 
                      onClick={(e) => handleMenuClick(e, task.id)}
                      sx={{ minWidth: 'auto', p: 1 }}
                    >
                      <ScatterPlotIcon
                        sx={{
                          color: theme.palette.primary.light,
                          transform: isRotated && selectedTaskId === task.id ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.3s ease-in-out",
                        }}
                      />
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={open && selectedTaskId === task.id}
                      onClose={handleMenuClose}
                      sx={{
                        padding: 0,
                        "& .MuiPaper-root": {
                          backgroundColor: theme.palette.primary.main,
                          padding: 0,
                        },
                      }}
                    >
                      <MenuItem
                        onClick={() => handleComplete(task.id)}
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.light,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <CheckIcon /> {task.completed ? 'Desmarcar' : 'Completar'}
                      </MenuItem>
                      <MenuItem
                        onClick={() => handlePostpone(task.id)}
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.light,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <MoreTimeIcon /> Posponer
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleDelete(task.id)}
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.light,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <RemoveCircleOutlineIcon /> Borrar
                      </MenuItem>
                    </Menu>
                  </Grid>
                  <Grid size={{ xs: 12 }} component="div">
                    <Typography variant="body2" color="white" sx={{ mb: 1 }}>
                      {task.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Typography variant="caption" color={theme.palette.primary.contrastText}>
                        📅 {dayjs(task.date).format('DD/MM/YYYY')}
                      </Typography>
                      <Typography variant="caption" color={theme.palette.primary.contrastText}>
                        {task.priority === 1 ? '🔵 Baja' : task.priority === 2 ? '🟡 Media' : '🔴 Alta'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          ))
        )}
      </Grid>

      {/* Botón flotante para crear tarea */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
          zIndex: 1000,
        }}
      >
        <AddIcon />
      </Fab>

      {/* Modal para crear tarea */}
      <Modal
        open={itsOpen}
        onClose={handleClose}
        closeAfterTransition
        slotProps={{ backdrop: { timeout: 300 } }}
      >
        <Slide in={itsOpen} direction="up" timeout={{ enter: 300, exit: 200 }}>
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              width: "100%",
              maxWidth: "100vw",
              maxHeight: "90vh",
              overflow: "auto",
              bgcolor: theme.palette.primary.main,
              boxShadow: `0 -4px 20px rgba(0, 0, 0, 0.3), 0 -8px 40px rgba(0, 0, 0, 0.2)`,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              p: { xs: 3, sm: 4 },
            }}
          >
          {/* Header con handle */}
          <Box sx={{ mb: 3 }}>
            {/* Handle draggable */}
            <Box
              sx={{
                width: 40,
                height: 4,
                backgroundColor: theme.palette.primary.contrastText,
                opacity: 0.3,
                borderRadius: 2,
                mx: 'auto',
                mb: 2,
              }}
            />
            
            {/* Header con título, X y Cancel */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Button
                onClick={handleClose}
                sx={{ 
                  minWidth: 'auto', 
                  p: 1, 
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                <CloseIcon />
              </Button>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: theme.palette.primary.contrastText, 
                  fontWeight: 'bold',
                  textAlign: 'center',
                  flex: 1,
                }}
              >
                Nueva Tarea
              </Typography>
              <Button
                onClick={handleClose}
                sx={{ 
                  minWidth: 'auto', 
                  p: 1, 
                  color: theme.palette.primary.contrastText,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Cancelar
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* TASK NAME */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.primary.contrastText,
                  opacity: 0.7,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  mb: 1,
                  display: 'block',
                }}
              >
                Nombre de la tarea
              </Typography>
              <TextField
                placeholder="e.g. Design System Sync"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme.palette.primary.dark,
                    borderRadius: 2,
                    boxShadow: `0 2px 8px rgba(0, 0, 0, 0.15)`,
                    '& fieldset': {
                      borderColor: theme.palette.primary.contrastText,
                      borderWidth: 1,
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.contrastText,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.contrastText,
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: theme.palette.primary.contrastText,
                    '&::placeholder': {
                      color: theme.palette.primary.contrastText,
                      opacity: 0.5,
                    },
                  },
                }}
              />
            </Box>

            {/* DESCRIPTION */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.primary.contrastText,
                  opacity: 0.7,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  mb: 1,
                  display: 'block',
                }}
              >
                Descripción
              </Typography>
              <TextField
                placeholder="Agregar detalles..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={4}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme.palette.primary.dark,
                    borderRadius: 2,
                    boxShadow: `0 2px 8px rgba(0, 0, 0, 0.15)`,
                    '& fieldset': {
                      borderColor: theme.palette.primary.contrastText,
                      borderWidth: 1,
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.contrastText,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.contrastText,
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: theme.palette.primary.contrastText,
                    '&::placeholder': {
                      color: theme.palette.primary.contrastText,
                      opacity: 0.5,
                    },
                  },
                }}
              />
            </Box>

            {/* PRIORITY y DUE DATE en la misma fila */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Prioridad */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.primary.contrastText,
                    opacity: 0.7,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    mb: 1,
                    display: 'block',
                  }}
                >
                  Prioridad
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    sx={{
                      backgroundColor: theme.palette.primary.dark,
                      color: theme.palette.primary.contrastText,
                      borderRadius: 2,
                      boxShadow: `0 2px 8px rgba(0, 0, 0, 0.15)`,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.contrastText,
                        borderWidth: 1,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.contrastText,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.contrastText,
                        borderWidth: 2,
                      },
                      '& .MuiSvgIcon-root': {
                        color: theme.palette.primary.contrastText,
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: theme.palette.primary.main,
                          boxShadow: `0 4px 20px rgba(0, 0, 0, 0.3)`,
                          '& .MuiMenuItem-root': {
                            color: theme.palette.primary.contrastText,
                            backgroundColor: theme.palette.primary.main,
                            '&:hover': {
                              backgroundColor: theme.palette.primary.dark,
                            },
                            '&.Mui-selected': {
                              backgroundColor: theme.palette.primary.dark,
                              '&:hover': {
                                backgroundColor: theme.palette.primary.dark,
                              },
                            },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value={1}>Baja</MenuItem>
                    <MenuItem value={2}>Media</MenuItem>
                    <MenuItem value={3}>Alta</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Fecha */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.primary.contrastText,
                    opacity: 0.7,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    mb: 1,
                    display: 'block',
                  }}
                >
                  Fecha de vencimiento
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={taskDate}
                    onChange={(newValue) => setTaskDate(newValue)}
                    minDate={minDate}
                    sx={{
                      width: '100%',
                      color: theme.palette.primary.contrastText,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: 2,
                        boxShadow: `0 2px 8px rgba(0, 0, 0, 0.15)`,
                        '& fieldset': {
                          borderColor: `${theme.palette.primary.contrastText} !important`,
                          borderWidth: 1,
                        },
                        '&:hover fieldset': {
                          borderColor: `${theme.palette.primary.contrastText} !important`,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: `${theme.palette.primary.contrastText} !important`,
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: `${theme.palette.primary.contrastText} !important`,
                        WebkitTextFillColor: `${theme.palette.primary.contrastText} !important`,
                      },
                      '& .MuiIconButton-root': {
                        color: `${theme.palette.primary.contrastText} !important`,
                      },
                    }}
                    slotProps={{
                    
                      popper: {
                        placement: 'bottom-start',
                        sx: {
                          zIndex: 1300,
                          '& .MuiPaper-root': {
                            backgroundColor: `${theme.palette.primary.main} !important`,
                            background: `${theme.palette.primary.main} !important`,
                            color: `${theme.palette.primary.contrastText} !important`,
                            boxShadow: `0 4px 20px rgba(0, 0, 0, 0.3)`,
                          },
                          '& .MuiPickersLayout-root': {
                            backgroundColor: `${theme.palette.primary.main} !important`,
                          },
                          '& .MuiPickersCalendarHeader-root': {
                            backgroundColor: `${theme.palette.primary.main} !important`,
                            color: `${theme.palette.primary.contrastText} !important`,
                          },
                          '& .MuiPickersCalendarHeader-label': {
                            color: `${theme.palette.primary.contrastText} !important`,
                          },
                          '& .MuiPickersCalendarHeader-labelContainer': {
                            backgroundColor: `${theme.palette.primary.main} !important`,
                          },
                          '& .MuiDayCalendar-header': {
                            backgroundColor: `${theme.palette.primary.main} !important`,
                            '& .MuiPickersDay-root': {
                              color: `${theme.palette.primary.contrastText} !important`,
                            },
                          },
                          '& .MuiDayCalendar-weekContainer': {
                            backgroundColor: `${theme.palette.primary.main} !important`,
                          },
                          '& .MuiPickersDay-root': {
                            color: `${theme.palette.primary.contrastText} !important`,
                            backgroundColor: 'transparent !important',
                            '&:hover': {
                              backgroundColor: `${theme.palette.primary.dark} !important`,
                            },
                            '&.Mui-selected': {
                              backgroundColor: `${theme.palette.primary.dark} !important`,
                              color: `${theme.palette.primary.contrastText} !important`,
                              '&:hover': {
                                backgroundColor: `${theme.palette.primary.dark} !important`,
                              },
                            },
                            '&.Mui-disabled': {
                              color: `${theme.palette.text.disabled} !important`,
                            },
                          },
                          '& .MuiPickersArrowSwitcher-root': {
                            backgroundColor: `${theme.palette.primary.main} !important`,
                          },
                          '& .MuiPickersArrowSwitcher-button': {
                            color: `${theme.palette.primary.contrastText} !important`,
                            backgroundColor: `${theme.palette.primary.main} !important`,
                            '&:hover': {
                              backgroundColor: `${theme.palette.primary.dark} !important`,
                            },
                          },
                          '& .MuiPickersDay-today': {
                            borderColor: `${theme.palette.primary.contrastText} !important`,
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Box>

            {/* Botón Create Task */}
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleCreateTask}
                disabled={!title.trim() || !description.trim() || !taskDate}
                fullWidth
                sx={{
                  backgroundColor: theme.palette.primary.dark,
                  color: theme.palette.primary.contrastText,
                  borderRadius: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)`,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    boxShadow: `0 6px 16px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.3)`,
                  },
                  '&.Mui-disabled': {
                    backgroundColor: theme.palette.primary.dark,
                    color: theme.palette.text.disabled,
                    opacity: 0.5,
                  },
                }}
              >
                Crear Tarea
              </Button>
              
              {/* Texto informativo */}
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.primary.contrastText,
                  opacity: 0.6,
                  display: 'block',
                  textAlign: 'center',
                  mt: 1.5,
                  fontSize: '0.75rem',
                }}
              >
                La tarea se agregará a tu espacio de trabajo
              </Typography>
            </Box>
          </Box>
          </Box>
        </Slide>
      </Modal>

      {/* Modal para posponer tarea */}
      <Modal open={openPostponeModal} onClose={() => setOpenPostponeModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: 450 },
            maxWidth: "95vw",
            bgcolor: theme.palette.primary.main,
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            color: theme.palette.primary.light,
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              value={postponeDate}
              onChange={(newValue) => setPostponeDate(newValue)}
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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<CloseIcon sx={{ color: theme.palette.primary.contrastText }} />}
              onClick={() => setOpenPostponeModal(false)}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }}
            >
              Cancelar
            </Button>
            <Button
              startIcon={<MoreTimeIcon sx={{ color: theme.palette.primary.contrastText }} />}
              variant="contained"
              color="primary"
              onClick={handlePostponeConfirm}
              disabled={!postponeDate}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '& .MuiButton-startIcon': {
                  color: theme.palette.primary.contrastText,
                },
                '&.Mui-disabled': {
                  backgroundColor: theme.palette.primary.dark,
                  color: theme.palette.text.disabled,
                },
              }}
            >
              Posponer
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}
