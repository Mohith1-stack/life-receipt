import React, { useEffect, useRef } from 'react';
import { html } from '../utils/html.js';

/**
 * ReceiptModal component to display detailed information of a receipt.
 * Handles focus management for accessibility.
 * 
 * @param {Object} props
 * @param {Object} props.receipt - The digital moment object to display.
 * @param {Function} props.onClose - Callback to close the modal.
 */
export default function ReceiptModal({ receipt, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    
    // Manage focus for accessibility
    if (receipt && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
    
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [receipt, onClose]);

  if (!receipt) return null;

  const dateStr = new Date(receipt.timestamp).toLocaleString();
  const tags = receipt.tags || [];

  return html`
    <div 
      className=${`modal-overlay ${receipt ? 'active' : ''}`} 
      onClick=${onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="modal-content glass-panel" 
        onClick=${e => e.stopPropagation()}
      >
        <button 
          ref=${closeBtnRef}
          className="icon-button close-btn" 
          onClick=${onClose}
          aria-label="Close modal"
        >✕</button>
        <div className="receipt-detail">
          <div className="receipt-header">
            <h2 id="modal-title" className="receipt-brand">DIGITAL RECEIPT</h2>
            <div className="receipt-meta">TXN ID: ${String(receipt.id).padStart(8, '0')}</div>
            <div className="receipt-meta">${dateStr}</div>
          </div>
          
          <div className="receipt-line" style=${{marginBottom: '2rem'}}>
            <span>TYPE</span>
            <span>${(receipt.type || 'generic').toUpperCase()}</span>
          </div>
          
          ${receipt.content ? Object.entries(receipt.content).map(([key, value]) => html`
            <div key=${key} className="receipt-line">
              <span>${key.toUpperCase()}</span>
              <span>${value}</span>
            </div>
          `) : null}
          
          <div className="receipt-total">
            <span>STATUS</span>
            <span>RECORDED</span>
          </div>
          
          <div style=${{marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>
            ${tags.map(t => `#${t}`).join(' ')}
          </div>
        </div>
      </div>
    </div>
  `;
}
