import React, { useState, useEffect, useRef, useCallback } from 'react';

export const DRAWING_TOOLS = [
  { id: 'cursor', name: 'Select / Move', icon: 'Pointer' },
  { id: 'trendline', name: 'Trend Line', icon: 'TrendingUp' },
  { id: 'horizontal', name: 'Horizontal Line', icon: 'Minus' },
  { id: 'ray', name: 'Ray Line', icon: 'ArrowUpRight' },
  { id: 'vertical', name: 'Vertical Line', icon: 'MoveVertical' },
  { id: 'brush', name: 'Freehand Brush', icon: 'PenTool' },
  { id: 'rectangle', name: 'Rectangle Zone', icon: 'Square' },
  { id: 'fibonacci', name: 'Fibonacci Retracement', icon: 'Sliders' },
  { id: 'fib_extension', name: 'Fibonacci Extension', icon: 'Maximize2' },
  { id: 'xabcd', name: 'XABCD Harmonic Pattern', icon: 'Share2' },
  { id: 'long_position', name: 'Long Position (R:R)', icon: 'ArrowUpCircle' },
  { id: 'short_position', name: 'Short Position (R:R)', icon: 'ArrowDownCircle' },
  { id: 'measure', name: 'Price Range / Measure', icon: 'Ruler' },
];

