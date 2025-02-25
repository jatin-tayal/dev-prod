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
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface MainProps {
  children: React.ReactNode;
}
