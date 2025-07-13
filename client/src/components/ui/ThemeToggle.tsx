import { Button } from '@/components/ui/Button';
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true)
  }, []);
  
  if (!mounted) return;
  
  return (
    <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} nameType="sidebarMenu">
      {theme === 'dark' ? '화이트모드로 전환' : '다크모드로 전환'}
    </Button>
  )
}