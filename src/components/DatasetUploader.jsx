import React, { useState, useCallback } from 'react';
import { parseCSV } from '../utils/parser.js';

/**
 * @typedef {import('../App.jsx').ReceiptData} ReceiptData
 */

/**
 * @typedef {Object} DatasetUploaderProps
 * @property {(data: ReceiptData[]) => void} onDataLoaded - Callback when data is successfully parsed.
 */

/**
 * Component to handle drag-and-drop ingestion of JSON, CSV, and generic files.
 * @param {DatasetUploaderProps} props
 * @returns {React.ReactElement}
 */
const DatasetUploader = React.memo(function DatasetUploader({ onDataLoaded }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  /** @type {React.DragEventHandler<HTMLElement>} */
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  /**
   * Process uploaded files and map them to ReceiptData schema.
   * @param {FileList | File[]} fileList 
   */
  const processFiles = useCallback((fileList) => {
    const files = Array.from(fileList);
    /** @type {ReceiptData[]} */
    let allData = [];
    let processedCount = 0;
    /** @type {string[]} */
    let errors = [];

    if (files.length === 0) return;

    files.forEach(file => {
      const lowerName = file.name.toLowerCase();
      
      // Handle generic files by capturing metadata
      if (!lowerName.endsWith('.csv') && !lowerName.endsWith('.json')) {
        /** @type {ReceiptData} */
        const fileReceipt = {
          id: "file-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
          type: "file",
          title: file.name,
          timestamp: new Date(file.lastModified).toISOString(),
          description: `Size: ${(file.size / 1024).toFixed(2)} KB | Type: ${file.type || "unknown"}`,
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
  }, [onDataLoaded]);

  /** @type {React.DragEventHandler<HTMLElement>} */
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const handleChange = useCallback((e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  /** @type {React.KeyboardEventHandler<HTMLElement>} */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      document.getElementById('file-upload-input')?.click();
    }
  }, []);

  return (
    <section 
      className="upload-container" 
      aria-label="Upload Dataset Section"
      onDragEnter={handleDrag} 
      onDragLeave={handleDrag} 
      onDragOver={handleDrag} 
      onDrop={handleDrop}
    >
      <div 
        className={`upload-zone glass-panel ${dragActive ? 'active' : ''}`}
        tabIndex="0"
        role="button"
        aria-label="Drag and drop files here, or press enter to select files"
        onKeyDown={handleKeyDown}
      >
        <h2>Drop ANY file here</h2>
        <p>Supports .json, .csv, .pdf, images, docs! We'll transform every file into a moment on your timeline.</p>
        
        <label className="upload-btn">
          Select Files
          <input 
            id="file-upload-input"
            type="file" 
            multiple 
            onChange={handleChange} 
            className="visually-hidden"
            style={{position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0}}
            tabIndex="-1"
          />
        </label>
        
        {error && <div className="upload-error" role="alert" aria-live="assertive">{error}</div>}
        
        <div className="demo-hint">
          Don't have files? We provide a <strong>test-dataset.json</strong> for testing in the workspace.
        </div>
      </div>
    </section>
  );
});

export default DatasetUploader;
