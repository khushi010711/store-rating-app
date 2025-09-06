// frontend/src/components/SortableHeader.jsx
import React from 'react';

const SortableHeader = ({ children, name, sortConfig, onSort }) => {
  const isSorted = sortConfig.key === name;
  const direction = isSorted ? (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼') : '';

  return (
    <th onClick={() => onSort(name)} style={{ cursor: 'pointer' }}>
      {children}{direction}
    </th>
  );
};

export default SortableHeader;