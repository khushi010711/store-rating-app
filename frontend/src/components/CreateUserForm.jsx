// frontend/src/components/CreateUserForm.jsx
import React, { useState } from 'react';

const CreateUserForm = ({ onFormSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'Normal User', 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create New User</h3>
      <input type="text" name="name" placeholder="Full Name (min 20 chars)" value={formData.name} onChange={handleInputChange} required minLength="20" />
      <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
      <textarea name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} required />
      <select name="role" value={formData.role} onChange={handleInputChange}>
        <option value="Normal User">Normal User</option>
        <option value="Store Owner">Store Owner</option>
        <option value="System Administrator">System Administrator</option>
      </select>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
};

export default CreateUserForm;