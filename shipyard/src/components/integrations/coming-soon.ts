// Integrations Shipyard doesn't support at all yet — no backend connector
// row, no toggle, purely a roadmap signal on the Integrations page.
export interface ComingSoonItem {
  id: string;
  name: string;
  category: string;
}

export const COMING_SOON: ComingSoonItem[] = [
  { id: 'prometheus', name: 'Prometheus', category: 'Observability' },
  { id: 'bigquery', name: 'BigQuery', category: 'Data & secrets' },
  { id: 'discord', name: 'Discord', category: 'Chat & alerts' },
  { id: 'opsgenie', name: 'Opsgenie', category: 'Chat & alerts' },
  { id: 'asana', name: 'Asana', category: 'Project management' },
];
