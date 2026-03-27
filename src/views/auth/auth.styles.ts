import { theme } from "../../theme";

const dividerBorderColor = "rgba(87, 86, 86, 0.3)";

export const authStyles = {
  page: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    height: "100vh",
    width: "100vw",
    backgroundColor: theme.palette.primary.light,
  },

  rootGrid: {
    width: "100%",
    minHeight: "100vh",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 1,
    pt: 2,
  },

  text: {
    color: theme.palette.primary.main,
    fontWeight: 600,
    fontSize: "2rem",
    textAlign: "center",
  },

  welcomeTitle: {
    ml: 3,
    gap: 1,
    mb: 2,
    mt: 3,
    fontWeight: 600,
    fontSize: "3rem",
  },

  subtitle: {
    fontSize: "1rem",
    fontWeight: 300,
    textAlign: "start",
    ml: 3,
    mr: 2,
  },

  fieldGrid: { p: 2 },

  input: 
  {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      boxShadow: `0 2px 8px rgba(0, 0, 0, 0.15)`,
    },

    // 🔹 borde
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.light,
    },

    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },

    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },

    // 🔹 label
    '& .MuiInputLabel-root': {
      color: theme.palette.text.disabled,
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: theme.palette.primary.main,
    },

    // 🔹 texto escrito
    '& .MuiOutlinedInput-input': {
      color: theme.palette.primary.main ,
    },
  },
  button: {
    borderRadius: 2,
    padding: 2,
    fontSize: '1rem',
    fontWeight: 600,
  },

  dividerGrid: { px: 2, py: 1 },
  dividerContainer: { position: "relative", display: "flex", alignItems: "center" },
  dividerLine: {
    flexGrow: 1,
    borderTop: "2px solid",
    borderColor: dividerBorderColor,
  },
  dividerText: {
    flexShrink: 0,
    mx: 2,
    fontSize: "0.9rem",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    fontWeight: 700,
    color: "text.disabled",
  },

  socialRow: {
    px: 2,
    py: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  socialIconCircle: {
    width: 56,
    height: 56,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    boxShadow: 2,
  },

  bottomBar: {
    alignSelf: "flex-start",
    justifySelf: "flex-end",
    p: 2,
    borderTop: "1px solid",
    borderColor: dividerBorderColor,
    borderTopRightRadius: "5px",
    borderTopLeftRadius: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    mt: "auto",
  },

  bottomBarItem: (active: boolean) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    cursor: "pointer",
    padding: 1,
    borderRadius: "15px",
    color: active ? theme.palette.primary.light : theme.palette.primary.main,
    backgroundColor: active
      ? theme.palette.primary.main
      : theme.palette.primary.light,
  }),

  bottomBarItemText: (active: boolean) => ({
    fontSize: "1rem",
    fontWeight: 300,
    textAlign: "center",
    color: active ? theme.palette.primary.light : theme.palette.primary.main,
  }),

  bottomBarItemIcon: (active: boolean) => ({
    fontSize: "2rem",
    color: active ? theme.palette.primary.light : theme.palette.primary.main,
    fontWeight: 600,
  }),
};
