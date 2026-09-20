import React, { useEffect, useRef } from 'react';

/**
 * @typedef {import('../App.jsx').ReceiptData} ReceiptData
 */

/**
 * @typedef {Object} ReceiptModalProps
 * @property {ReceiptData | null} receipt - The digital moment object to display.
 * @property {() => void} onClose - Callback to close the modal.
 */

/**
 * ReceiptModal component to display detailed information of a receipt.
 * Handles focus management for accessibility.
 * 
 * @param {ReceiptModalProps} props
 * @returns {React.ReactElement | null}
 */
export default function ReceiptModal({ receipt, onClose }) {
  /** @type {React.MutableRefObject<HTMLButtonElement | null>} */
  const closeBtnRef = useRef(null);
  /** @type {React.MutableRefObject<HTMLDivElement | null>} */
  const modalRef = useRef(null);

  useEffect(() => {
    if (!receipt) return;
    
    /** @param {KeyboardEvent} e */
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      
      // Focus Trap implementation
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = /** @type {HTMLElement} */ (focusableElements[0]);
        const lastElement = /** @type {HTMLElement} */ (focusableElements[focusableElements.length - 1]);

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Manage focus for accessibility
    if (closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
    
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [receipt, onClose]);

  if (!receipt) return null;

  const dateStr = new Date(receipt.timestamp).toLocaleString();
  const tags = receipt.tags || [];

  return (
    <div 
      className={`modal-overlay ${receipt ? 'active' : ''}`} 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
    >
      <div 
        ref={modalRef}
        className="modal-content glass-panel" 
        onClick={(/** @type {React.MouseEvent} */ e) => e.stopPropagation()}
      >
        <button 
          ref={closeBtnRef}
          className="icon-button close-btn" 
          onClick={onClose}
          aria-label="Close modal"
        >✕</button>
        <div className="receipt-detail" id="modal-desc">
          <div className="receipt-header">
            <h2 id="modal-title" className="receipt-brand">DIGITAL RECEIPT</h2>
            <div className="receipt-meta">TXN ID: {String(receipt.id).padStart(8, '0')}</div>
            <div className="receipt-meta">{dateStr}</div>
          </div>
          
          <div className="receipt-line" style={{marginBottom: '2rem'}}>
            <span>TYPE</span>
            <span>{(receipt.type || 'generic').toUpperCase()}</span>
          </div>
          
          {receipt.content ? Object.entries(receipt.content).map(([key, value]) => (
            <div key={key} className="receipt-line">
              <span>{key.toUpperCase()}</span>
              <span>{value}</span>
            </div>
          )) : (
            <React.Fragment>
              {receipt.title && (
                 <div key="t" className="receipt-line">
                   <span>TITLE</span>
                   <span>{receipt.title}</span>
                 </div>
              )}
              {receipt.description && (
                 <div key="d" className="receipt-line">
                   <span>DESC</span>
                   <span>{receipt.description}</span>
                 </div>
              )}
            </React.Fragment>
          )}
          
          <div className="receipt-total">
            <span>STATUS</span>
            <span>RECORDED</span>
          </div>
          
          <div style={{marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>
            {tags.map(t => `#${t}`).join(' ')}
          </div>
        </div>
      </div>
    </div>
  );
}
