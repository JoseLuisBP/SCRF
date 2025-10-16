import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import useMediaQuery from "@mui/material/useMediaQuery";

const Header = ({ isAuthenticated = false, onToggleTheme, isDarkMode = false }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Estados
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    // Handlers
    const profileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const profileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <AppBar>

        </AppBar>
    );
};

export default Header;
