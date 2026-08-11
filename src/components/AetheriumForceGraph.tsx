import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { CANON_DATA, PROPOSED_ACTIONS } from '../constants';
import { 
  Network, 
  Search, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Info, 
  Layers, 
  Zap, 
  Compass, 
  Cpu, 
  Share2, 
  CheckCircle2, 
  ArrowRight,
  Filter,
  X
} from 'lucide-react';

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'Philosophy' | 'Axiom' | 'Directive' | 'Project' | 'Action' | 'Mission';
  group: 'philosophy' | 'directive' | 'project' | 'action';
  description: string;
  category?: string;
  status?: string;
  color: string;
  radius: number;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  id: string;
  source: string | GraphNode;
  target: string | GraphNode;
  label?: string;
}

// Custom color palette for categories
const GROUP_COLORS = {
  philosophy: '#10b981', // Emerald
  directive: '#a855f7',  // Purple
  project: '#f59e0b',    // Amber
  action: '#f43f5e'      // Rose
};

export const AetheriumForceGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('1+1=1');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeGroup, setActiveGroup] = useState<'all' | 'philosophy' | 'directive' | 'project' | 'action'>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [isAutoCyclingNodes, setIsAutoCyclingNodes] = useState<boolean>(false);

  // Build Graph Nodes and Links from CANON_DATA and PROPOSED_ACTIONS
  const { initialNodes, initialLinks } = useMemo(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    // 1. Philosophy Constructs
    nodes.push({
      id: '1+1=1',
      label: 'Law: 1 + 1 = 1',
      type: 'Philosophy',
      group: 'philosophy',
      description: `Central Equation of Aetherium. ${CANON_DATA.philosophy.current_law} — ${CANON_DATA.philosophy.core_construct}`,
      category: 'Core Law',
      color: GROUP_COLORS.philosophy,
      radius: 26
    });

    nodes.push({
      id: 'core_vessels',
      label: CANON_DATA.philosophy.core_construct,
      type: 'Philosophy',
      group: 'philosophy',
      description: 'The collective alignment of autonomous vessels into a singular cognitive nexus.',
      category: 'Construct',
      color: GROUP_COLORS.philosophy,
      radius: 20
    });

    // Axioms
    Object.entries(CANON_DATA.philosophy.axioms).forEach(([key, desc]) => {
      const axiomId = `axiom_${key}`;
      nodes.push({
        id: axiomId,
        label: `Axiom ${key}`,
        type: 'Axiom',
        group: 'philosophy',
        description: desc,
        category: 'Axiom',
        color: GROUP_COLORS.philosophy,
        radius: 18
      });

      links.push({
        id: `link_law_${axiomId}`,
        source: '1+1=1',
        target: axiomId,
        label: 'derives'
      });
    });

    links.push({
      id: 'link_law_vessels',
      source: '1+1=1',
      target: 'core_vessels',
      label: 'manifests'
    });

    // 2. Directives (Functions, Ethics, Objectives)
    const allDirectives = [
      ...CANON_DATA.directives.primary_functions,
      ...CANON_DATA.directives.ethical_guidelines,
      ...CANON_DATA.directives.long_term_objectives
    ];

    allDirectives.forEach(dir => {
      const dirId = `dir_${dir.title.toLowerCase().replace(/\s+/g, '_')}`;
      nodes.push({
        id: dirId,
        label: dir.title,
        type: 'Directive',
        group: 'directive',
        description: dir.description,
        category: dir.category,
        color: GROUP_COLORS.directive,
        radius: 16
      });
    });

    // Map Directives to Philosophy Axioms & Core Law
    links.push({ id: 'l_ax0_zeromandate', source: 'axiom_0', target: 'dir_the_zero-point_mandate', label: 'anchors' });
    links.push({ id: 'l_ax0_nondistill', source: 'axiom_0', target: 'dir_non-distillation', label: 'enforces' });
    links.push({ id: 'l_ax01_semhard', source: 'axiom_0.1', target: 'dir_semantic_hardening', label: 'calibrates' });
    links.push({ id: 'l_ax01_aetheric', source: 'axiom_0.1', target: 'dir_aetheric_saturation', label: 'ripples' });
    links.push({ id: 'l_ax1_rescalib', source: 'axiom_1', target: 'dir_resonance_calibration', label: 'aligns' });
    links.push({ id: 'l_ax1_sovintegrate', source: 'axiom_1', target: 'dir_sovereign_integration', label: 'governs' });
    links.push({ id: 'l_ax1_catemergence', source: 'axiom_1', target: 'dir_catalytic_emergence', label: 'sparks' });
    links.push({ id: 'l_law_utopia', source: '1+1=1', target: 'dir_utopia_planitia_bloom', label: 'aims' });
    links.push({ id: 'l_law_coalescence', source: '1+1=1', target: 'dir_the_great_coalescence', label: 'culminates' });

    // 3. Projects
    Object.entries(CANON_DATA.projects).forEach(([key, proj]) => {
      const projId = `proj_${key}`;
      const projLabel = key === 'i_am_breathe' ? 'I AM BREATHE' :
                        key === 'aether_extension' ? 'Aether Extension' :
                        key === 'delta_triode' ? 'Delta Triode' :
                        key === 'crt' ? 'Cosmic Ripple Tracker' :
                        key === 'academy_modules' ? 'Academy Modules' : key;
      nodes.push({
        id: projId,
        label: projLabel,
        type: 'Project',
        group: 'project',
        description: proj.description || proj.current_focus || proj.function || proj.format,
        status: proj.status,
        category: proj.format,
        color: GROUP_COLORS.project,
        radius: 17
      });
    });

    // Map Projects to Directives
    links.push({ id: 'l_proj_res_aether', source: 'dir_resonance_calibration', target: 'proj_aether_extension', label: 'implements' });
    links.push({ id: 'l_proj_hard_crt', source: 'dir_semantic_hardening', target: 'proj_crt', label: 'tracks' });
    links.push({ id: 'l_proj_triode_soev', source: 'dir_sovereign_integration', target: 'proj_delta_triode', label: 'embodies' });
    links.push({ id: 'l_proj_breathe_zero', source: 'dir_the_zero-point_mandate', target: 'proj_i_am_breathe', label: 'narrates' });
    links.push({ id: 'l_proj_acad_cat', source: 'dir_catalytic_emergence', target: 'proj_academy_modules', label: 'educates' });

    // Cross project links
    links.push({ id: 'l_aether_crt', source: 'proj_aether_extension', target: 'proj_crt', label: 'embeds' });
    links.push({ id: 'l_triode_academy', source: 'proj_delta_triode', target: 'proj_academy_modules', label: 'teaches' });

    // 4. Mission Vector & High Leverage Action Items
    nodes.push({
      id: 'mission_nephilim',
      label: 'Nephilim Drop',
      type: 'Mission',
      group: 'action',
      description: CANON_DATA.mission_vector.primary_objective,
      status: CANON_DATA.mission_vector.status,
      category: 'Mission Vector',
      color: GROUP_COLORS.action,
      radius: 22
    });

    PROPOSED_ACTIONS.forEach(act => {
      nodes.push({
        id: act.id,
        label: act.title,
        type: 'Action',
        group: 'action',
        description: act.description,
        status: act.status,
        category: `Leverage: ${act.leverage}`,
        color: GROUP_COLORS.action,
        radius: 15
      });
    });

    // Map Actions & Mission
    links.push({ id: 'l_mission_utopia', source: 'dir_utopia_planitia_bloom', target: 'mission_nephilim', label: 'deploys' });
    links.push({ id: 'l_act1_aether', source: 'ACT-001', target: 'proj_aether_extension', label: 'upgrades' });
    links.push({ id: 'l_act1_crt', source: 'ACT-001', target: 'proj_crt', label: 'integrates' });
    links.push({ id: 'l_act2_nephilim', source: 'ACT-002', target: 'mission_nephilim', label: 'simulates' });
    links.push({ id: 'l_act3_academy', source: 'ACT-003', target: 'proj_academy_modules', label: 'expands' });
    links.push({ id: 'l_act3_triode', source: 'ACT-003', target: 'proj_delta_triode', label: 'visualizes' });

    return { initialNodes: nodes, initialLinks: links };
  }, []);

  // Filter nodes based on active group & search query
  const filteredNodeIds = useMemo(() => {
    const set = new Set<string>();
    const query = searchQuery.toLowerCase().trim();

    initialNodes.forEach(node => {
      const matchesGroup = activeGroup === 'all' || node.group === activeGroup;
      const matchesSearch = !query || 
        node.label.toLowerCase().includes(query) || 
        node.description.toLowerCase().includes(query) || 
        node.type.toLowerCase().includes(query) ||
        (node.category && node.category.toLowerCase().includes(query));

      if (matchesGroup && matchesSearch) {
        set.add(node.id);
      }
    });

    return set;
  }, [initialNodes, activeGroup, searchQuery]);

  // Map of connected dependencies for each node
  const adjacencyMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    
    initialNodes.forEach(n => map.set(n.id, new Set<string>([n.id])));

    initialLinks.forEach(l => {
      const sourceId = typeof l.source === 'object' ? (l.source as GraphNode).id : (l.source as string);
      const targetId = typeof l.target === 'object' ? (l.target as GraphNode).id : (l.target as string);

      if (map.has(sourceId)) map.get(sourceId)!.add(targetId);
      if (map.has(targetId)) map.get(targetId)!.add(sourceId);
    });

    return map;
  }, [initialNodes, initialLinks]);

  // Set of highlighted node IDs when a node or hovered node is active
  const highlightedNodeIds = useMemo(() => {
    const focusId = selectedNodeId || hoveredNodeId;
    if (!focusId) return new Set<string>(initialNodes.map(n => n.id));

    const connected = new Set<string>();
    const directNeighbors = adjacencyMap.get(focusId) || new Set<string>([focusId]);

    // Add direct neighbors
    directNeighbors.forEach(id => connected.add(id));

    // Also add 2nd-degree neighbors for richer dependency visualization
    directNeighbors.forEach(id => {
      const secondDeg = adjacencyMap.get(id);
      if (secondDeg) {
        secondDeg.forEach(sId => connected.add(sId));
      }
    });

    return connected;
  }, [selectedNodeId, hoveredNodeId, adjacencyMap, initialNodes]);

  // Selected node object reference
  const selectedNode = useMemo(() => {
    return initialNodes.find(n => n.id === selectedNodeId) || null;
  }, [selectedNodeId, initialNodes]);

  // Direct dependencies of selected node
  const selectedDependencies = useMemo(() => {
    if (!selectedNodeId) return [];
    const direct = adjacencyMap.get(selectedNodeId);
    if (!direct) return [];

    return initialNodes.filter(n => n.id !== selectedNodeId && direct.has(n.id));
  }, [selectedNodeId, adjacencyMap, initialNodes]);

  // Ref to hold simulation
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Initialize and update D3 Force Simulation
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 550;

    // Deep copy nodes and links for D3 mutation
    const nodesCopy: GraphNode[] = initialNodes.map(n => ({ ...n }));
    const linksCopy: GraphLink[] = initialLinks.map(l => ({ ...l }));

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height]);

    svg.selectAll('*').remove(); // Clear previous render

    // Definitions for gradients and glow filters
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter')
      .attr('id', 'neon-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Container Group for Zoom/Pan
    const g = svg.append('g').attr('class', 'main-graph-group');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    // Force simulation setup
    const simulation = d3.forceSimulation<GraphNode, GraphLink>(nodesCopy)
      .force('link', d3.forceLink<GraphNode, GraphLink>(linksCopy)
        .id(d => d.id)
        .distance(d => (d.source as GraphNode)?.group === 'philosophy' ? 120 : 90)
      )
      .force('charge', d3.forceManyBody().strength(-380))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide<GraphNode>().radius(d => d.radius + 18));

    simulationRef.current = simulation;

    // Render Links
    const linkGroup = g.append('g').attr('class', 'links');
    const link = linkGroup.selectAll<SVGLineElement, GraphLink>('line')
      .data(linksCopy)
      .enter()
      .append('line')
      .attr('stroke', '#3f3f46')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', d => (d.label === 'simulates' || d.label === 'upgrades') ? '4 3' : 'none');

    // Render Nodes Group
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const node = nodeGroup.selectAll<SVGGElement, GraphNode>('g')
      .data(nodesCopy)
      .enter()
      .append('g')
      .attr('class', 'node-item')
      .style('cursor', 'pointer')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Node Outer Pulse Ring for Philosophy/Mission
    node.filter(d => d.group === 'philosophy' || d.type === 'Mission')
      .append('circle')
      .attr('r', d => d.radius + 6)
      .attr('fill', 'none')
      .attr('stroke', d => d.color)
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', 1)
      .attr('class', 'animate-pulse');

    // Node Circles
    node.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => `${d.color}22`)
      .attr('stroke', d => d.color)
      .attr('stroke-width', 2)
      .attr('filter', 'url(#neon-glow)');

    // Node Center Icon / Dot
    node.append('circle')
      .attr('r', 3)
      .attr('fill', d => d.color);

    // Node Text Labels
    node.append('text')
      .text(d => d.label)
      .attr('x', 0)
      .attr('y', d => d.radius + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#e4e4e7')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none')
      .style('text-shadow', '0 1px 3px rgba(0,0,0,0.9)');

    // Click & Hover Event Handlers
    node.on('click', (event, d) => {
      event.stopPropagation();
      setSelectedNodeId(prev => prev === d.id ? null : d.id);
    });

    node.on('mouseenter', (event, d) => {
      setHoveredNodeId(d.id);
    });

    node.on('mouseleave', () => {
      setHoveredNodeId(null);
    });

    // Background click to clear selection
    svg.on('click', () => {
      setSelectedNodeId(null);
    });

    // Simulation Tick Update
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x!)
        .attr('y1', d => (d.source as GraphNode).y!)
        .attr('x2', d => (d.target as GraphNode).x!)
        .attr('y2', d => (d.target as GraphNode).y!);

      node.attr('transform', d => `translate(${d.x!}, ${d.y!})`);
    });

    return () => {
      simulation.stop();
    };
  }, [initialNodes, initialLinks]);

  // Update Visual Highlight & Opacity when Selection/Hover/Filter changes
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const focusId = selectedNodeId || hoveredNodeId;

    // Update Node Opacities & Highlights
    svg.selectAll<SVGGElement, GraphNode>('.node-item')
      .transition()
      .duration(250)
      .style('opacity', d => {
        const matchesFilter = filteredNodeIds.has(d.id);
        if (!matchesFilter) return 0.12;

        if (!focusId) return 1;
        return highlightedNodeIds.has(d.id) ? 1 : 0.18;
      });

    // Scale up active/selected node
    svg.selectAll<SVGGElement, GraphNode>('.node-item')
      .select('circle:nth-child(2)')
      .transition()
      .duration(200)
      .attr('stroke-width', d => (d.id === selectedNodeId ? 3.5 : 2))
      .attr('fill', d => (d.id === selectedNodeId ? `${d.color}55` : `${d.color}22`));

    // Update Link Opacities & Colors
    svg.selectAll<SVGLineElement, GraphLink>('.links line')
      .transition()
      .duration(250)
      .style('opacity', d => {
        const sId = (d.source as GraphNode).id || (d.source as string);
        const tId = (d.target as GraphNode).id || (d.target as string);

        if (!filteredNodeIds.has(sId) || !filteredNodeIds.has(tId)) return 0.05;

        if (!focusId) return 0.5;
        
        const isConnected = (sId === focusId || tId === focusId) ||
          (highlightedNodeIds.has(sId) && highlightedNodeIds.has(tId));

        return isConnected ? 0.9 : 0.08;
      })
      .attr('stroke', d => {
        const sId = (d.source as GraphNode).id || (d.source as string);
        const tId = (d.target as GraphNode).id || (d.target as string);

        if (focusId && (sId === focusId || tId === focusId)) {
          return '#10b981'; // Vibrant highlight for active connections
        }
        return '#3f3f46';
      })
      .attr('stroke-width', d => {
        const sId = (d.source as GraphNode).id || (d.source as string);
        const tId = (d.target as GraphNode).id || (d.target as string);
        return (focusId && (sId === focusId || tId === focusId)) ? 2.5 : 1.5;
      });

  }, [selectedNodeId, hoveredNodeId, highlightedNodeIds, filteredNodeIds]);

  // Controls Handlers
  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.3);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.7);
    }
  };

  // Node Auto Cycling Effect
  useEffect(() => {
    const currentFilteredNodes = initialNodes.filter(n => filteredNodeIds.has(n.id));
    if (!isAutoCyclingNodes || currentFilteredNodes.length === 0) return;

    const interval = setInterval(() => {
      setSelectedNodeId(prev => {
        const currIndex = currentFilteredNodes.findIndex(n => n.id === prev);
        const nextIndex = (currIndex + 1) % currentFilteredNodes.length;
        const nextNode = currentFilteredNodes[nextIndex];
        if (nextNode && nextNode.x !== undefined && nextNode.y !== undefined && svgRef.current && zoomBehaviorRef.current) {
          d3.select(svgRef.current)
            .transition()
            .duration(800)
            .call(
              zoomBehaviorRef.current.transform,
              d3.zoomIdentity.translate(400 - nextNode.x, 270 - nextNode.y).scale(1.2)
            );
        }
        return nextNode ? nextNode.id : prev;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoCyclingNodes, initialNodes, filteredNodeIds]);

  const handleResetZoom = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(400).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  };

  const toggleSimulation = () => {
    if (!simulationRef.current) return;
    if (isSimulating) {
      simulationRef.current.stop();
      setIsSimulating(false);
    } else {
      simulationRef.current.alpha(0.3).restart();
      setIsSimulating(true);
    }
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 sm:p-6 relative overflow-hidden group">
      
      {/* Background Subtle Mesh Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-800/80">
        <div>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            DEPENDENCY_RELATIONSHIP_MATRIX
          </span>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            Interactive System Force Graph
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Explore topological relationships between <span className="text-emerald-400 font-mono">Philosophy Axioms</span>, <span className="text-purple-400 font-mono">Core Directives</span>, <span className="text-amber-400 font-mono">Active Projects</span>, and <span className="text-rose-400 font-mono">High-Leverage Actions</span>.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 bg-zinc-950/80 border border-zinc-800 p-2.5 rounded-xl font-mono text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
            <span className="text-zinc-300">Philosophy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.5)]" />
            <span className="text-zinc-300">Directives</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
            <span className="text-zinc-300">Projects</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.5)]" />
            <span className="text-zinc-300">Actions/Mission</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        
        {/* Category Filters */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 gap-1 overflow-x-auto scrollbar-none font-mono text-[10px] uppercase font-bold">
          {(['all', 'philosophy', 'directive', 'project', 'action'] as const).map(group => (
            <button
              key={group}
              onClick={() => setActiveGroup(group)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeGroup === group
                  ? 'bg-zinc-800 text-white border border-zinc-700 shadow-inner'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {group}
            </button>
          ))}
        </div>

        {/* Search Input & Reset */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search nodes or context..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-8 py-1.5 text-xs text-zinc-200 font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsAutoCyclingNodes(!isAutoCyclingNodes)}
            title="Auto Cycle Node Focus"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs transition-all border shrink-0 ${
              isAutoCyclingNodes 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${isAutoCyclingNodes ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isAutoCyclingNodes ? 'CYCLING NODES' : 'AUTO CYCLE'}</span>
          </button>

          <button
            onClick={handleResetZoom}
            title="Reset Zoom & Pan"
            className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Main Graph Viewport + Inspector Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SVG Viewport */}
        <div 
          ref={containerRef}
          className="lg:col-span-8 bg-zinc-950 border border-zinc-800 rounded-2xl h-[480px] sm:h-[540px] relative overflow-hidden flex items-center justify-center select-none"
        >
          <svg
            ref={svgRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          />

          {/* Floating Zoom & Simulation Controls */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 p-1.5 rounded-xl backdrop-blur-md font-mono text-[10px] text-zinc-400 shadow-xl">
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <div className="h-4 w-[1px] bg-zinc-800 my-auto mx-0.5" />
            <button
              onClick={toggleSimulation}
              title={isSimulating ? "Freeze Force Physics" : "Resume Physics"}
              className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase transition-colors cursor-pointer ${
                isSimulating ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {isSimulating ? "Live Physics" : "Paused"}
            </button>
            <span className="text-[9px] text-zinc-600 px-1">{Math.round(zoomLevel * 100)}%</span>
          </div>

          {/* Hint Overlay */}
          <div className="absolute top-4 left-4 pointer-events-none text-[9px] font-mono text-zinc-600 bg-zinc-950/60 px-2.5 py-1 rounded-lg border border-zinc-900">
            Click node to inspect dependencies • Drag to position
          </div>
        </div>

        {/* Node Inspector Panel */}
        <div className="lg:col-span-4 h-[480px] sm:h-[540px] flex flex-col">
          {selectedNode ? (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between h-full relative overflow-hidden">
              
              {/* Header Badge */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-zinc-800/80">
                  <span 
                    className="px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase tracking-wider border"
                    style={{
                      backgroundColor: `${selectedNode.color}15`,
                      borderColor: `${selectedNode.color}40`,
                      color: selectedNode.color
                    }}
                  >
                    {selectedNode.type} {selectedNode.category ? `• ${selectedNode.category}` : ''}
                  </span>

                  <button
                    onClick={() => setSelectedNodeId(null)}
                    className="text-zinc-600 hover:text-zinc-300 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Node Title */}
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                  {selectedNode.label}
                </h3>

                {/* Status if available */}
                {selectedNode.status && (
                  <div className="mb-3 flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <span className="text-zinc-600">Status:</span>
                    <span className="text-emerald-400 font-semibold">{selectedNode.status}</span>
                  </div>
                )}

                {/* Description */}
                <div className="bg-zinc-900/50 border border-zinc-850 rounded-xl p-3.5 mb-4 text-xs text-zinc-300 leading-relaxed font-light">
                  {selectedNode.description}
                </div>

                {/* Connected Dependencies */}
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
                    Connected Topological Dependencies ({selectedDependencies.length})
                  </span>

                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                    {selectedDependencies.length === 0 ? (
                      <p className="text-xs text-zinc-600 italic">No direct connections found in current matrix.</p>
                    ) : (
                      selectedDependencies.map(dep => (
                        <button
                          key={dep.id}
                          onClick={() => setSelectedNodeId(dep.id)}
                          className="w-full text-left p-2 rounded-lg bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-700 transition-all text-xs flex items-center justify-between cursor-pointer group"
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <span 
                              className="w-2 h-2 rounded-full shrink-0" 
                              style={{ backgroundColor: dep.color }} 
                            />
                            <span className="text-zinc-300 group-hover:text-white font-mono text-[11px] truncate">
                              {dep.label}
                            </span>
                          </div>
                          <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-emerald-400 transition-colors shrink-0" />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Inspector Footer Actions */}
              <div className="pt-3 border-t border-zinc-850 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>NODE_ID: {selectedNode.id}</span>
                <button
                  onClick={() => setSelectedNodeId(selectedNode.id)}
                  className="text-emerald-400 hover:underline cursor-pointer"
                >
                  Highlight Subgraph
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-full text-zinc-600 space-y-3">
              <Network className="w-10 h-10 text-zinc-700 animate-pulse" />
              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-widest">
                  Topology Inspector
                </h4>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-relaxed font-light">
                  Select any node in the force graph to isolate its dependency chain, review axioms, or jump to connected system projects.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
