export interface AppHeaderProps {
  breadcrumbs?: { href?: string; label: string }[];
  role?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
}
