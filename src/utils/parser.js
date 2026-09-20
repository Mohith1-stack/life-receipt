/**
 * Parses a simple CSV string into an array of objects.
 * Assumes the first row contains headers.
 * 
 * @param {string} csvText - The raw CSV string.
 * @returns {Array<Object>} An array of receipt objects ready for the timeline.
 */
export const parseCSV = (csvText) => {
  const lines = csvText.split(/\\r?\\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map((line, idx) => {
    // Basic CSV parse (doesn't handle quotes containing commas)
    const values = line.split(',').map(v => v.trim());
    const content = {};
    headers.forEach((h, i) => content[h] = values[i]);
    
    return {
      id: "csv-" + Date.now() + "-" + idx,
      type: content.type || "record",
      timestamp: content.timestamp || content.date || new Date().toISOString(),
      content: content,
      tags: ["csv", "imported"]
    };
  });
};
