import React, { memo } from 'react';
import { html } from '../utils/html.js';

/**
 * @typedef {import('../../app.js').ReceiptData} ReceiptData
 */

/**
 * @typedef {Object} ReceiptCardProps
 * @property {ReceiptData} receipt - The digital moment object.
 * @property {(id: string) => void} onClick - Callback when the card is clicked.
 */

/**
 * ReceiptCard component to render a single digital moment.
 * Wrapped in React.memo for performance optimization.
 * 
 * @param {ReceiptCardProps} props
 * @returns {React.ReactElement}
 */
const ReceiptCard = memo(function ReceiptCard({ receipt, onClick }) {
  /** @type {React.ReactElement[]} */
  let innerContent = [];
  
  // Bulletproof rendering for any type
  if (receipt.content) {
    if (receipt.type === 'music') {
      innerContent.push(html`<div key="t" className="card-title">${receipt.content.title}</div>`);
      innerContent.push(html`<div key="d" className="card-desc">${receipt.content.albumArt || '🎵'} ${receipt.content.artist}</div>`);
    } else if (receipt.type === 'purchase') {
      innerContent.push(html`<div key="t" className="card-title">${receipt.content.item}</div>`);
      innerContent.push(html`<div key="d" className="card-desc">${receipt.content.amount} at ${receipt.content.location}</div>`);
    } else if (receipt.type === 'search') {
      innerContent.push(html`<div key="t" className="card-title">🔍 "${receipt.content.query}"</div>`);
    } else if (receipt.type === 'message') {
      innerContent.push(html`<div key="t" className="card-title">Message to ${receipt.content.recipient || 'Unknown'}</div>`);
      innerContent.push(html`<div key="d" className="card-desc">"${receipt.content.text}"</div>`);
    } else if (receipt.type === 'place') {
      innerContent.push(html`<div key="t" className="card-title">📍 ${receipt.content.name}</div>`);
      innerContent.push(html`<div key="d" className="card-desc">${receipt.content.city || 'Unknown Location'}</div>`);
    } else if (receipt.type === 'photo') {
      innerContent.push(html`<div key="t" className="card-title" aria-hidden="true">${receipt.content.emoji || '📸'} Photo</div>`);
      innerContent.push(html`<div key="d" className="card-desc">${receipt.content.description}</div>`);
    } else {
      innerContent.push(html`<div key="t" className="card-title">${String(receipt.type || 'generic').toUpperCase()}</div>`);
      Object.entries(receipt.content).forEach(([k, v]) => {
        innerContent.push(html`<div key=${k} className="card-desc"><strong>${k}:</strong> ${v}</div>`);
      });
    }
  } else if (receipt.title) {
     innerContent.push(html`<div key="t" className="card-title">${receipt.title}</div>`);
     if (receipt.description) {
       innerContent.push(html`<div key="d" className="card-desc">${receipt.description}</div>`);
     }
  } else {
    innerContent.push(html`<div key="t" className="card-title">Empty Record</div>`);
  }

  const dateStr = new Date(receipt.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const tags = receipt.tags || [];

  return html`
    <div 
      className="card" 
      onClick=${() => onClick(receipt.id)}
      role="button"
      tabIndex="0"
      aria-label=${`View details for ${receipt.type || 'generic'} moment on ${dateStr}`}
      onKeyDown=${(/** @type {React.KeyboardEvent} */ e) => { 
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(receipt.id); 
        }
      }}
    >
      <div className="card-header">
        <span className=${`type-badge type-${receipt.type || 'generic'}`}>${receipt.type || 'generic'}</span>
        <span>${dateStr}</span>
      </div>
      <div className="card-body">
        ${innerContent}
      </div>
      <div className="card-tags">
        ${tags.map(tag => html`<span key=${tag} className="tag">#${tag}</span>`)}
      </div>
    </div>
  `;
});

export default ReceiptCard;
