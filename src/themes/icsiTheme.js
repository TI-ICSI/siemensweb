// src/themes/icsiTheme.js
const icsiTheme = {
  primary: "#D91A2A",
  background: "#F2F2F2",
  text: "#73635D",
  border: "#D95F5F",
  white: "#FFFFFF",
  textLight: "#D95F5F",
  card: "#FFFFFF",
  shadow: "#D91A1A",
  titleform: "#494646ff",
  textContent: "#0000",
  textPlaceholder: "#7F8C8D",
};

// Colores derivados para estados
export const theme = {
  ...icsiTheme,
  primaryHover: "#b81525",  // primary más oscuro para hover
  primaryDisabled: "#e88a94", // primary más claro para disabled
  error: "#e74c3c",
  success: "#27ae60",
  warning: "#f39c12",
};

export default theme;