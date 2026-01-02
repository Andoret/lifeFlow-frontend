import { Box,Grid,Typography,Button,MenuItem,Menu} from '@mui/material'
import { theme } from '../theme'
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import { useState } from 'react';
type TodoTableProps = {
    tasks: { title: string, description: string }[]
    handleComplete: () => void
    handlePostpone: () => void
    handleDelete: () => void
}
export default function todoTable({ tasks, handleComplete, handlePostpone, handleDelete }: TodoTableProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
  return (
    <Box sx={{  padding: 2, borderRadius: 2 }}>
        <Grid container spacing={2}>
            {tasks.map((task, index ) => (
                  <Grid size={{ xs: 12 }} component="div"sx={{ backgroundColor: theme.palette.primary.main, padding: 2, borderRadius: 2 }}>
                    <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }} component="div" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" key={index} color='white' fontWeight='bold'>{task.title}</Typography>
                        <Button onClick={handleClick}>
                            <ScatterPlotIcon sx={{ color: theme.palette.primary.light }} />
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            sx={{ padding: 0 }}
                        >
                            <MenuItem onClick={handleComplete} sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.light}}>Completar</MenuItem>
                            <MenuItem onClick={handlePostpone} sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.light}}>Posponer</MenuItem>
                            <MenuItem onClick={handleDelete} sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.light }}>Borrar</MenuItem>
                        </Menu>
                    </Grid>border:"none" 
                    <Grid size={{ xs: 12 }} component="div">
                        <Typography variant="subtitle1" color='white' >{task.description}</Typography>
                    </Grid>
                   </Grid>
                   </Grid>
                ))}
            </Grid>
        </Box>
    );
}
