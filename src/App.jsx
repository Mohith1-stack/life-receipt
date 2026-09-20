import React, { useState, useEffect, useCallback } from 'react';
import DatasetUploader from './components/DatasetUploader.jsx';
import StoryMode from './components/StoryMode.jsx';
import ExploreMode from './components/ExploreMode.jsx';
import ReceiptModal from './components/ReceiptModal.jsx';

/**
 * @typedef {Object} ReceiptData
 * @property {string} id - Unique identifier for the receipt.
 * @property {string} type - The category of the receipt (e.g., 'music', 'purchase').
 * @property {string} title - The main title or descriptor.
 * @property {string} timestamp - ISO 8601 date string.
 * @property {string} [description] - Optional detailed description.
 * @property {string[]} [tags] - Array of associated tags.
 * @property {number} [amount] - Optional numeric amount for purchases.
 */

/**
 * Main Application Root Component.
 * Manages global state including dataset, current view, and selected receipt for the modal.
 * @returns {React.ReactElement} The rendered application.
 */
function App() {
  /** @type {[ReceiptData[] | null, React.Dispatch<React.SetStateAction<ReceiptData[] | null>>]} */
  const [dataset, setDataset] = useState(null);
  
  /** @type {['story' | 'explore', React.Dispatch<React.SetStateAction<'story' | 'explore'>>]} */
  const [currentView, setCurrentView] = useState('story');
  
  /** @type {[ReceiptData | null, React.Dispatch<React.SetStateAction<ReceiptData | null>>]} */
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Inject the animation style that IntersectionObserver uses globally
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  /**
   * Handles opening a receipt in the modal view.
   * @param {string} id - The ID of the receipt to display.
   */
  const handleReceiptClick = useCallback((id) => {
    if (dataset) {
      const found = dataset.find(r => r.id === id);
      if (found) setSelectedReceipt(found);
    }
  }, [dataset]);

  if (!dataset) {
    return (
      <main className="app-container" style={{justifyContent: 'center', alignItems: 'center'}} aria-label="Upload Dataset View">
        <DatasetUploader onDataLoaded={setDataset} />
      </main>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header" role="banner">
        <div className="logo">
          <h1 tabIndex="0"><span>Life</span>Receipts.</h1>
          <p className="subtitle" tabIndex="0">A digital constellation of moments.</p>
        </div>
        <nav className="view-toggle" aria-label="Main Navigation">
          <button 
            className={currentView === 'story' ? 'active' : ''} 
            onClick={() => setCurrentView('story')}
            aria-pressed={currentView === 'story'}
            aria-label="Switch to Story View"
          >
            The Story
          </button>
          <button 
            className={currentView === 'explore' ? 'active' : ''} 
            onClick={() => setCurrentView('explore')}
            aria-pressed={currentView === 'explore'}
            aria-label="Switch to Explore View"
          >
            Explore Data
          </button>
          <button 
            onClick={() => setDataset(null)}
            aria-label="Upload new dataset"
            title="Upload new dataset"
          >
            ⏏ Eject
          </button>
        </nav>
      </header>

      <main className="main-content" role="main" aria-live="polite">
        {currentView === 'story' 
          ? <StoryMode dataset={dataset} onReceiptClick={handleReceiptClick} />
          : <ExploreMode dataset={dataset} onReceiptClick={handleReceiptClick} />
        }
      </main>
      
      {selectedReceipt && (
        <ReceiptModal receipt={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
    </div>
  );
}

export default App;