export const DrawingToolsLayer = ({
  chartInstance,
  seriesInstance,
  symbol = 'EUR/USD',
  timeframe = '1H',
  activeTool = 'cursor',
  onToolSelect,
  width,
  height,
}) => {
  const [drawings, setDrawings] = useState([]);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [selectedDrawingId, setSelectedDrawingId] = useState(null);
  const [currentDraft, setCurrentDraft] = useState(null);
  const [drawColor, setDrawColor] = useState('#F59E0B'); // KKN Gold

  const svgRef = useRef(null);

  // Storage key
  const storageKey = `kkn_drawings_${symbol.replace('/', '_')}_${timeframe}`;

  // Load persisted drawings on symbol or timeframe change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setDrawings(parsed);
        setHistory([parsed]);
      } else {
        setDrawings([]);
        setHistory([[]]);
      }
      setRedoStack([]);
      setSelectedDrawingId(null);
      setCurrentDraft(null);
    } catch (e) {
      setDrawings([]);
    }
  }, [storageKey]);

  // Save drawings to localStorage
  const persistDrawings = useCallback((newDrawings) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newDrawings));
    } catch (e) {
      // ignore
    }
  }, [storageKey]);

  const updateDrawingsWithHistory = (newDrawings) => {
    setHistory((prev) => [...prev, newDrawings]);
    setRedoStack([]);
    setDrawings(newDrawings);
    persistDrawings(newDrawings);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const current = history[history.length - 1];
    const previous = history[history.length - 2];
    setRedoStack((prev) => [current, ...prev]);
    setHistory((prev) => prev.slice(0, -1));
    setDrawings(previous);
    persistDrawings(previous);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setRedoStack((prev) => prev.slice(1));
    setHistory((prev) => [...prev, next]);
    setDrawings(next);
    persistDrawings(next);
  };

  const handleDeleteSelected = () => {
    if (!selectedDrawingId) return;
    const filtered = drawings.filter((d) => d.id !== selectedDrawingId);
    setSelectedDrawingId(null);
    updateDrawingsWithHistory(filtered);
  };

  const handleDeleteAll = () => {
    setSelectedDrawingId(null);
    setCurrentDraft(null);
    updateDrawingsWithHistory([]);
  };

  // Convert (time, price) to pixel coordinates (x, y)
  const toScreenCoords = useCallback((point) => {
    if (!chartInstance || !seriesInstance || !point) return { x: 0, y: 0 };
    try {
      const timeScale = chartInstance.timeScale();
      const x = point.time ? timeScale.timeToCoordinate(point.time) : point.x;
      const y = point.price ? seriesInstance.priceToCoordinate(point.price) : point.y;
      return { x: x || point.x || 0, y: y || point.y || 0 };
    } catch (err) {
      return { x: point.x || 0, y: point.y || 0 };
    }
  }, [chartInstance, seriesInstance]);

  // Convert pixel coordinates (x, y) to (time, price)
  const toChartCoords = useCallback((pixelX, pixelY) => {
    if (!chartInstance || !seriesInstance) return { x: pixelX, y: pixelY, time: null, price: null };
    try {
      const timeScale = chartInstance.timeScale();
      const time = timeScale.coordinateToTime(pixelX);
      const price = seriesInstance.coordinateToPrice(pixelY);
      return { x: pixelX, y: pixelY, time, price };
    } catch (err) {
      return { x: pixelX, y: pixelY, time: null, price: null };
    }
  }, [chartInstance, seriesInstance]);

  // ==========================================
  // MOUSE / TOUCH DRAWING EVENT HANDLERS
  // ==========================================
  const handleMouseDown = (e) => {
    if (activeTool === 'cursor') return;
    const rect = svgRef.current.getBoundingClientRect();
    const pixelX = e.clientX - rect.left;
    const pixelY = e.clientY - rect.top;
    const chartCoords = toChartCoords(pixelX, pixelY);

    if (!currentDraft) {
      // First click: start drafting
      if (activeTool === 'horizontal') {
        // Horizontal line finishes on 1 click
        const newDrawing = {
          id: `h_${Date.now()}`,
          type: 'horizontal',
          price: chartCoords.price,
          y: pixelY,
          color: drawColor,
        };
        updateDrawingsWithHistory([...drawings, newDrawing]);
        if (onToolSelect) onToolSelect('cursor');
      } else if (activeTool === 'vertical') {
        const newDrawing = {
          id: `v_${Date.now()}`,
          type: 'vertical',
          time: chartCoords.time,
          x: pixelX,
          color: drawColor,
        };
        updateDrawingsWithHistory([...drawings, newDrawing]);
        if (onToolSelect) onToolSelect('cursor');
      } else if (activeTool === 'brush') {
        setCurrentDraft({
          id: `brush_${Date.now()}`,
          type: 'brush',
          points: [chartCoords],
          color: drawColor,
        });
      } else if (activeTool === 'xabcd') {
        // Multi-point harmonic pattern
        setCurrentDraft({
          id: `xabcd_${Date.now()}`,
          type: 'xabcd',
          points: [chartCoords],
          color: drawColor,
        });
      } else if (activeTool === 'long_position' || activeTool === 'short_position') {
        // Position tool initializes with standard 1:2 R:R box around entry
        const entryPrice = chartCoords.price || 1.0850;
        const offset = entryPrice * 0.003; // ~30 pips
        const isLong = activeTool === 'long_position';
        const newDrawing = {
          id: `pos_${Date.now()}`,
          type: activeTool,
          entryPrice: Number(entryPrice.toFixed(5)),
          stopPrice: Number((isLong ? entryPrice - offset : entryPrice + offset).toFixed(5)),
          targetPrice: Number((isLong ? entryPrice + offset * 2 : entryPrice - offset * 2).toFixed(5)),
          time: chartCoords.time,
          startX: pixelX,
          width: 140,
        };
        updateDrawingsWithHistory([...drawings, newDrawing]);
        if (onToolSelect) onToolSelect('cursor');
      } else {
        // 2-point tools (trendline, ray, rectangle, fibonacci, fib_extension, measure)
        setCurrentDraft({
          id: `${activeTool}_${Date.now()}`,
          type: activeTool,
          p1: chartCoords,
          p2: chartCoords,
          color: drawColor,
        });
      }
    } else {
      // Second or subsequent click
      if (currentDraft.type === 'xabcd') {
        const updatedPoints = [...currentDraft.points, chartCoords];
        if (updatedPoints.length >= 5) {
          // X, A, B, C, D complete
          updateDrawingsWithHistory([...drawings, { ...currentDraft, points: updatedPoints }]);
          setCurrentDraft(null);
          if (onToolSelect) onToolSelect('cursor');
        } else {
          setCurrentDraft({ ...currentDraft, points: updatedPoints });
        }
      } else if (currentDraft.type !== 'brush') {
        // Finalize 2-point drawing
        updateDrawingsWithHistory([...drawings, { ...currentDraft, p2: chartCoords }]);
        setCurrentDraft(null);
        if (onToolSelect) onToolSelect('cursor');
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!currentDraft) return;
    const rect = svgRef.current.getBoundingClientRect();
    const pixelX = e.clientX - rect.left;
    const pixelY = e.clientY - rect.top;
    const chartCoords = toChartCoords(pixelX, pixelY);

    if (currentDraft.type === 'brush') {
      setCurrentDraft((prev) => ({
        ...prev,
        points: [...prev.points, chartCoords],
      }));
    } else if (currentDraft.type === 'xabcd') {
      // preview next leg
      setCurrentDraft((prev) => ({
        ...prev,
        previewPoint: chartCoords,
      }));
    } else {
      setCurrentDraft((prev) => ({
        ...prev,
        p2: chartCoords,
      }));
    }
  };

  const handleMouseUp = () => {
    if (currentDraft && currentDraft.type === 'brush') {
      updateDrawingsWithHistory([...drawings, currentDraft]);
      setCurrentDraft(null);
      if (onToolSelect) onToolSelect('cursor');
    }
  };

  // Re-render trigger when chart pans or zooms
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!chartInstance) return;
    const timeScale = chartInstance.timeScale();
    const handleVisibleChange = () => setTick((t) => (t + 1) % 10000);
    try {
      timeScale.subscribeVisibleTimeRangeChange(handleVisibleChange);
      timeScale.subscribeVisibleLogicalRangeChange(handleVisibleChange);
    } catch (e) {
      // ignore
    }
    return () => {
      try {
        timeScale.unsubscribeVisibleTimeRangeChange(handleVisibleChange);
        timeScale.unsubscribeVisibleLogicalRangeChange(handleVisibleChange);
      } catch (e) {
        // ignore
      }
    };
  }, [chartInstance]);

  // ==========================================
  // RENDER DRAWING ITEMS
  // ==========================================
  const renderDrawing = (d, isDraft = false) => {
    const isSelected = selectedDrawingId === d.id;
    const baseStroke = d.color || '#F59E0B';
    const strokeWidth = isSelected ? 3 : 2;

    const handleShapeClick = (e) => {
      e.stopPropagation();
      if (!isDraft) {
        setSelectedDrawingId(d.id);
      }
    };

    switch (d.type) {
      case 'trendline': {
        const pt1 = toScreenCoords(d.p1);
        const pt2 = toScreenCoords(d.p2);
        return (
          <g key={d.id} onClick={handleShapeClick} className="pointer-events-auto cursor-pointer">
            <line x1={pt1.x} y1={pt1.y} x2={pt2.x} y2={pt2.y} stroke={baseStroke} strokeWidth={strokeWidth} strokeDasharray={isDraft ? '4 4' : undefined} />
            <circle cx={pt1.x} cy={pt1.y} r={4} fill={baseStroke} />
            <circle cx={pt2.x} cy={pt2.y} r={4} fill={baseStroke} />
          </g>
        );
      }
      case 'ray': {
        const pt1 = toScreenCoords(d.p1);
        const pt2 = toScreenCoords(d.p2);
        const dx = pt2.x - pt1.x;
        const dy = pt2.y - pt1.y;
        const factor = 50; // project far right
        const endX = pt1.x + dx * factor;
        const endY = pt1.y + dy * factor;
        return (
          <g key={d.id} onClick={handleShapeClick} className="pointer-events-auto cursor-pointer">
            <line x1={pt1.x} y1={pt1.y} x2={endX} y2={endY} stroke={baseStroke} strokeWidth={strokeWidth} />
            <circle cx={pt1.x} cy={pt1.y} r={4} fill={baseStroke} />
          </g>
        );
      }
      case 'horizontal': {
        const y = d.price && seriesInstance ? seriesInstance.priceToCoordinate(d.price) : d.y;
        return (
          <g key={d.id} onClick={handleShapeClick} className="pointer-events-auto cursor-pointer">
            <line x1={0} y1={y} x2={width || 1000} y2={y} stroke={baseStroke} strokeWidth={strokeWidth} strokeDasharray="3 3" />
            <rect x={(width || 1000) - 75} y={y - 10} width={70} height={20} fill="#1E293B" rx={4} stroke={baseStroke} strokeWidth={1} />
            <text x={(width || 1000) - 40} y={y + 4} fill="#F8FAFC" fontSize="10" fontFamily="monospace" textAnchor="middle">
              {d.price ? d.price.toFixed(4) : ''}
            </text>
          </g>
        );
      }
      case 'vertical': {
        const x = d.time && chartInstance ? chartInstance.timeScale().timeToCoordinate(d.time) : d.x;
        return (
          <g key={d.id} onClick={handleShapeClick} className="pointer-events-auto cursor-pointer">
            <line x1={x} y1={0} x2={x} y2={height || 600} stroke={baseStroke} strokeWidth={strokeWidth} strokeDasharray="3 3" />
          </g>
        );
      }
      case 'brush': {
        if (!d.points || d.points.length < 2) return null;
        const pathData = d.points.reduce((acc, p, idx) => {
          const pt = toScreenCoords(p);
          return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
        }, '');
        return (
          <g key={d.id} onClick={handleShapeClick} className="pointer-events-auto cursor-pointer">
            <path d={pathData} fill="none" stroke={baseStroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      }
      case 'rectangle': {
        const pt1 = toScreenCoords(d.p1);
        const pt2 = toScreenCoords(d.p2);
        const x = Math.min(pt1.x, pt2.x);
        const y = Math.min(pt1.y, pt2.y);
        const w = Math.abs(pt2.x - pt1.x);
        const h = Math.abs(pt2.y - pt1.y);
        return (
          <g key={d.id} onClick={handleShapeClick} className="pointer-events-auto cursor-pointer">
            <rect x={x} y={y} width={w} height={h} fill={baseStroke} fillOpacity={0.15} stroke={baseStroke} strokeWidth={strokeWidth} />
          </g>
        );
      }
      case 'fibonacci': {
        const pt1 = toScreenCoords(d.p1);
        const pt2 = toScreenCoords(d.p2);
        const levels = [
          { level: 0, label: '0.0% (0.0)', color: '#94A3B8' },
          { level: 0.236, label: '23.6% (0.236)', color: '#38BDF8' },
          { level: 0.382, label: '38.2% (0.382)', color: '#34D399' },
          { level: 0.5, label: '50.0% Equilibrium', color: '#FBBF24' },
          { level: 0.618, label: '61.8% Golden Pocket', color: '#F59E0B' },
          { level: 0.786, label: '78.6% Discount', color: '#FB7185' },
          { level: 1.0, label: '100.0% (1.0)', color: '#94A3B8' },
        ];
        const minX = Math.min(pt1.x, pt2.x);
        const maxX = Math.max(pt1.x, pt2.x, (width || 800) - 20);
        return (
          <g key={d.id} onClick={handleShapeClick} className="pointer-events-auto cursor-pointer">
            <line x1={pt1.x} y1={pt1.y} x2={pt2.x} y2={pt2.y} stroke="#64748B" strokeWidth={1} strokeDasharray="3 3" />
            {levels.map((fib) => {
              const fibY = pt1.y + (pt2.y - pt1.y) * fib.level;
              return (
                <g key={fib.level}>
                  <line x1={minX} y1={fibY} x2={maxX} y2={fibY} stroke={fib.color} strokeWidth={fib.level === 0.5 || fib.level === 0.618 ? 2 : 1} />
                  <text x={minX + 8} y={fibY - 3} fill={fib.color} fontSize="9" fontFamily="monospace" fontWeight="bold">
                    {fib.label}
                  </text>
                </g>
              );
            })}
          </g>
        );
      }
      case 'fib_extension': {
        const pt1 = toScreenCoords(d.p1);
        const pt2 = toScreenCoords(d.p2);
        const extLevels = [
          { level: 0, label: '0.0%', color: '#94A3B8' },
          { level: 0.618, label: '61.8% Target', color: '#38BDF8' },
          { level: 1.0, label: '100.0% Expansion', color: '#34D399' },
          { level: 1.618, label: '161.8% Golden Target', color: '#F59E0B' },
          { level: 2.618, label: '261.8% Macro Target', color: '#A855F7' },
        ];
        const minX = Math.min(pt1.x, pt2.x);
        const maxX = Math.max(pt1.x, pt2.x, (width || 800) - 20);
        return (
          <g key={d.id} onClick={handleShapeClick} className="pointer-events-auto cursor-pointer">
            <line x1={pt1.x} y1={pt1.y} x2={pt2.x} y2={pt2.y} stroke="#64748B" strokeWidth={1} strokeDasharray="3 3" />
            {extLevels.map((fib) => {
              const fibY = pt1.y + (pt2.y - pt1.y) * fib.level;
              return (
                <g key={fib.level}>
                  <line x1={minX} y1={fibY} x2={maxX} y2={fibY} stroke={fib.color} strokeWidth={1.5} />
                  <text x={minX + 8} y={fibY - 3} fill={fib.color} fontSize="9" fontFamily="monospace" fontWeight="bold">
                    {fib.label}
                  </text>
                </g>
              );
            })}
          </g>
        );
      }
      case 'xabcd': {
        const pts = (d.points || []).map((p) => toScreenCoords(p));
        if (d.previewPoint) pts.push(toScreenCoords(d.previewPoint));
        const labels = ['X', 'A', 'B', 'C', 'D'];
        return (
          <g key={d.id} onClick={handleShapeClick} className="pointer-events-auto cursor-pointer">
            {pts.map((p, idx) => {
              if (idx === 0) return null;
              return <line key={idx} x1={pts[idx - 1].x} y1={pts[idx - 1].y} x2={p.x} y2={p.y} stroke={baseStroke} strokeWidth={2} strokeDasharray="4 2" />;
            })}
            {pts.map((p, idx) => (
              <g key={idx}>
                <circle cx={p.x} cy={p.y} r={7} fill="#1E293B" stroke={baseStroke} strokeWidth={2} />
                <text x={p.x} y={p.y + 3.5} fill="#F8FAFC" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  {labels[idx] || `P${idx}`}
                </text>
              </g>
            ))}
          </g>
        );
      }
      case 'long_position':
      case 'short_position': {
        const isLong = d.type === 'long_position';
        const entryY = seriesInstance ? seriesInstance.priceToCoordinate(d.entryPrice) : 200;
        const stopY = seriesInstance ? seriesInstance.priceToCoordinate(d.stopPrice) : 250;
        const targetY = seriesInstance ? seriesInstance.priceToCoordinate(d.targetPrice) : 100;
        const x = d.startX || 200;
        const boxWidth = d.width || 140;

        const riskPips = Math.abs(d.entryPrice - d.stopPrice);
        const rewardPips = Math.abs(d.targetPrice - d.entryPrice);
        const rrRatio = riskPips > 0 ? (rewardPips / riskPips).toFixed(2) : '2.00';

        return (
          <g key={d.id} onClick={handleShapeClick} className="pointer-events-auto cursor-pointer">
            {/* Profit Box (Green) */}
            <rect
              x={x}
              y={Math.min(entryY, targetY)}
              width={boxWidth}
              height={Math.abs(targetY - entryY)}
              fill="#10B981"
              fillOpacity={0.25}
              stroke="#10B981"
              strokeWidth={1.5}
            />
            {/* Loss Box (Red) */}
            <rect
              x={x}
              y={Math.min(entryY, stopY)}
              width={boxWidth}
              height={Math.abs(stopY - entryY)}
              fill="#EF4444"
              fillOpacity={0.25}
              stroke="#EF4444"
              strokeWidth={1.5}
            />
            {/* Entry Line */}
            <line x1={x} y1={entryY} x2={x + boxWidth} y2={entryY} stroke="#94A3B8" strokeWidth={2} strokeDasharray="3 2" />
            {/* Tag / Stats Box */}
            <rect x={x + 5} y={entryY - 18} width={130} height={16} fill="#0F172A" rx={3} stroke="#F59E0B" strokeWidth={1} />
            <text x={x + 70} y={entryY - 6} fill="#F59E0B" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              {isLong ? 'LONG' : 'SHORT'} R:R 1:{rrRatio}
            </text>
            {/* Target & Stop Tags */}
            <text x={x + 8} y={targetY + (isLong ? 12 : -4)} fill="#10B981" fontSize="9" fontFamily="monospace" fontWeight="bold">
              TP: {d.targetPrice}
            </text>
            <text x={x + 8} y={stopY + (isLong ? -4 : 12)} fill="#EF4444" fontSize="9" fontFamily="monospace" fontWeight="bold">
              SL: {d.stopPrice}
            </text>
          </g>
        );
      }
      case 'measure': {
        const pt1 = toScreenCoords(d.p1);
        const pt2 = toScreenCoords(d.p2);
        const p1Price = d.p1.price || 0;
        const p2Price = d.p2.price || 0;
        const diff = p2Price - p1Price;
        const pct = p1Price ? ((diff / p1Price) * 100).toFixed(2) : '0.00';
        const midX = (pt1.x + pt2.x) / 2;
        const midY = (pt1.y + pt2.y) / 2;

        return (
          <g key={d.id} onClick={handleShapeClick} className="pointer-events-auto cursor-pointer">
            <line x1={pt1.x} y1={pt1.y} x2={pt2.x} y2={pt2.y} stroke="#38BDF8" strokeWidth={2} strokeDasharray="4 2" />
            <circle cx={pt1.x} cy={pt1.y} r={4} fill="#38BDF8" />
            <circle cx={pt2.x} cy={pt2.y} r={4} fill="#38BDF8" />
            <rect x={midX - 45} y={midY - 14} width={90} height={20} fill="#0F172A" rx={4} stroke="#38BDF8" strokeWidth={1} />
            <text x={midX} y={midY} fill="#38BDF8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              {diff >= 0 ? `+${pct}%` : `${pct}%`}
            </text>
          </g>
        );
      }
      default:
        return null;
    }
  };

  const isDrawingActive = activeTool !== 'cursor';

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {/* Floating Toolbar Controls (only shown when drawings exist or selected) */}
      {(history.length > 1 || selectedDrawingId || drawings.length > 0 || isDrawingActive) && (
        <div className="absolute top-2 left-2 z-30 flex items-center gap-1.5 bg-slate-950/90 p-1.5 rounded-xl border border-slate-800 shadow-2xl backdrop-blur-md pointer-events-auto">
          <button
            onClick={handleUndo}
            disabled={history.length <= 1}
            title="Undo (Ctrl+Z)"
            className="px-2 py-1 rounded-lg text-xs font-mono font-bold text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-all"
          >
            ↺ Undo
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            title="Redo (Ctrl+Y)"
            className="px-2 py-1 rounded-lg text-xs font-mono font-bold text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-all"
          >
            ↻ Redo
          </button>
          <div className="h-4 w-px bg-slate-800" />
          {selectedDrawingId && (
            <button
              onClick={handleDeleteSelected}
              title="Delete Selected Drawing"
              className="px-2 py-1 rounded-lg text-xs font-mono font-bold text-rose-400 hover:bg-rose-950/50 border border-rose-900/40 transition-all"
            >
              🗑 Delete Selected
            </button>
          )}
          {drawings.length > 0 && (
            <button
              onClick={handleDeleteAll}
              title="Clear All Drawings"
              className="px-2 py-1 rounded-lg text-xs font-mono text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-all"
            >
              Clear All
            </button>
          )}
          <div className="h-4 w-px bg-slate-800" />
          {/* Color Picker */}
          <div className="flex items-center gap-1">
            {['#F59E0B', '#10B981', '#38BDF8', '#EC4899', '#FFFFFF'].map((c) => (
              <button
                key={c}
                onClick={() => setDrawColor(c)}
                className={`w-4 h-4 rounded-full transition-transform ${drawColor === c ? 'scale-125 ring-2 ring-white' : 'opacity-70'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      )}

      {/* SVG Canvas - pointer-events-none when in cursor mode, pointer-events-auto only when actively drawing */}
      <svg
        ref={svgRef}
        className={`w-full h-full ${isDrawingActive ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Render Saved Drawings */}
        {drawings.map((d) => renderDrawing(d, false))}
        {/* Render Active Draft */}
        {currentDraft && renderDrawing(currentDraft, true)}
      </svg>
    </div>
  );
};
