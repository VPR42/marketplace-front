export interface NavigationRoute {
  name: string;
  path: string;
}
export type NavigationRoutes = NavigationRoute[];

export interface Row {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  label: string;
  url: string;
}
export type Rows = Row[];
