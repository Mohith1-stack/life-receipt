import React, { useState, useMemo, useCallback } from 'react';
import ReceiptCard from './ReceiptCard.jsx';

/**
 * @typedef {import('../App.jsx').ReceiptData} ReceiptData
 */

/**
 * @typedef {Object} ExploreModeProps
 * @property {ReceiptData[]} dataset - The array of receipts.
 * @property {(id: string) => void} onReceiptClick - Callback for clicking a receipt.
 */

/**
 * ExploreMode component for filtering and searching through the dataset.
 * 
 * @param {ExploreModeProps} props
 * @returns {React.ReactElement}
 */
const ExploreMode = React.memo(function ExploreMode({ dataset, onReceiptClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  /** @type {[Set<string>, React.Dispatch<React.SetStateAction<Set<string>>>]} */
  const [activeTags, setActiveTags] = useState(new Set());

  // Extract unique tags dynamically
  /** @type {string[]} */
  const allTags = useMemo(() => {
    /** @type {Set<string>} */
    const tags = new Set();
    if (dataset) {
      dataset.forEach(r => (r.tags || []).forEach(t => tags.add(t)));
    }
    return Array.from(tags).sort();
  }, [dataset]);

  /**
   * @param {string} tag 
   */
  const toggleTag = useCallback((tag) => {
    setActiveTags(prevTags => {
      const newTags = new Set(prevTags);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      return newTags;
    });
  }, []);

  /** @type {ReceiptData[]} */
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

  return (
    <section className="view-section active" aria-label="Explore View Grid">
      <div className="explore-controls">
        <div className="search-bar">
          <input 
            type="search" 
            placeholder="Search moments... (e.g., Tokyo, late-night)" 
            value={searchQuery}
            onInput={(/** @type {React.ChangeEvent<HTMLInputElement>} */ e) => setSearchQuery(e.target.value)}
            aria-label="Search moments"
            aria-controls="explore-grid-results"
          />
        </div>
        <div className="filters" role="group" aria-label="Filter by tags">
          {allTags.map(tag => (
            <button 
              key={tag}
              className={`tag filter-btn ${activeTags.has(tag) ? 'active' : ''}`}
              onClick={() => toggleTag(tag)}
              aria-pressed={activeTags.has(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
      
      <div className="stats-bar" aria-live="polite" aria-atomic="true">
        <span>{filteredData.length} moment{filteredData.length !== 1 ? 's' : ''} found</span>
      </div>

      <div id="explore-grid-results" className="explore-grid" role="list">
        {filteredData.map(receipt => (
          <div role="listitem" key={receipt.id}>
            <ReceiptCard receipt={receipt} onClick={onReceiptClick} />
          </div>
        ))}
      </div>
    </section>
  );
});

export default ExploreMode;
