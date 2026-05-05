// src/components/common/Card.jsx
import theme from '../themes/icsiTheme';

const Card = ({ children, padding = "2rem", maxWidth = "400px", noShadow = false }) => {
  const cardStyles = {
    backgroundColor: theme.card,
    borderRadius: "1rem",
    padding: padding,
    width: "100%",
    maxWidth: maxWidth,
    boxShadow: noShadow ? "none" : "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease"
  };

  return <div style={cardStyles}>{children}</div>;
};

export default Card;