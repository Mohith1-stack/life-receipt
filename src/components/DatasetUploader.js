import React, { useState, useCallback } from 'react';
import { html } from '../utils/html.js';
import { parseCSV } from '../utils/parser.js';

/**
 * Component to handle drag-and-drop ingestion of JSON, CSV, and generic files.
 * @param {Object} props
 * @param {Function} props.onDataLoaded - Callback when data is successfully parsed.
 */
export default function DatasetUploader({ onDataLoaded }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFiles = (fileList) => {
    const files = Array.from(fileList);
    let allData = [];
    let processedCount = 0;
    let errors = [];

    if (files.length === 0) return;

    files.forEach(file => {
      const lowerName = file.name.toLowerCase();
      
      // Handle generic files by capturing metadata
      if (!lowerName.endsWith('.csv') && !lowerName.endsWith('.json')) {
        const fileReceipt = {
          id: "file-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
          type: "file",
          timestamp: new Date(file.lastModified).toISOString(),
          content: {
            filename: file.name,
            size: (file.size / 1024).toFixed(2) + ' KB',
            mimeType: file.type || "unknown"
          },
          tags: ["file", lowerName.split('.').pop()]
        };
        allData.push(fileReceipt);
        processedCount++;
        if (processedCount === files.length) {
          if (errors.length > 0) setError(errors.join(' | '));
          if (allData.length > 0) onDataLoaded(allData);
          else if (errors.length === 0) setError('No data found.');
        }
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          let parsed = [];
          if (lowerName.endsWith('.csv')) {
            parsed = parseCSV(text);
          } else {
            parsed = JSON.parse(text);
            if (!Array.isArray(parsed)) parsed = [parsed];
          }
          allData = allData.concat(parsed);
        } catch (err) {
          errors.push(`Failed to parse ${file.name}`);
        } finally {
          processedCount++;
          if (processedCount === files.length) {
            if (errors.length > 0) setError(errors.join(' | '));
            if (allData.length > 0) onDataLoaded(allData);
            else if (errors.length === 0) setError('No data found.');
          }
        }
      };
      reader.readAsText(file);
    });
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [onDataLoaded]);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  return html`
    <section 
      className="upload-container" 
      aria-label="Upload Dataset Section"
      onDragEnter=${handleDrag} 
      onDragLeave=${handleDrag} 
      onDragOver=${handleDrag} 
      onDrop=${handleDrop}
    >
      <div 
        className=${`upload-zone glass-panel ${dragActive ? 'active' : ''}`}
        tabIndex="0"
        role="button"
        aria-label="Drag and drop files here, or click to upload"
      >
        <h2>Drop ANY file here</h2>
        <p>Supports .json, .csv, .pdf, images, docs! We'll transform every file into a moment on your timeline.</p>
        
        <label className="upload-btn" tabIndex="0">
          Select Files
          <input 
            type="file" 
            multiple 
            onChange=${handleChange} 
            style=${{display: 'none'}} 
            aria-label="Select files to upload"
          />
        </label>
        
        ${error && html`<div className="upload-error" role="alert">${error}</div>`}
        
        <div className="demo-hint">
          Don't have files? We provide a <strong>test-dataset.json</strong> for testing in the workspace.
        </div>
      </div>
    </section>
  `;
}
