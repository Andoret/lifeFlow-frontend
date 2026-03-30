import { TextField, InputAdornment, IconButton } from '@mui/material'
import { authStyles } from '../auth.styles'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'




interface EmailFieldProps {
  label: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: string
  error?: boolean
  helperText?: string
}   

interface PasswordFieldProps {
    label: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    value: string
    showPassword: boolean
    change: (showPassword: boolean) => void
    error?: boolean
    helperText?: string
  }



function EmailField({label, onChange,value, error = false, helperText = ""}: EmailFieldProps) {
  return (
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      sx={authStyles.input}
      onChange={onChange}
      value={value}
      error={error}
      helperText={helperText}
    />
  )
}


function PasswordField({label, onChange,value,showPassword,change, error = false, helperText = ""}: PasswordFieldProps) {
  return (
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      sx={authStyles.input}
      onChange={onChange}
      value={value}
      error={error}
      helperText={helperText}
      type={showPassword ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => change(!showPassword)}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}

export { EmailField, PasswordField }