import React, { useMemo, useEffect, useRef } from 'react';
import ReceiptCard from './ReceiptCard.jsx';

/**
 * @typedef {import('../App.jsx').ReceiptData} ReceiptData
 */

/**
 * @typedef {Object} StoryModeProps
 * @property {ReceiptData[]} dataset - The array of receipts.
 * @property {(id: string) => void} onReceiptClick - Callback for clicking a receipt.
 */

/**
 * @typedef {Object} Chapter
 * @property {string} title
 * @property {ReceiptData[]} receipts
 */

/**
 * StoryMode component displaying an algorithmic narrative of receipts.
 * 
 * @param {StoryModeProps} props
 * @returns {React.ReactElement}
 */
const StoryMode = React.memo(function StoryMode({ dataset, onReceiptClick }) {
  /** @type {React.MutableRefObject<IntersectionObserver | null>} */
  const observerRef = useRef(null);

  // Algorithmic Story Generation
  /** @type {Chapter[]} */
  const chapters = useMemo(() => {
    if (!dataset || dataset.length === 0) return [];
    
    const sorted = [...dataset].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    /** @type {Chapter[]} */
    const generatedChapters = [];
    /** @type {ReceiptData[]} */
    let currentChapter = [sorted[0]];
    
    const GAP_MS = 12 * 60 * 60 * 1000; // 12 hours
    
    for (let i = 1; i < sorted.length; i++) {
      const prevTime = new Date(sorted[i-1].timestamp).getTime();
      const currTime = new Date(sorted[i].timestamp).getTime();
      
      if ((currTime - prevTime > GAP_MS) || (currentChapter.length >= 8)) {
        /** @type {Record<string, number>} */
        const tagCounts = {};
        currentChapter.forEach(r => {
          (r.tags || []).forEach(t => {
            tagCounts[t] = (tagCounts[t] || 0) + 1;
          });
        });
        
        const sortedTags = Object.entries(tagCounts).sort((a,b) => b[1] - a[1]);
        let title = `Chapter ${generatedChapters.length + 1}`;
        if (sortedTags.length > 0) {
          title += `: Moments of #${sortedTags[0][0]}`;
          if (sortedTags.length > 1) title += ` and #${sortedTags[1][0]}`;
        }
        
        generatedChapters.push({ title, receipts: currentChapter });
        currentChapter = [sorted[i]];
      } else {
        currentChapter.push(sorted[i]);
      }
    }
    
    if (currentChapter.length > 0) {
      /** @type {Record<string, number>} */
      const tagCounts = {};
      currentChapter.forEach(r => (r.tags || []).forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1));
      const sortedTags = Object.entries(tagCounts).sort((a,b) => b[1] - a[1]);
      let title = `Chapter ${generatedChapters.length + 1}`;
      if (sortedTags.length > 0) title += `: Moments of #${sortedTags[0][0]}`;
      generatedChapters.push({ title, receipts: currentChapter });
    }
    
    return generatedChapters;
  }, [dataset]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          /** @type {HTMLElement} */(entry.target).style.animation = `fadeIn 0.8s ease forwards`;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    observerRef.current = observer;

    const elements = document.querySelectorAll('.fade-in-element');
    elements.forEach(el => {
      /** @type {HTMLElement} */(el).style.opacity = '0';
      /** @type {HTMLElement} */(el).style.transform = 'translateY(30px)';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [chapters]);

  return (
    <section className="view-section active" aria-label="Story View Timeline">
      <div className="story-intro">
        <h2>Invisible Threads</h2>
        <p>Scroll to uncover how disconnected moments form chapters of your life.</p>
        <div className="scroll-indicator" aria-hidden="true">↓</div>
      </div>
      <div className="story-timeline" role="feed" aria-busy="false">
        {chapters.map((chapter, cIdx) => (
          <div key={cIdx} className="story-chapter">
            <h3 className="chapter-title" tabIndex="0">{chapter.title}</h3>
            {chapter.receipts.map((receipt) => (
              <article key={receipt.id} className="story-node fade-in-element" aria-posinset={cIdx + 1} aria-setsize={chapters.length}>
                <div className="node-point" aria-hidden="true"></div>
                <ReceiptCard receipt={receipt} onClick={onReceiptClick} />
                <div style={{width: '45%'}} aria-hidden="true"></div>
              </article>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
});

export default StoryMode;
