import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store';

export const useMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate('/login');
  };

  return {
    menuOpen,
    openMenu,
    closeMenu,
    handleLogout
  };
}; 