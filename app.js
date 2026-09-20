import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { html } from './src/utils/html.js';
import DatasetUploader from './src/components/DatasetUploader.js';
import StoryMode from './src/components/StoryMode.js';
import ExploreMode from './src/components/ExploreMode.js';
import ReceiptModal from './src/components/ReceiptModal.js';

/**
 * Main Application Root Component.
 * Manages global state including dataset, current view, and selected receipt for the modal.
 */
function App() {
  const [dataset, setDataset] = useState(null);
  const [currentView, setCurrentView] = useState('story');
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

  const handleReceiptClick = useCallback((id) => {
    if (dataset) {
      const found = dataset.find(r => r.id === id);
      setSelectedReceipt(found);
    }
  }, [dataset]);

  if (!dataset) {
    return html`
      <main className="app-container" style=${{justifyContent: 'center', alignItems: 'center'}}>
        <${DatasetUploader} onDataLoaded=${setDataset} />
      </main>
    `;
  }

  return html`
    <div className="app-container">
      <header className="app-header" role="banner">
        <div className="logo">
          <h1 tabIndex="0"><span>Life</span>Receipts.</h1>
          <p className="subtitle" tabIndex="0">A digital constellation of moments.</p>
        </div>
        <nav className="view-toggle" aria-label="Main Navigation">
          <button 
            className=${currentView === 'story' ? 'active' : ''} 
            onClick=${() => setCurrentView('story')}
            aria-pressed=${currentView === 'story'}
          >
            The Story
          </button>
          <button 
            className=${currentView === 'explore' ? 'active' : ''} 
            onClick=${() => setCurrentView('explore')}
            aria-pressed=${currentView === 'explore'}
          >
            Explore Data
          </button>
          <button 
            onClick=${() => setDataset(null)}
            aria-label="Upload new dataset"
            title="Upload new dataset"
          >
            ⏏ Eject
          </button>
        </nav>
      </header>

      <main className="main-content" role="main">
        ${currentView === 'story' 
          ? html`<${StoryMode} dataset=${dataset} onReceiptClick=${handleReceiptClick} />`
          : html`<${ExploreMode} dataset=${dataset} onReceiptClick=${handleReceiptClick} />`
        }
      </main>
      
      ${selectedReceipt && html`
        <${ReceiptModal} receipt=${selectedReceipt} onClose=${() => setSelectedReceipt(null)} />
      `}
    </div>
  `;
}

// Ensure "use strict" conceptually, initialize app
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(html`<${App} />`);
