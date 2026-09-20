import React from 'react';
import htm from 'htm';

/**
 * Binds HTM to React's createElement.
 * Allows using JSX-like syntax via tagged template literals.
 * @type {Function}
 */
export const html = htm.bind(React.createElement);
