const breadcrumbLabels: { [key: string]: string } = {
  users: "petani",
  dashboard: "Beranda",
};

const formatSegment = (s: string) => {
  const customLabel = breadcrumbLabels[s];
  if (customLabel) {
    return customLabel;
  }
  const formatted = s.replace(/-/g, " ");
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export const getBreadcrumbs = (pathname: string) => {
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const label = formatSegment(segment);
    return { label, href };
  });
  return breadcrumbs;
};
