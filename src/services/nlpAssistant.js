// AI & Rule-based NLP Report Assistant for FixMyCampus

export function analyzeComplaintDraft({ title = '', description = '', building = '', room = '', category = '' }) {
  const combinedText = `${title} ${description}`.toLowerCase();
  
  // 1. Category Detection
  const categoryScores = {
    Electrical: 0,
    Plumbing: 0,
    Cleanliness: 0,
    Furniture: 0,
    Internet: 0,
    Laboratory: 0,
    Infrastructure: 0,
  };

  const keywords = {
    Electrical: ['fan', 'light', 'spark', 'switch', 'socket', 'plug', 'wire', 'shock', 'power', 'fuse', 'regulator', 'ac', 'voltage', 'circuit', 'bulb', 'tube', 'short', 'generator'],
    Plumbing: ['pipe', 'leak', 'water', 'tap', 'drain', 'overflow', 'flush', 'toilet', 'sink', 'basin', 'cooler', 'filter', 'sewage', 'drip', 'clog', 'faucet'],
    Cleanliness: ['smell', 'odor', 'dirty', 'trash', 'garbage', 'dustbin', 'stink', 'hygiene', 'cockroach', 'pest', 'unclean', 'stain', 'mess', 'spill', 'washroom'],
    Furniture: ['bench', 'desk', 'chair', 'table', 'blackboard', 'whiteboard', 'podium', 'cushion', 'drawer', 'shelf', 'hinge', 'broken leg', 'screw'],
    Internet: ['wifi', 'wi-fi', 'router', 'internet', 'lan', 'ethernet', 'connection', 'network', 'ip', 'bandwidth', 'disconnect', 'offline', 'ping', 'signal'],
    Laboratory: ['oscilloscope', 'microscope', 'multimeter', 'chemical', 'pipette', 'centrifuge', 'sensor', 'arduino', 'apparatus', 'spectrometer', 'laser', 'burner', 'reagent'],
    Infrastructure: ['ceiling', 'wall', 'crack', 'door', 'window', 'glass', 'lock', 'latch', 'staircase', 'floor tile', 'roof', 'pothole', 'railing', 'plaster']
  };

  for (const [cat, wordList] of Object.entries(keywords)) {
    for (const w of wordList) {
      if (combinedText.includes(w)) {
        categoryScores[cat] += 2;
      }
    }
  }

  let suggestedCategory = category;
  let highestScore = 0;
  for (const [cat, score] of Object.entries(categoryScores)) {
    if (score > highestScore) {
      highestScore = score;
      suggestedCategory = cat;
    }
  }

  // 2. Priority Recommendation & Reasoning
  const urgentHazardWords = ['spark', 'smoke', 'fire', 'shock', 'flood', 'burst', 'flame', 'gas', 'collapse', 'jammed exit', 'exposed wire', 'burning smell'];
  const highImpactWords = ['exam', 'all students', 'lecture hall', 'offline', 'overflow', 'contamination', 'cannot enter', 'dark'];

  let suggestedPriority = 'Medium';
  let priorityReason = 'Standard campus maintenance priority.';

  const hasUrgentHazard = urgentHazardWords.some(w => combinedText.includes(w));
  const hasHighImpact = highImpactWords.some(w => combinedText.includes(w));

  if (hasUrgentHazard || suggestedCategory === 'Electrical' && combinedText.includes('spark')) {
    suggestedPriority = 'Urgent';
    priorityReason = 'Automated Safety Alert: Detected electrical or acute physical hazard with potential safety implications. Immediate triage recommended (SLA: 12 hrs).';
  } else if (hasHighImpact || suggestedCategory === 'Internet' || suggestedCategory === 'Plumbing') {
    suggestedPriority = 'High';
    priorityReason = 'High Campus Impact: Issue affects core academic workflow, utilities, or large group of students (SLA: 24 hrs).';
  } else if (combinedText.includes('paint') || combinedText.includes('squeak') || combinedText.includes('dim')) {
    suggestedPriority = 'Low';
    priorityReason = 'Cosmetic / Low urgency non-critical item (SLA: 72 hrs).';
  }

  // 3. Missing Location & Context Checks
  const missingChecks = [];
  if (!room || room.trim().length === 0) {
    missingChecks.push('Missing exact room or landmark identifier (e.g., "Room 203" or "Near East Water Cooler").');
  }
  if (!building || building.trim().length === 0) {
    missingChecks.push('Missing campus building selection.');
  }
  if (description.trim().length < 30) {
    missingChecks.push('Description is very short. Providing specific details helps technicians bring the right tools on the first trip.');
  }

  // 4. Enhanced / Polished Description Generator (Rule-based Expert Heuristics)
  let enhancedDescription = description;
  let enhancedTitle = title;

  if (description.trim().length > 0) {
    const cleanDesc = description.trim().replace(/\.+$/, '');
    const locationPrefix = (building && room) ? `Located at ${building}, ${room}: ` : '';
    
    // Technical phrasing templates
    if (suggestedCategory === 'Electrical') {
      enhancedDescription = `${locationPrefix}${cleanDesc}. Please have the electrical maintenance technician bring an insulated multimeter, replacement fuses/switches, and test line voltage on the distribution board before re-energizing.`;
      if (!title || title.length < 10) enhancedTitle = `Electrical defect in ${room || 'facility'} — ${cleanDesc.slice(0, 40)}`;
    } else if (suggestedCategory === 'Plumbing') {
      enhancedDescription = `${locationPrefix}${cleanDesc}. High risk of water damage and pooling hazard. Requires pipe inspection, shut-off valve check, and replacement fittings.`;
      if (!title || title.length < 10) enhancedTitle = `Plumbing leak & water issue in ${room || 'facility'}`;
    } else if (suggestedCategory === 'Internet') {
      enhancedDescription = `${locationPrefix}${cleanDesc}. Network drop affecting workstations and Wi-Fi coverage. NOC team requested to verify patch panel uplink, PoE switch port status, and DHCP pool lease.`;
      if (!title || title.length < 10) enhancedTitle = `Wi-Fi / Network disruption in ${room || 'facility'}`;
    } else if (suggestedCategory === 'Laboratory') {
      enhancedDescription = `${locationPrefix}${cleanDesc}. Scientific instrument defect impacting academic sessions. Requires calibration and bench technician inspection.`;
      if (!title || title.length < 10) enhancedTitle = `Lab equipment malfunction: ${room || 'Lab'} — ${cleanDesc.slice(0, 35)}`;
    } else {
      enhancedDescription = `${locationPrefix}${cleanDesc}. Maintenance inspection requested at earliest convenience to prevent disruption.`;
    }
  }

  return {
    engine: 'Rule-based Campus NLP (Gemini API Ready)',
    isRealAi: false,
    suggestedCategory: suggestedCategory || 'Other',
    suggestedPriority,
    priorityReason,
    missingChecks,
    enhancedDescription,
    enhancedTitle,
    wordCount: description.split(/\s+/).filter(Boolean).length
  };
}
