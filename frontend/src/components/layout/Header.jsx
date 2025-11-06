import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  InputBase,
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Switch,
  Tooltip,
  useTheme,
  useMediaQuery,
  Popover,
  Stack
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  AccessibilityNew as AccessibilityIcon,
  Settings as SettingsIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useAuth } from "../../context/AuthContext";
import { useAccessibility } from "../../context/AccessibilityContext";

export default function Header({ showSearchBar = false }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isLoggedIn, user, logout } = useAuth();
  const { fontSize, highContrast, seniorMode, increaseFontSize, toggleContrast, toggleSeniorMode } = useAccessibility();

  // Estados locales
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [accessibilityAnchor, setAccessibilityAnchor] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  // Función scroll suave
  const handleScrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      console.log('Buscando:', searchValue);
    }
  };

  const handleProfileMenu = (event) => setAnchorEl(event.currentTarget);
  const handleAccessibilityMenu = (event) => setAccessibilityAnchor(event.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
    setAccessibilityAnchor(null);
  };
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // Navegación
  const navigationItems = isLoggedIn
    ? [
        { text: 'Dashboard', path: '/dashboard' },
        { text: 'Rutinas', path: '/rutinas' },
        { text: 'Ejercicios', path: '/ejercicios' },
        { text: 'Progreso', path: '/progreso' }
      ]
    : [
        { text: 'Inicio', path: 'inicio' },
        { text: 'Sobre nosotros', path: 'sobre-nosotros' },
        { text: 'Beneficios', path: 'beneficios' },
        { text: 'Contacto', path: 'contacto' }
      ];

  // Drawer móvil
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                handleScrollToSection(item.path);
                handleDrawerToggle();
              }}
            >
              <ListItemText primary={item.text} />
              <ChevronRightIcon />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" role="navigation" aria-label="Barra principal de navegación">
      <Toolbar>
        {isMobile && (
          <IconButton color="inherit" aria-label="abrir menú" edge="start" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          component="div"
          sx={{ textDecoration: 'none', color: 'inherit', flexGrow: 0, mr: 2, cursor: 'pointer' }}
          onClick={() => handleScrollToSection(isLoggedIn ? 'dashboard' : 'inicio')}
        >
          LOGO
        </Typography>

        {showSearchBar && (
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <InputBase
              placeholder="Buscar ejercicios..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleSearch}
              aria-label="Buscar ejercicios"
              sx={{
                color: 'inherit',
                padding: theme.spacing(1),
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 1,
                width: '100%',
                maxWidth: 400
              }}
              startAdornment={<SearchIcon sx={{ mr: 1 }} />}
            />
          </Box>
        )}

        {!isMobile && (
          <Stack direction="row" spacing={2} sx={{ flexGrow: 1, justifyContent: 'center' }}>
            {navigationItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                onClick={() => handleScrollToSection(item.path)}
              >
                {item.text}
              </Button>
            ))}
          </Stack>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Opciones de accesibilidad">
            <IconButton color="inherit" onClick={handleAccessibilityMenu} aria-label="opciones de accesibilidad">
              <AccessibilityIcon />
            </IconButton>
          </Tooltip>

          {isLoggedIn && (
            <Tooltip title="Notificaciones">
              <IconButton color="inherit" aria-label="notificaciones">
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
          )}

          {isLoggedIn ? (
            <IconButton onClick={handleProfileMenu} color="inherit" aria-label="menú de usuario">
              {user?.avatar ? <Avatar alt={user.name} src={user.avatar} /> : <AccountCircle />}
            </IconButton>
          ) : (
            <>
              <Button color="secondary" variant="outlined" onClick={() => navigate('/login')}>
                Iniciar sesión
              </Button>
              <Button color="secondary" variant="outlined" onClick={() => navigate('/register')} sx={{ ml: 1 }}>
                Registrarse
              </Button>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Drawer móvil */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>

      {/* Menú de usuario */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            navigate('/perfil');
            handleClose();
          }}
        >
          Ver perfil
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate('/configuracion');
            handleClose();
          }}
        >
          Configuración
        </MenuItem>
        <MenuItem
          onClick={() => {
            logout();
            handleClose();
          }}
        >
          Cerrar sesión
        </MenuItem>
      </Menu>

      {/* Menú de accesibilidad */}
      <Popover
        open={Boolean(accessibilityAnchor)}
        anchorEl={accessibilityAnchor}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 2, minWidth: 250 }}>
          <Typography variant="h6" gutterBottom>
            Accesibilidad
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Tamaño de fuente" secondary={`Actual: ${fontSize}`} />
              <Button onClick={increaseFontSize} variant="outlined" sx={{ ml: 3 }}>
                Aumentar
              </Button>
            </ListItem>
            <ListItem>
              <ListItemText primary="Alto contraste" secondary="Mejora la legibilidad" />
              <Switch checked={highContrast} onChange={toggleContrast} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Modo Senior" secondary="Interfaz simplificada" />
              <Switch checked={seniorMode} onChange={toggleSeniorMode} />
            </ListItem>
          </List>
        </Box>
      </Popover>
    </AppBar>
  );
}
