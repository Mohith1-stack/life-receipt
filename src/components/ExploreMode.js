import React, { useState, useMemo } from 'react';
import { html } from '../utils/html.js';
import ReceiptCard from './ReceiptCard.js';

/**
 * ExploreMode component for filtering and searching through the dataset.
 * 
 * @param {Object} props
 * @param {Array} props.dataset - The array of receipts.
 * @param {Function} props.onReceiptClick - Callback for clicking a receipt.
 */
export default function ExploreMode({ dataset, onReceiptClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTags, setActiveTags] = useState(new Set());

  // Extract unique tags dynamically
  const allTags = useMemo(() => {
    const tags = new Set();
    if (dataset) {
      dataset.forEach(r => (r.tags || []).forEach(t => tags.add(t)));
    }
    return Array.from(tags).sort();
  }, [dataset]);

  const toggleTag = (tag) => {
    const newTags = new Set(activeTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setActiveTags(newTags);
  };

  const filteredData = useMemo(() => {
    if (!dataset) return [];
    const query = searchQuery.toLowerCase();
    return dataset.filter(r => {
      const matchesSearch = query === '' || JSON.stringify(r).toLowerCase().includes(query);
      const rTags = r.tags || [];
      const matchesTags = activeTags.size === 0 || Array.from(activeTags).every(tag => rTags.includes(tag));
      return matchesSearch && matchesTags;
    });
  }, [searchQuery, activeTags, dataset]);

  return html`
    <section className="view-section active" aria-label="Explore View">
      <div className="explore-controls">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search moments... (e.g., Tokyo, late-night)" 
            value=${searchQuery}
            onInput=${e => setSearchQuery(e.target.value)}
            aria-label="Search moments"
          />
        </div>
        <div className="filters" role="group" aria-label="Filter by tags">
          ${allTags.map(tag => html`
            <button 
              key=${tag}
              className=${`tag filter-btn ${activeTags.has(tag) ? 'active' : ''}`}
              onClick=${() => toggleTag(tag)}
              aria-pressed=${activeTags.has(tag)}
            >
              #${tag}
            </button>
          `)}
        </div>
      </div>
      
      <div className="stats-bar" aria-live="polite">
        <span>${filteredData.length} moment${filteredData.length !== 1 ? 's' : ''} found</span>
      </div>

      <div className="explore-grid" role="list">
        ${filteredData.map(receipt => html`
          <div role="listitem" key=${receipt.id}>
            <${ReceiptCard} receipt=${receipt} onClick=${onReceiptClick} />
          </div>
        `)}
      </div>
    </section>
  `;
}
