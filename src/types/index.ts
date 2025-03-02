export interface UtilityCategory {
  id: string;
  name: string;
  description: string;
  utilities: Utility[];
}

export interface Utility {
  id: string;
  name: string;
  description: string;
  path: string;
  icon?: string;
}

export interface LayoutProps {
  children: React.ReactNode;
}

export interface HeaderProps {
  title: string;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface MainProps {
  children: React.ReactNode;
}

export interface FooterProps {
  githubUrl: string;
}

export interface CategoryGroupProps {
  category: UtilityCategory;
  activePath: string;
  onNavItemClick?: () => void;
}

export interface NavItemProps {
  utility: Utility;
  isActive: boolean;
  onClick?: () => void;
}

export interface SearchBoxProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}
