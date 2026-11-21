import React, { useState } from 'react';
import { CAMPUS_BUILDINGS } from '../../data/campusLocations';
import { QrCode, Printer, ExternalLink, Sparkles, Check, Download, Camera } from 'lucide-react';

export function QRCodeGenerator({ onScanNavigate }) {
  const [selectedBuildingId, setSelectedBuildingId] = useState(CAMPUS_BUILDINGS[0].id);
  const building = CAMPUS_BUILDINGS.find(b => b.id === selectedBuildingId) || CAMPUS_BUILDINGS[0];
  const [selectedRoom, setSelectedRoom] = useState(building.rooms[0]);

  // When building changes, update default room
  const handleBuildingChange = (bId) => {
    setSelectedBuildingId(bId);
    const target = CAMPUS_BUILDINGS.find(b => b.id === bId);
    if (target && target.rooms.length > 0) {
      setSelectedRoom(target.rooms[0]);
    }
  };

  const reportUrl = `${window.location.origin}${window.location.pathname}#report?building=${encodeURIComponent(building.name)}&room=${encodeURIComponent(selectedRoom)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-brand-600 via-indigo-600 to-violet-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <QrCode className="w-3.5 h-3.5" />
            <span>Instant Zero-Typing Location Reporting</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Classroom & Lab QR Dispatch System
          </h2>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            Every classroom, laboratory, and washroom can have a physical FixMyCampus QR placard. Students scan it with their camera to instantly load the report form with the building and room pre-populated.
          </p>
        </div>

        <button
          onClick={() => onScanNavigate(building.name, selectedRoom)}
          className="px-6 py-3 rounded-2xl bg-white text-brand-700 hover:bg-brand-50 font-extrabold text-xs shadow-lg hover:shadow-xl transition-all shrink-0 flex items-center gap-2 group"
        >
          <Camera className="w-4 h-4 text-brand-600 group-hover:scale-110 transition-transform" />
          <span>Simulate Scan on Device</span>
        </button>
      </div>

      {/* Selector & Placard Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5 text-xs">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
              Select Campus Location
            </h3>
            <p className="text-slate-500">
              Generate an official printable maintenance placard
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Target Building
            </label>
            <select
              value={selectedBuildingId}
              onChange={(e) => handleBuildingChange(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            >
              {CAMPUS_BUILDINGS.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Specific Room / Lab / Washroom
            </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            >
              {building.rooms.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">
              Embedded Dispatch Payload:
            </span>
            <div className="p-2 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg break-all">
              /report?building={encodeURIComponent(building.name)}&room={encodeURIComponent(selectedRoom)}
            </div>
            <p className="text-[11px] text-slate-400">
              No login required to scan; automatically skips manual selection on the reporting form.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Placard Sticker</span>
            </button>
            <button
              onClick={() => onScanNavigate(building.name, selectedRoom)}
              className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-500/20 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Test Report URL</span>
            </button>
          </div>
        </div>

        {/* Printable Placard Preview (7 Cols) */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="bg-white text-slate-900 p-8 sm:p-10 rounded-3xl border-4 border-slate-900 shadow-2xl max-w-sm w-full text-center space-y-6 print:border-none print:shadow-none">
            {/* Top Badge */}
            <div className="flex items-center justify-center gap-2 text-brand-600 font-extrabold text-sm tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-brand-600"></span>
              FixMyCampus Official Dispatch
            </div>

            {/* Title & Room */}
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                {selectedRoom}
              </h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {building.name}
              </p>
            </div>

            {/* Generated QR Code Representation */}
            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 inline-block mx-auto relative group">
              <svg
                viewBox="0 0 100 100"
                className="w-48 h-48 sm:w-56 sm:h-56 mx-auto"
                shapeRendering="crispEdges"
              >
                {/* SVG QR Code Pattern */}
                <rect width="100" height="100" fill="#ffffff" />
                {/* Corner markers */}
                <rect x="5" y="5" width="26" height="26" fill="#0f172a" rx="4" />
                <rect x="9" y="9" width="18" height="18" fill="#ffffff" rx="2" />
                <rect x="13" y="13" width="10" height="10" fill="#3b5df5" rx="2" />

                <rect x="69" y="5" width="26" height="26" fill="#0f172a" rx="4" />
                <rect x="73" y="9" width="18" height="18" fill="#ffffff" rx="2" />
                <rect x="77" y="13" width="10" height="10" fill="#3b5df5" rx="2" />

                <rect x="5" y="69" width="26" height="26" fill="#0f172a" rx="4" />
                <rect x="9" y="73" width="18" height="18" fill="#ffffff" rx="2" />
                <rect x="13" y="77" width="10" height="10" fill="#3b5df5" rx="2" />

                {/* Data modules */}
                <rect x="36" y="8" width="6" height="6" fill="#0f172a" />
                <rect x="46" y="8" width="6" height="6" fill="#0f172a" />
                <rect x="56" y="8" width="6" height="6" fill="#0f172a" />
                <rect x="36" y="18" width="6" height="6" fill="#0f172a" />
                <rect x="46" y="24" width="8" height="8" fill="#0f172a" />
                <rect x="58" y="20" width="6" height="6" fill="#0f172a" />

                <rect x="8" y="36" width="6" height="6" fill="#0f172a" />
                <rect x="18" y="42" width="8" height="8" fill="#0f172a" />
                <rect x="28" y="36" width="6" height="6" fill="#0f172a" />
                <rect x="38" y="38" width="8" height="8" fill="#3b5df5" />
                <rect x="50" y="36" width="6" height="6" fill="#0f172a" />
                <rect x="60" y="42" width="8" height="8" fill="#0f172a" />
                <rect x="72" y="38" width="6" height="6" fill="#0f172a" />
                <rect x="84" y="36" width="8" height="8" fill="#0f172a" />

                <rect x="36" y="52" width="8" height="8" fill="#0f172a" />
                <rect x="48" y="50" width="8" height="8" fill="#3b5df5" />
                <rect x="62" y="54" width="6" height="6" fill="#0f172a" />
                <rect x="74" y="50" width="8" height="8" fill="#0f172a" />
                <rect x="86" y="54" width="6" height="6" fill="#0f172a" />

                <rect x="36" y="68" width="6" height="6" fill="#0f172a" />
                <rect x="46" y="72" width="8" height="8" fill="#0f172a" />
                <rect x="58" y="68" width="6" height="6" fill="#0f172a" />
                <rect x="72" y="74" width="8" height="8" fill="#0f172a" />
                <rect x="84" y="70" width="6" height="6" fill="#0f172a" />

                <rect x="38" y="84" width="8" height="8" fill="#0f172a" />
                <rect x="52" y="84" width="6" height="6" fill="#0f172a" />
                <rect x="64" y="86" width="8" height="8" fill="#0f172a" />
                <rect x="78" y="84" width="6" height="6" fill="#0f172a" />
              </svg>

              {/* Click to simulate */}
              <div
                onClick={() => onScanNavigate(building.name, selectedRoom)}
                className="absolute inset-0 bg-slate-950/70 rounded-xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity p-4 text-xs font-bold"
              >
                <Camera className="w-8 h-8 mb-2 text-brand-400" />
                <span>Click to Simulate QR Scan</span>
              </div>
            </div>

            {/* Placard Instruction */}
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-900 tracking-wide uppercase">
                Notice an issue? Scan with your phone camera
              </p>
              <p className="text-[11px] text-slate-500">
                Broken fan, water leakage, Wi-Fi outage or broken desk? Report instantly in 15 seconds.
              </p>
            </div>

            {/* Placard Footer */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>CAMPUS DISPATCH CODE: {building.code}-{selectedRoom.replace(/\D/g, '') || '01'}</span>
              <span>SLA GUARANTEED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
