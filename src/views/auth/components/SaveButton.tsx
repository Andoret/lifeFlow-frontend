import { Button } from '@mui/material'
import { authStyles } from '../auth.styles'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'


interface SaveButtonProps {
  text: string
  onClick: () => void
  disabled: boolean
}

export default function SaveButton({text, onClick, disabled}: SaveButtonProps) {
  return (
    <Button
    variant="contained"
    fullWidth
    endIcon={<ArrowForwardIcon />}
    sx={authStyles.button}
    onClick={onClick}
    disabled={disabled}
  >
    {text}
  </Button>
  )
}