import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Camera,
  Upload,
  AlertTriangle,
  Sparkles,
  Shield,
  MapPin,
  Check,
  X,
  Eye,
  Sliders,
  Info
} from 'lucide-react';
import { CAMPUS_BUILDINGS, CATEGORIES, PRIORITIES } from '../data/campusLocations';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import { DuplicateAlert } from '../components/complaints/DuplicateAlert';
import { AIAssistantModal } from '../components/complaints/AIAssistantModal';

export function ReportProblemPage({ initialBuilding = '', initialRoom = '', onReportSuccess, onSelectComplaint }) {
  const { addComplaint, findDuplicates } = useComplaints();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electrical');
  const [building, setBuilding] = useState(initialBuilding || CAMPUS_BUILDINGS[0].name);
  const [floor, setFloor] = useState('2');
  const [room, setRoom] = useState(initialRoom || CAMPUS_BUILDINGS[0].rooms[2]);
  const [priority, setPriority] = useState('Medium');
  const [affectedCount, setAffectedCount] = useState('40');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Advanced features state
  const [duplicates, setDuplicates] = useState([]);
  const [isDuplicateAlertDismissed, setIsDuplicateAlertDismissed] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [suggestedPriorityInfo, setSuggestedPriorityInfo] = useState(null);

  // Available rooms for selected building
  const currentBuildingObj = CAMPUS_BUILDINGS.find(b => b.name === building) || CAMPUS_BUILDINGS[0];

  // Update room list when building changes
  const handleBuildingChange = (bName) => {
    setBuilding(bName);
    const bObj = CAMPUS_BUILDINGS.find(b => b.name === bName);
    if (bObj && bObj.rooms.length > 0) {
      setRoom(bObj.rooms[0]);
    }
  };

  // SMART DUPLICATE DETECTION:
  // Runs whenever building, room, category, or title changes
  useEffect(() => {
    if (!isDuplicateAlertDismissed && building && room) {
      const found = findDuplicates(building, room, category, title);
      setDuplicates(found);
    } else {
      setDuplicates([]);
    }
  }, [building, room, category, title, isDuplicateAlertDismissed, findDuplicates]);

  // SMART PRIORITY SYSTEM (Feature 2):
  // Evaluates safety, category, and affected people to suggest priority
  useEffect(() => {
    const text = `${title} ${description}`.toLowerCase();
    const count = parseInt(affectedCount || '1', 10);
    const urgentKeywords = ['spark', 'smoke', 'fire', 'shock', 'flood', 'burst', 'gas', 'hazard', 'blood', 'injury'];

    let recommended = 'Medium';
    let reason = 'Standard maintenance ticket';

    if (urgentKeywords.some(w => text.includes(w)) || (category === 'Electrical' && text.includes('spark'))) {
      recommended = 'Urgent';
      reason = 'Safety Hazard Alert: Acute danger to occupants detected. Target SLA: 12 hrs.';
    } else if (count > 50 || category === 'Internet' || category === 'Plumbing') {
      recommended = 'High';
      reason = `High Campus Impact: Affects ~${count} students or vital infrastructure. Target SLA: 24 hrs.`;
    } else if (text.includes('squeak') || text.includes('paint') || count < 5) {
      recommended = 'Low';
      reason = 'Low impact / cosmetic maintenance. Target SLA: 72 hrs.';
    }

    setSuggestedPriorityInfo({ recommended, reason });
  }, [title, description, category, affectedCount]);

  // Image upload handler (DataURL preview)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyAISuggestions = (suggestions) => {
    if (suggestions.title) setTitle(suggestions.title);
    if (suggestions.description) setDescription(suggestions.description);
    if (suggestions.category) setCategory(suggestions.category);
    if (suggestions.priority) setPriority(suggestions.priority);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !room.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);

    const newTicket = addComplaint({
      title,
      description,
      category,
      building,
      buildingCode: currentBuildingObj.code,
      floor: parseInt(floor, 10),
      room,
      priority,
      affectedCount: parseInt(affectedCount, 10),
      isAnonymous,
      reporterId: isAnonymous ? 'user_anonymous' : (user?.id || 'user_alex_chen'),
      reporterName: isAnonymous ? 'Anonymous Reporter' : (user?.name || 'Alex Chen'),
      reporterEmail: isAnonymous ? 'anonymous@fixmycampus.local' : (user?.email || 'alex.chen@campus.edu'),
      reporterRole: user?.role || 'student',
      imageUrl: imagePreview || 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
      slaHours: priority === 'Urgent' ? 12 : priority === 'High' ? 24 : priority === 'Medium' ? 48 : 72
    });

    setSubmitting(false);
    if (onReportSuccess) {
      onReportSuccess(newTicket.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Page Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-bold">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Campus Maintenance Request</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Report an Infrastructure Problem
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Help our facilities crew maintain a safe, functional campus. Submit detailed information with photo evidence for expedited dispatch.
        </p>
      </div>

      {/* SMART DUPLICATE DETECTION BANNER (Feature 1) */}
      {duplicates.length > 0 && !isDuplicateAlertDismissed && (
        <DuplicateAlert
          duplicates={duplicates}
          onSelectExisting={onSelectComplaint}
          onDismiss={() => setIsDuplicateAlertDismissed(true)}
        />
      )}

      {/* Main Reporting Form Card */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-xs">
        {/* Section 1: Core Problem */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              1. Issue Overview & Description
            </h3>

            {/* Smart AI Assistant Trigger Button (Feature 9) */}
            <button
              type="button"
              onClick={() => setIsAIModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>✨ AI Report Assistant</span>
            </button>
          </div>

          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Problem Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Broken fan speed regulator sparking in Classroom 203"
              className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-800 dark:text-slate-200">
                Detailed Description *
              </label>
              <span className="text-[11px] text-slate-400">
                {description.length} characters (Be specific about symptoms & hazards)
              </span>
            </div>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe exactly what broke, visible hazards (smoke/leaks), specific equipment labels, or time the problem started..."
              className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
              Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CATEGORIES.map(cat => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-xl border text-left font-semibold text-xs transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 ring-2 ring-brand-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Precise Location */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-500" />
            2. Campus Location Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Building Name *
              </label>
              <select
                value={building}
                onChange={(e) => handleBuildingChange(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              >
                {CAMPUS_BUILDINGS.map(b => (
                  <option key={b.id} value={b.name}>{b.name} ({b.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Floor Number *
              </label>
              <select
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              >
                {currentBuildingObj.floors.map(f => (
                  <option key={f} value={f}>Floor {f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Room / Facility Identifier *
              </label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              >
                {currentBuildingObj.rooms.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Smart Priority & Affected People */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-500" />
              3. Smart Priority & Impact Assessment
            </h3>
            {suggestedPriorityInfo && (
              <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-1 rounded-full">
                AI Suggested: {suggestedPriorityInfo.recommended}
              </span>
            )}
          </div>

          {suggestedPriorityInfo && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-white">Smart Priority Engine: </strong>
              {suggestedPriorityInfo.reason}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Priority Selection (You can override suggested)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRIORITIES.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    className={`py-2.5 rounded-xl font-bold text-xs transition-all text-center ${
                      priority === p.id
                        ? `${p.color} ring-2 ring-offset-1 ring-brand-500 shadow-sm`
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Estimated Students / Occupants Affected: <strong className="text-brand-600">{affectedCount}</strong>
              </label>
              <input
                type="range"
                min="1"
                max="250"
                step="5"
                value={affectedCount}
                onChange={(e) => setAffectedCount(e.target.value)}
                className="w-full accent-brand-600 cursor-pointer mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 Student (Personal)</span>
                <span>50 (Classroom)</span>
                <span>250+ (Entire Block)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Photograph Upload */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Camera className="w-4 h-4 text-brand-500" />
            4. Photograph Evidence
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="w-full sm:w-64 h-36 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 bg-slate-50 dark:bg-slate-800/40 hover:bg-brand-50/20 cursor-pointer flex flex-col items-center justify-center p-4 text-center transition-all group">
              <Upload className="w-6 h-6 text-slate-400 group-hover:text-brand-600 transition-colors mb-2" />
              <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                Upload or Take Photo
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                JPEG, PNG up to 5MB
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {imagePreview ? (
              <div className="relative w-full sm:w-48 h-36 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs">
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview('')}
                  className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="text-slate-500 text-xs sm:max-w-xs leading-relaxed">
                Clear photos help technicians bring the exact replacement parts (e.g. correct wattage bulb, pipe diameter, or switch model) on the first visit.
              </div>
            )}
          </div>
        </div>

        {/* Section 5: Anonymous Reporting Toggle */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
          <div className="space-y-0.5">
            <label htmlFor="anonymous-checkbox" className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-slate-500" />
              Anonymous Reporting Option
            </label>
            <p className="text-[11px] text-slate-500">
              Your name and student email will not be displayed on public feeds or shared with staff.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              id="anonymous-checkbox"
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-brand-600"></div>
          </label>
        </div>

        {/* Form Submission Actions */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black text-sm shadow-xl shadow-brand-500/25 hover:shadow-2xl transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            <span>SUBMIT COMPLAINT & GENERATE TICKET ID</span>
          </button>
        </div>
      </form>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        formData={{ title, description, building, room, category, priority }}
        onApplySuggestions={handleApplyAISuggestions}
      />
    </div>
  );
}
