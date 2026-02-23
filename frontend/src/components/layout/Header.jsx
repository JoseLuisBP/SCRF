//Se importan varios componentes de Material UI que serán utilizados en la interfaz del Header, los hooks básicos de React y los componentes de navegación de React Router
import { useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
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
  ChevronRight as ChevronRightIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';
import { useAuth } from "../../context/AuthContext";
import { useAccessibility } from "../../context/AccessibilityContext";
import { useThemeMode } from '../../context/ThemeContext';

//El componente recibe la prop showSearchBar para decidir si mostrar o no una barra de búsqueda.
export default function Header({ showSearchBar = false }) {
  //Hooks de navegación y ubicación de React Router.
  const navigate = useNavigate();
  const location = useLocation();

  //Material UI: obtener el tema y detectar si es vista móvil.
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  //Información del usuario desde el contexto de autenticación.
  const { isLoggedIn, user, logout } = useAuth();
  //Configuraciones de accesibilidad desde el contexto global.
  const { fontSize, highContrast, seniorMode, increaseFontSize, toggleContrast, toggleSeniorMode } = useAccessibility();

  const { mode, toggleTheme } = useThemeMode();

  //Controlan visibilidad del menú móvil, del menú de usuario y del menú de accesibilidad.
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [accessibilityAnchor, setAccessibilityAnchor] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  //Abre o cierra el menú lateral móvil.
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  //Abre el menú del perfil (usuario).
  const handleProfileMenu = (event) => setAnchorEl(event.currentTarget);
  //Abre el menú de opciones de accesibilidad.
  const handleAccessibilityMenu = (event) => setAccessibilityAnchor(event.currentTarget);

  //Cierra ambos menús (usuario y accesibilidad).
  const handleClose = () => {
    setAnchorEl(null);
    setAccessibilityAnchor(null);
  };

  //Maneja la búsqueda cuando presionan Enter.
  const handleSearch = (e) => {
    if (e.key === 'Enter') console.log('Buscando:', searchValue);
  };

  //Scroll suave a secciones del Home
  //Si estás en otra página, navega al Home y luego hace scroll.
  const handleScrollToSection = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  //Menú de navegación
  //Cambian según si el usuario está autenticado o no.
  const navigationItems = isLoggedIn
    ? [
      { text: 'Dashboard', path: '/dashboard' },
      { text: 'Rutinas', path: '/rutinas' },
      { text: 'Ejercicios', path: '/Exercises' },
      { text: 'Progreso', path: '/progreso' },
    ]
    : [
      { text: 'Inicio', path: 'inicio' },
      { text: 'Sobre nosotros', path: 'sobre-nosotros' },
      { text: 'Beneficios', path: 'beneficios' },
      { text: 'Contacto', path: 'contacto' },
    ];

  //Contenido del drawer (menu movil lateral)
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => isLoggedIn ? navigate(item.path) : handleScrollToSection(item.path)}
            >
              <ListItemText primary={item.text} />
              <ChevronRightIcon />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  //return principal del componente
  return (
    <AppBar position="static" role="navigation" aria-label="Barra principal de navegación">
      <Toolbar>
        {/*Icono del menu movil*/}
        {isMobile && (
          <IconButton color="inherit" aria-label="abrir menú" edge="start" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        )}

        {/*Logo que redirige segun login*/}
        <Typography
          variant="h6"
          component={RouterLink}
          to={isLoggedIn ? '/dashboard' : '/'}
          sx={{ textDecoration: 'none', color: 'inherit', flexGrow: 0, mr: 2 }}
        >
          {/*Logo provisional de la web*/}
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-seedling"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 3a7 7 0 0 1 6.95 6.155a6.97 6.97 0 0 1 5.05 -2.155h3a1 1 0 0 1 1 1v1a7 7 0 0 1 -7 7h-2v4a1 1 0 0 1 -2 0v-7h-2a7 7 0 0 1 -7 -7v-2a1 1 0 0 1 1 -1z" /></svg>
        </Typography>

        {/*Barra de busqueda si showSearchBar es true*/}
        {showSearchBar && (
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <InputBase
              placeholder="Buscar ejercicios..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e);
                }
              }}
              aria-label="Buscar ejercicios"
              sx={{
                color: 'inherit',
                padding: theme.spacing(1),
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 1,
                width: '100%',
                maxWidth: 400,
              }}
              startAdornment={<SearchIcon sx={{ mr: 1 }} />}
            />
          </Box>
        )}

        {/*Botones de navegacion en escritorio*/}
        {!isMobile && (
          <Stack direction="row" spacing={2} sx={{ flexGrow: 1, justifyContent: 'center' }}>
            {navigationItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                onClick={() =>
                  isLoggedIn ? navigate(item.path) : handleScrollToSection(item.path)
                }
              >
                {item.text}
              </Button>
            ))}
          </Stack>
        )}

        {/*Iconos y botones de perfil y login*/}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>

          {/*Modo claro y oscuro */}
          <Tooltip title="Cambio modo claro / oscuro ">
          <IconButton color="inherit" onClick={toggleTheme}>
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          </Tooltip>

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
            <>
              <IconButton onClick={handleProfileMenu} color="inherit" aria-label="menú de usuario">
                {user?.avatar ? <Avatar alt={user.name} src={user.avatar} /> : <AccountCircle />}
              </IconButton>
            </>
          ) : (
            <>
              <Button color="secondary" variant="secondary" component={RouterLink} to="/login">
                Iniciar sesión
              </Button>
              <Button color="secondary" variant="secondary" component={RouterLink} to="/register" sx={{ ml: 1 }}>
                Registrarse
              </Button>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Menú móvil */}
      <Drawer variant="temporary" anchor="left" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }}>
        {drawer}
      </Drawer>

      {/* Menú de usuario */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => { navigate('/perfil'); handleClose(); }}>Ver perfil</MenuItem>
        <MenuItem onClick={() => { navigate('/configuracion'); handleClose(); }}>Configuración</MenuItem>
        <MenuItem onClick={() => { logout(); handleClose(); }}>Cerrar sesión</MenuItem>
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
          <Typography variant="h6" gutterBottom>Accesibilidad</Typography>
          <List>
            <ListItem>
              <ListItemText primary="Tamaño de fuente" secondary={`Actual: ${fontSize}`} />
              <Button onClick={increaseFontSize} variant="outlined" sx={{ ml: 3 }}>Aumentar</Button>
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
