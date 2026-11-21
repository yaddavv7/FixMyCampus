import React, { useState } from 'react';
import { CAMPUS_BUILDINGS } from '../../data/campusLocations';
import { useComplaints } from '../../context/ComplaintContext';
import { MapPin, AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert, PlusCircle, Building } from 'lucide-react';

export function CampusHeatmap({ onSelectComplaint, onReportInBuilding }) {
  const { complaints } = useComplaints();
  const [selectedBuilding, setSelectedBuilding] = useState(CAMPUS_BUILDINGS[0]);
  const [filterPriority, setFilterPriority] = useState('ALL');

  // Compute building metrics
  const buildingStats = CAMPUS_BUILDINGS.map(b => {
    const bComplaints = complaints.filter(c => c.building === b.name);
    const active = bComplaints.filter(c => c.status !== 'Resolved');
    const urgent = active.filter(c => c.priority === 'Urgent');
    const high = active.filter(c => c.priority === 'High');
    const medium = active.filter(c => c.priority === 'Medium');
    const low = active.filter(c => c.priority === 'Low');
    const resolved = bComplaints.filter(c => c.status === 'Resolved');

    // Severity color
    let statusLevel = 'clean';
    let markerColor = 'bg-emerald-500 border-emerald-300 text-white';
    let ringColor = 'ring-emerald-400/40';

    if (urgent.length > 0) {
      statusLevel = 'urgent';
      markerColor = 'bg-rose-600 border-rose-300 text-white animate-pulse';
      ringColor = 'ring-rose-500/50';
    } else if (high.length > 0) {
      statusLevel = 'high';
      markerColor = 'bg-orange-500 border-orange-300 text-white';
      ringColor = 'ring-orange-400/40';
    } else if (medium.length > 0) {
      statusLevel = 'medium';
      markerColor = 'bg-amber-500 border-amber-300 text-white';
      ringColor = 'ring-amber-400/40';
    } else if (low.length > 0) {
      statusLevel = 'low';
      markerColor = 'bg-blue-500 border-blue-300 text-white';
      ringColor = 'ring-blue-400/40';
    }

    return {
      ...b,
      totalCount: bComplaints.length,
      activeCount: active.length,
      urgentCount: urgent.length,
      highCount: high.length,
      mediumCount: medium.length,
      lowCount: low.length,
      resolvedCount: resolved.length,
      statusLevel,
      markerColor,
      ringColor,
      complaints: bComplaints,
      activeComplaints: active
    };
  });

  const selectedBuildingData = buildingStats.find(b => b.id === selectedBuilding.id) || buildingStats[0];

  const filteredSelectedComplaints = selectedBuildingData.complaints.filter(c => {
    if (filterPriority === 'ALL') return true;
    if (filterPriority === 'RESOLVED') return c.status === 'Resolved';
    return c.priority === filterPriority && c.status !== 'Resolved';
  });

  return (
    <div className="space-y-6">
      {/* Legend & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-bold text-slate-700 dark:text-slate-300">Severity Heatmap Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping"></span>
            <span className="font-semibold text-rose-600">Urgent Issues</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="font-semibold text-orange-600">High Priority</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="font-semibold text-amber-600">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-emerald-600">All Resolved / Nominal</span>
          </div>
        </div>

        <div className="text-slate-500">
          Showing <strong>8 Campus Facilities</strong> • Click pin or card to inspect
        </div>
      </div>

      {/* Main Map + Side Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Campus Map Canvas (8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-800 relative overflow-hidden min-h-[460px] flex flex-col justify-between">
          {/* Stylized Campus Layout Graphics */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            {/* Grid Lines */}
            <div className="w-full h-full bg-[radial-gradient(#3b5df5_1px,transparent_1px)] [background-size:24px_24px]"></div>
          </div>

          {/* Central Lawn & Pathway SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" preserveAspectRatio="none">
            <path d="M 200,100 L 500,250 L 700,400" stroke="#475569" strokeWidth="4" strokeDasharray="6 6" fill="none" />
            <path d="M 150,300 L 400,280 L 650,220" stroke="#475569" strokeWidth="4" strokeDasharray="6 6" fill="none" />
            <circle cx="50%" cy="50%" r="90" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          </svg>

          {/* Map Title Overlay */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="font-extrabold text-white tracking-wide">CAMPUS GEO-SPATIAL RADAR</span>
              <span className="text-[10px] text-slate-400 block">Real-time Facilities Health Map</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-full border border-emerald-800">
                LIVE TELEMETRY
              </span>
            </div>
          </div>

          {/* Building Pin Nodes on the Map */}
          <div className="relative w-full h-[380px] my-4">
            {buildingStats.map(b => {
              const isSelected = selectedBuilding.id === b.id;
              return (
                <div
                  key={b.id}
                  style={{ left: `${b.coordinates.x}%`, top: `${b.coordinates.y}%` }}
                  onClick={() => setSelectedBuilding(b)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  {/* Pin Circle */}
                  <div className={`relative flex items-center justify-center transition-transform duration-300 ${isSelected ? 'scale-125 z-30' : 'group-hover:scale-110'}`}>
                    {/* Ring aura */}
                    <div className={`absolute w-11 h-11 rounded-full ${b.ringColor} animate-ping opacity-30`}></div>
                    <div className={`w-8 h-8 rounded-2xl shadow-lg border-2 flex items-center justify-center font-bold text-xs ${b.markerColor} ${isSelected ? 'ring-4 ring-white shadow-2xl' : ''}`}>
                      {b.activeCount > 0 ? b.activeCount : <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Label Tooltip */}
                  <div className={`absolute top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap shadow-xl transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white opacity-100 scale-100'
                      : 'bg-slate-950/90 text-slate-300 opacity-80 group-hover:opacity-100 border border-slate-800'
                  }`}>
                    {b.code} ({b.activeCount})
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Bottom Stats Bar */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            <div>Total Buildings: <strong className="text-white">8</strong></div>
            <div>Critical Hotspots: <strong className="text-rose-400">{buildingStats.filter(b => b.urgentCount > 0).length}</strong></div>
            <div>Nominal Facilities: <strong className="text-emerald-400">{buildingStats.filter(b => b.activeCount === 0).length}</strong></div>
            <div>Active Tickets: <strong className="text-white">{complaints.filter(c => c.status !== 'Resolved').length}</strong></div>
          </div>
        </div>

        {/* Selected Building Details Sidebar (4-5 Cols) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-xl border border-slate-200 dark:border-slate-800 space-y-5">
          {/* Header of selected facility */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-0.5 rounded-full">
                {selectedBuildingData.code}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                selectedBuildingData.statusLevel === 'urgent' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                selectedBuildingData.statusLevel === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' :
                selectedBuildingData.statusLevel === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                {selectedBuildingData.activeCount} Active Issues
              </span>
            </div>

            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {selectedBuildingData.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedBuildingData.floors.length} Floors • {selectedBuildingData.rooms.length} Monitored Rooms
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Urgent</span>
              <span className="font-bold text-rose-600 text-sm">{selectedBuildingData.urgentCount}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">High/Med</span>
              <span className="font-bold text-orange-600 text-sm">
                {selectedBuildingData.highCount + selectedBuildingData.mediumCount}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Resolved</span>
              <span className="font-bold text-emerald-600 text-sm">{selectedBuildingData.resolvedCount}</span>
            </div>
          </div>

          {/* Action button: Quick Report in this building */}
          <button
            onClick={() => onReportInBuilding && onReportInBuilding(selectedBuildingData.name)}
            className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report New Issue in {selectedBuildingData.code}</span>
          </button>

          {/* Building Complaints List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                Complaints in this Facility ({selectedBuildingData.complaints.length})
              </h4>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {filteredSelectedComplaints.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No complaints match current filter in this facility.
                </div>
              ) : (
                filteredSelectedComplaints.map(c => (
                  <div
                    key={c.id}
                    onClick={() => onSelectComplaint && onSelectComplaint(c.id)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer transition-all text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono font-bold text-slate-500 text-[11px]">{c.id}</span>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                        c.priority === 'Urgent' ? 'bg-rose-500 text-white' :
                        c.priority === 'High' ? 'bg-orange-500 text-white' : 'bg-slate-200 dark:bg-slate-700'
                      }`}>
                        {c.priority}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {c.title}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                      <span>{c.room}</span>
                      <span className="text-brand-600 font-semibold">{c.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
