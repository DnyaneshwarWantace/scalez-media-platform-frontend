import React, { useContext } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeContext } from '../App';

const ThemeToggle = () => {
  const { selectedTheme, setselectedTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    const newTheme = selectedTheme === 'light' ? 'dark' : 'light';
    setselectedTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add/remove dark class to body for proper theme application
    if (newTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-9 w-9 p-0 theme-toggle-button"
    >
      {selectedTheme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
