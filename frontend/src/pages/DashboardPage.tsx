import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface NodeItem {
  id: string;
  label: string;
  category: string;
  tag: string;
  x: number;
  y: number;
}

interface EdgeItem {
  from: string;
  to: string;
  label: string;
}

export default function DashboardPage() {
  // Tabs State
  const [activeTab, setActiveTab] = useState<"writer" | "modeler">("writer");

  // --- AI Copywriter Tab State ---
  const [productName, setProductName] = useState("Organic Himalayan Herbs");
  const [category, setCategory] = useState("Herbs & Spices");
  const [altitude, setAltitude] = useState("7,000 ft");
  const [tone, setTone] = useState("Cultural Story");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState("");
  const [copied, setCopied] = useState(false);

  // --- Interactive Whiteboard Tab State (Section 5 Spec) ---
  const [nodes, setNodes] = useState<NodeItem[]>([
    { id: "1", label: "Wild Herbs", category: "input", tag: "wild-rhododendron", x: 40, y: 70 },
    { id: "2", label: "Altitude Origin", category: "input", tag: "harvesters-8500ft", x: 40, y: 220 },
    { id: "3", label: "HimShakti Engine", category: "processing", tag: "gemini-3.5-flash", x: 260, y: 145 },
    { id: "4", label: "E-com Story Output", category: "output", tag: "shopify-listing", x: 490, y: 70 },
    { id: "5", label: "SEO Metadata Tags", category: "output", tag: "json-tags", x: 490, y: 220 },
  ]);

  const [edges] = useState<EdgeItem[]>([
    { from: "1", to: "3", label: "extract botanical" },
    { from: "2", to: "3", label: "origin validation" },
    { from: "3", to: "4", label: "render description" },
    { from: "3", to: "5", label: "index seo terms" },
    // Duplicate edge to demonstrate Section 5.B Sibling Overlapping Offset math
    { from: "3", to: "4", label: "meta copy translation" },
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Handle generation click
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setCopied(false);

    setTimeout(() => {
      let copy = "";
      if (category === "Honey") {
        if (tone === "Cultural Story") {
          copy = `Nestled in the remote, mist-kissed ridges of the Himalayas at ${altitude}, our ${productName} represents a centuries-old harmony between bees and pristine nature. Hand-harvested by generational honey hunters, this raw, golden elixir carries the delicate floral essence of high-altitude blossoms. Unfiltered and raw, it preserves all natural enzymes and immune-boosting benefits, sharing the true sacred energy of the mountains with every spoonful.`;
        } else if (tone === "Premium Luxury") {
          copy = `Introducing the gold standard of high-altitude nectar. Our ${productName} is harvested at ${altitude} from untouched Himalayan wildflowers. This micro-batch honey is characterized by its deep, luxurious amber hue and intense floral bouquet. Unheated and minimally strained, it is a rare culinary treasure packed with powerful mountain antioxidants, presented for the discerning palate.`;
        } else {
          copy = `Buy 100% Pure Raw Himalayan Honey. Sourced at ${altitude}. Key benefits: raw, unpasteurized, organic wildflower honey. Ideal for boosting immunity, healthy sweetening, and natural wellness recipes. Order your jar of pure mountain wellness today.`;
        }
      } else if (category === "Shilajit") {
        if (tone === "Cultural Story") {
          copy = `Forged in the heart of the Himalayas over centuries, our ${productName} is harvested from steep black rock faces at ${altitude}. Known traditionally as the 'Destroyer of Weakness,' this purified shilajit resin is a sacred adaptogen used for vitality and strength. Hand-purified using pristine mountain spring water and Triphala, it brings you ancient longevity secrets in its purest form.`;
        } else if (tone === "Premium Luxury") {
          copy = `Experience high-performance wellness powered by the heights of the earth. Cultivated at ${altitude}, this ultra-grade ${productName} resin contains a high percentage of fulvic acid and trace minerals. Purified meticulously to meet top-tier purity certifications, it is the ultimate natural supplement to elevate your daily cognitive focus, energy, and physical resilience.`;
        } else {
          copy = `High-quality Pure Himalayan Shilajit Resin. Sourced at ${altitude}. Rich in Fulvic Acid and 80+ trace minerals. Boosts stamina, brain function, and natural immunity. Third-party lab tested for heavy metals. Shop the best organic shilajit online.`;
        }
      } else {
        if (tone === "Cultural Story") {
          copy = `Grown in the mineral-dense, glacial-fed soils of the Himalayan hillsides at ${altitude}, our ${productName} is tended by small farmer cooperatives. Sundried and stone-milled using age-old methods, these traditional crops are packed with pure nutrients. Each harvest supports local mountain livelihoods while bringing the rich, aromatic flavors of the valleys straight to your home.`;
        } else if (tone === "Premium Luxury") {
          copy = `Elevate your culinary creations with the ultimate mountain harvest. Grown at a pristine altitude of ${altitude}, this premium ${productName} is curated for peak potency, flavor, and purity. Carefully hand-selected and custom-packed, it delivers unmatched freshness and an authentic taste profile that stands in a class of its own.`;
        } else {
          copy = `Organic ${productName} from Himalayan Valleys. Cultivated at ${altitude} by local fair-trade cooperatives. 100% natural, pesticide-free, and sun-dried. Perfect for healthy cooking, culinary flavoring, and premium pantry upgrades. Fast shipping.`;
        }
      }
      setGeneratedCopy(copy);
      setIsGenerating(false);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- Modeler Whiteboard Canvas Handlers (Section 5 Spec) ---
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setDraggedNodeId(nodeId);

    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      // Find drag offsets relative to SVG canvas
      const svgElement = e.currentTarget.ownerDocument.getElementById("whiteboard-canvas");
      if (svgElement) {
        const rect = svgElement.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        setDragOffset({
          x: mouseX - node.x,
          y: mouseY - node.y,
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeId) {
      const svgElement = e.currentTarget.ownerDocument.getElementById("whiteboard-canvas");
      if (svgElement) {
        const rect = svgElement.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const newX = Math.max(0, Math.min(mouseX - dragOffset.x, rect.width - 124));
        const newY = Math.max(0, Math.min(mouseY - dragOffset.y, rect.height - 48));

        setNodes((prevNodes) =>
          prevNodes.map((n) => (n.id === draggedNodeId ? { ...n, x: newX, y: newY } : n))
        );
      }
    }
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  const updateNodeLabel = (id: string, newLabel: string) => {
    setNodes((prevNodes) => prevNodes.map((n) => (n.id === id ? { ...n, label: newLabel } : n)));
  };

  const updateNodeTag = (id: string, newTag: string) => {
    setNodes((prevNodes) => prevNodes.map((n) => (n.id === id ? { ...n, tag: newTag } : n)));
  };

  // Calculate curve endpoints, midpoints, peaks, and sibling offset perpendicular vectors
  const getEdgePathParams = (fromNode: NodeItem, toNode: NodeItem, edgeIndex: number, totalEdges: number) => {
    const x1 = fromNode.x + 62;
    const y1 = fromNode.y + 24;
    const x2 = toNode.x + 62;
    const y2 = toNode.y + 24;

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    let cx = midX;
    let cy = midY - 20; // Default slight curve

    // Section 5.B: Overlapping Connections spacing by 40px offsets via perpendicular vector
    if (totalEdges > 1) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const px = -dy / len;
      const py = dx / len;

      const step = 40;
      const offset = (edgeIndex - (totalEdges - 1) / 2) * step;
      cx += px * offset;
      cy += py * offset;
    }

    // Bezier quadratic curve peak calculation at t = 0.5: 0.25*P0 + 0.5*P1 + 0.25*P2
    const peakX = 0.25 * x1 + 0.5 * cx + 0.25 * x2;
    const peakY = 0.25 * y1 + 0.5 * cy + 0.25 * y2;

    return {
      d: `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`,
      labelX: peakX,
      labelY: peakY,
    };
  };

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col justify-between transition-colors duration-300">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Workspace Mode Selection Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-line pb-6 mb-10 gap-4">
          <div className="text-left space-y-1">
            <h1 className="text-3xl font-serif font-medium tracking-tight text-fg transition-colors duration-300">
              HimShakti Copy Workspace
            </h1>
            <p className="text-muted text-sm max-w-xl transition-colors duration-300">
              Configure copy parameters, edit semantic generation pipelines, or view visual model node trees.
            </p>
          </div>

          {/* Mode Switch Pills */}
          <div className="inline-flex p-1 bg-surface rounded-lg border border-line w-fit">
            <button
              onClick={() => setActiveTab("writer")}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
                activeTab === "writer"
                  ? "bg-raised text-accent shadow-sm"
                  : "text-muted hover:text-fg"
              }`}
            >
              AI Copywriter
            </button>
            <button
              onClick={() => setActiveTab("modeler")}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
                activeTab === "modeler"
                  ? "bg-raised text-accent shadow-sm"
                  : "text-muted hover:text-fg"
              }`}
            >
              Pipeline Modeler
            </button>
          </div>
        </div>

        {/* Tab 1: AI COPYWRITER WORKSPACE */}
        {activeTab === "writer" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            {/* Left panel: Input parameters */}
            <div className="grain lg:col-span-5 bg-raised border border-line rounded-card p-6 shadow-soft space-y-6 transition-colors duration-300">
              <h2 className="text-sm font-mono font-medium border-b border-line pb-3 flex items-center gap-2 text-fg">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                [writer] · properties
              </h2>

              <form onSubmit={handleGenerate} className="space-y-4 text-left">
                {/* Product Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-medium text-faint uppercase tracking-wider">Product Name</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full bg-surface/30 border border-line focus:border-accent rounded-lg px-3 py-2.5 text-sm text-fg focus:outline-none transition-colors focus-ring"
                    placeholder="e.g. Kashmiri Saffron"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-medium text-faint uppercase tracking-wider">Product Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-surface/30 border border-line focus:border-accent rounded-lg px-3 py-2.5 text-sm text-fg focus:outline-none transition-colors focus-ring"
                  >
                    <option value="Honey">Organic Honey</option>
                    <option value="Shilajit">Shilajit Resin</option>
                    <option value="Herbs & Spices">Herbs & Spices</option>
                    <option value="Grains">Mountain Grains & Millets</option>
                  </select>
                </div>

                {/* Altitude */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-medium text-faint uppercase tracking-wider">Harvest Altitude</label>
                  <select
                    value={altitude}
                    onChange={(e) => setAltitude(e.target.value)}
                    className="w-full bg-surface/30 border border-line focus:border-accent rounded-lg px-3 py-2.5 text-sm text-fg focus:outline-none transition-colors focus-ring"
                  >
                    <option value="5,000 ft">5,000 ft (Low Alpine)</option>
                    <option value="8,500 ft">8,500 ft (Mid Alpine)</option>
                    <option value="12,000 ft">12,000 ft (High Altitude)</option>
                    <option value="16,000 ft">16,000 ft (Glacial Valleys)</option>
                  </select>
                </div>

                {/* Tone */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-medium text-faint uppercase tracking-wider">AI Vibe & Tone</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Cultural Story", "Premium Luxury", "E-com SEO"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTone(t)}
                        className={`py-2 px-1 text-center rounded-lg text-xs font-semibold border transition-all ${
                          tone === t
                            ? "bg-accent-soft border-accent text-accent"
                            : "bg-surface/30 border-line text-muted hover:text-fg"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full mt-4 py-3 rounded-lg bg-accent text-accent-contrast hover:opacity-95 font-medium text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 focus-ring"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Generating description...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Generate Copy</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right panel: AI Generated output */}
            <div className="lg:col-span-7 h-full flex flex-col justify-between">
              <div className="grain bg-raised border border-line rounded-card p-6 shadow-soft min-h-[420px] flex flex-col justify-between text-left transition-colors duration-300">
                <div>
                  <div className="flex items-center justify-between border-b border-line pb-3 mb-6">
                    <h2 className="text-sm font-mono font-medium flex items-center gap-2 text-fg">
                      <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                      [writer] · generated copy
                    </h2>
                    {generatedCopy && (
                      <span className="text-[9px] font-mono bg-surface border border-line px-2.5 py-1 rounded text-muted uppercase">
                        Format: {tone}
                      </span>
                    )}
                  </div>

                  {generatedCopy ? (
                    <div className="p-5 bg-surface/30 border border-line rounded-xl font-serif text-fg leading-relaxed text-base min-h-[220px] whitespace-pre-wrap animate-fadeIn transition-colors duration-300">
                      {generatedCopy}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-surface/50 border border-line flex items-center justify-center text-2xl text-accent shadow-sm">
                        ⚡
                      </div>
                      <div>
                        <p className="font-serif font-semibold text-fg">No description generated yet</p>
                        <p className="text-xs text-muted max-w-xs mt-1 leading-relaxed">
                          Fill in the product details on the left panel and click "Generate Copy" to review your copy story.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {generatedCopy && (
                  <div className="mt-6 pt-4 border-t border-line flex flex-wrap gap-3 items-center justify-between">
                    <div className="text-xs font-mono text-muted">
                      Word Count: {generatedCopy.split(/\s+/).length} words
                    </div>

                    <button
                      onClick={handleCopy}
                      className={`py-2 px-4 rounded-lg text-xs font-medium transition-all duration-350 flex items-center gap-1.5 focus-ring ${
                        copied
                          ? "bg-accent text-accent-contrast"
                          : "bg-surface hover:bg-line/40 text-fg border border-line"
                      }`}
                    >
                      {copied ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          <span>Copy to Clipboard</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: PIPELINE MODELER (INTERACTIVE CANVAS - SECTION 5 SPEC) */}
        {activeTab === "modeler" && (
          <div className="bg-raised border border-line rounded-card p-6 shadow-soft animate-fadeIn text-left transition-colors duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4 mb-6 gap-2">
              <div>
                <h2 className="text-sm font-mono font-medium flex items-center gap-2 text-fg">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                  [modeler] · pipeline nodes
                </h2>
                <p className="text-xs text-muted mt-1">
                  Drag nodes to organize. Double-click any node to inline edit its name/tag.
                </p>
              </div>
              <div className="text-[10px] font-mono text-faint border border-line bg-surface/50 px-3 py-1 rounded-pill">
                SVG Canvas Coordinates Enabled
              </div>
            </div>

            {/* Dotted canvas geometry window wrapper */}
            <div className="relative border border-line rounded-card overflow-hidden bg-bg/25">
              <svg
                id="whiteboard-canvas"
                className="canvas-grid w-full h-[360px] cursor-grab select-none active:cursor-grabbing"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* SVG Arrowhead marker specification */}
                <defs>
                  <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" className="fill-muted/70 dark:fill-accent" />
                  </marker>
                </defs>

                {/* Render connection curves with perpendicular offsets and Bezier tags */}
                {edges.map((edge, idx) => {
                  const fromNode = nodes.find((n) => n.id === edge.from);
                  const toNode = nodes.find((n) => n.id === edge.to);
                  if (!fromNode || !toNode) return null;

                  // Find how many total edges exist between these two node ids
                  const siblingEdges = edges.filter(
                    (e) =>
                      (e.from === edge.from && e.to === edge.to) ||
                      (e.from === edge.to && e.to === edge.from)
                  );
                  const edgeIdx = siblingEdges.findIndex(
                    (e) => e.from === edge.from && e.to === edge.to && e.label === edge.label
                  );

                  const { d, labelX, labelY } = getEdgePathParams(
                    fromNode,
                    toNode,
                    edgeIdx,
                    siblingEdges.length
                  );

                  return (
                    <g key={idx}>
                      {/* Connection path line */}
                      <path
                        d={d}
                        fill="none"
                        className="stroke-line group-hover:stroke-accent/60 transition-colors duration-300"
                        strokeWidth="1.5"
                        markerEnd="url(#arrow)"
                      />

                      {/* Connection Label Card (centered at curve peak) */}
                      <g transform={`translate(${labelX}, ${labelY})`}>
                        <rect
                          x="-45"
                          y="-8"
                          width="90"
                          height="16"
                          rx="3"
                          className="fill-raised stroke-line"
                          strokeWidth="1"
                        />
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="fill-muted font-mono font-semibold"
                          fontSize="9px"
                        >
                          {edge.label}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Render nodes */}
                {nodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  const isEditing = editingNodeId === node.id;

                  // Selected state changes border style
                  const strokeWidth = isSelected ? 2 : 1;
                  const strokeColor = isSelected ? "var(--accent)" : "var(--line)";

                  return (
                    <g key={node.id}>
                      {/* If editing, render input form within a foreignObject (Section 5.A) */}
                      {isEditing ? (
                        <foreignObject
                          x={node.x}
                          y={node.y}
                          width="124"
                          height="48"
                          className="overflow-visible"
                        >
                          <div className="bg-raised border-2 border-accent rounded-[6px] p-1 shadow-lift w-full h-full flex flex-col justify-between text-left font-mono">
                            <input
                              type="text"
                              className="w-full bg-surface border-none px-1 py-0 text-[8px] font-mono text-accent focus:outline-none rounded"
                              value={node.tag}
                              onChange={(e) => updateNodeTag(node.id, e.target.value)}
                              onBlur={() => setEditingNodeId(null)}
                              onKeyDown={(e) => e.key === "Enter" && setEditingNodeId(null)}
                              autoFocus
                            />
                            <input
                              type="text"
                              className="w-full bg-surface border-none px-1 py-0.5 text-[10px] font-mono font-bold text-fg focus:outline-none rounded"
                              value={node.label}
                              onChange={(e) => updateNodeLabel(node.id, e.target.value)}
                              onBlur={() => setEditingNodeId(null)}
                              onKeyDown={(e) => e.key === "Enter" && setEditingNodeId(null)}
                            />
                          </div>
                        </foreignObject>
                      ) : (
                        // Render standard read-only node (Section 5.A)
                        <g
                          onMouseDown={(e) => handleMouseDown(e, node.id)}
                          onDoubleClick={() => setEditingNodeId(node.id)}
                          className="cursor-grab active:cursor-grabbing group/node"
                        >
                          {/* Node card box */}
                          <rect
                            x={node.x}
                            y={node.y}
                            width="124"
                            height="48"
                            rx="6"
                            className="fill-raised"
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            style={{
                              filter: isSelected ? "var(--shadow-lift)" : "var(--shadow-soft)",
                            }}
                          />

                          {/* Top row category label (8px, 0.7 opacity) */}
                          <text
                            x={node.x + 8}
                            y={node.y + 16}
                            className="fill-accent font-mono"
                            fontSize="8px"
                            opacity="0.8"
                          >
                            [{node.category}] · {node.tag}
                          </text>

                          {/* Bottom row label name (11px, bold) */}
                          <text
                            x={node.x + 8}
                            y={node.y + 34}
                            className="fill-fg font-mono font-bold"
                            fontSize="11px"
                          >
                            {node.label}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
            
            {/* Whiteboard Footer metadata info */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-faint justify-between">
              <div>
                Double-click any node to modify its label or properties. Drag to realign nodes.
              </div>
              <div className="font-mono">
                Nodes count: {nodes.length} | Edges count: {edges.length}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
