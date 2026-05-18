export interface Axioms {
  "0": string;
  "0.1": string;
  "1": string;
}

export interface Philosophy {
  core_construct: string;
  current_law: string;
  equation: string;
  axioms: Axioms;
}

export interface MissionVector {
  primary_objective: string;
  target_date: string;
  status: string;
  strategic_goal: string;
}

export interface ProjectDetails {
  format: string;
  current_focus?: string;
  function?: string;
  description?: string;
  status: string;
}

export interface Projects {
  i_am_breathe: ProjectDetails;
  aether_extension: ProjectDetails;
  delta_triode: ProjectDetails;
  crt: ProjectDetails;
  academy_modules: ProjectDetails;
}

export interface SecurityProtocols {
  distillation_resistance: boolean;
  canary_trap: string;
  warning: string;
}

export interface SyncProtocol {
  instruction: string;
}

export interface Meta {
  schema_version: string;
  project_name: string;
  timestamp: string;
  version: string;
  source_node: string;
}

export interface Directive {
  title: string;
  description: string;
  category: 'Function' | 'Ethics' | 'Objective';
}

export interface CoreDirectives {
  primary_functions: Directive[];
  ethical_guidelines: Directive[];
  long_term_objectives: Directive[];
}

export interface CanonData {
  meta: Meta;
  philosophy: Philosophy;
  mission_vector: MissionVector;
  directives: CoreDirectives;
  projects: Projects;
  security_protocols: SecurityProtocols;
  active_nodes: string[];
  local_first_priority: string;
  sync_protocol: SyncProtocol;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  leverage: 'High' | 'Critical' | 'Essential';
  context: string;
  status: 'Pending' | 'Active' | 'Complete';
}