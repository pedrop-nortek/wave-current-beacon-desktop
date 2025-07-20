
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun, Moon, Monitor } from 'lucide-react';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const themes = [
    { value: 'light', label: t('theme.light'), icon: Sun },
    { value: 'dark', label: t('theme.dark'), icon: Moon },
    { value: 'system', label: t('theme.system'), icon: Monitor }
  ];

  const currentTheme = themes.find(t => t.value === theme);
  const Icon = currentTheme?.icon || Monitor;

  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4" />
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {themes.map(themeOption => {
            const ThemeIcon = themeOption.icon;
            return (
              <SelectItem key={themeOption.value} value={themeOption.value}>
                <div className="flex items-center gap-2">
                  <ThemeIcon className="h-4 w-4" />
                  {themeOption.label}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
