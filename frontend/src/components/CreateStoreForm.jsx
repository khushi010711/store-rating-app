// frontend/src/components/CreateStoreForm.jsx
import React, { useState } from 'react';

const CreateStoreForm = ({ onFormSubmit, isLoading, storeOwners }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    owner_id: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.owner_id) {
      alert('Please select a store owner.');
      return;
    }
    onFormSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create New Store</h3>
      <input type="text" name="name" placeholder="Store Name" value={formData.name} onChange={handleInputChange} required />
      <input type="email" name="email" placeholder="Store Email" value={formData.email} onChange={handleInputChange} required />
      <textarea name="address" placeholder="Store Address" value={formData.address} onChange={handleInputChange} required />
      <select name="owner_id" value={formData.owner_id} onChange={handleInputChange} required>
        <option value="" disabled>Select a Store Owner</option>
        {storeOwners.length > 0 ? (
          storeOwners.map(owner => (
            <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
          ))
        ) : (
          <option disabled>No Store Owners found. Please create one first.</option>
        )}
      </select>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Store'}
      </button>
    </form>
  );
};

export default CreateStoreForm;