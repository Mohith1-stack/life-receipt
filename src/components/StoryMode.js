import React, { useMemo, useEffect, useRef } from 'react';
import { html } from '../utils/html.js';
import ReceiptCard from './ReceiptCard.js';

/**
 * StoryMode component displaying an algorithmic narrative of receipts.
 * 
 * @param {Object} props
 * @param {Array} props.dataset - The array of receipts.
 * @param {Function} props.onReceiptClick - Callback for clicking a receipt.
 */
export default function StoryMode({ dataset, onReceiptClick }) {
  const observerRef = useRef(null);

  // Algorithmic Story Generation
  const chapters = useMemo(() => {
    if (!dataset || dataset.length === 0) return [];
    
    const sorted = [...dataset].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const generatedChapters = [];
    let currentChapter = [sorted[0]];
    
    const GAP_MS = 12 * 60 * 60 * 1000;
    
    for (let i = 1; i < sorted.length; i++) {
      const prevTime = new Date(sorted[i-1].timestamp).getTime();
      const currTime = new Date(sorted[i].timestamp).getTime();
      
      if ((currTime - prevTime > GAP_MS) || (currentChapter.length >= 8)) {
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
          entry.target.style.animation = `fadeIn 0.8s ease forwards`;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    observerRef.current = observer;

    const elements = document.querySelectorAll('.fade-in-element');
    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [chapters]);

  return html`
    <section className="view-section active" aria-label="Story View">
      <div className="story-intro">
        <h2>Invisible Threads</h2>
        <p>Scroll to uncover how disconnected moments form chapters of your life.</p>
        <div className="scroll-indicator" aria-hidden="true">↓</div>
      </div>
      <div className="story-timeline" role="list">
        ${chapters.map((chapter, cIdx) => html`
          <div key=${cIdx} className="story-chapter" role="listitem">
            <h3 className="chapter-title">${chapter.title}</h3>
            ${chapter.receipts.map((receipt) => html`
              <div key=${receipt.id} className="story-node fade-in-element">
                <div className="node-point" aria-hidden="true"></div>
                <${ReceiptCard} receipt=${receipt} onClick=${onReceiptClick} />
                <div style=${{width: '45%'}} aria-hidden="true"></div>
              </div>
            `)}
          </div>
        `)}
      </div>
    </section>
  `;
}
