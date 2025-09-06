// frontend/src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import adminService from '../api/adminService';
import Modal from '../components/Modal';
import CreateUserForm from '../components/CreateUserForm';
import CreateStoreForm from '../components/CreateStoreForm';
import SortableHeader from '../components/SortableHeader';
import '../App.css';

const AdminDashboardPage = () => {
  // --- STATE MANAGEMENT ---
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', role: '', address: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [isStoreModalOpen, setStoreModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Derived state for the store owners dropdown
  const storeOwners = users.filter(u => u.role === 'Store Owner');

  // --- DATA FETCHING ---
  const fetchDashboardData = async () => {
    try {
      if (!formLoading) setLoading(true);
      
      const [statsRes, usersRes, storesRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllUsers(),
        adminService.getAllStores(),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setStores(storesRes.data);
    } catch (err) {
      setError('Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- EVENT HANDLERS ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };
  
  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const usersRes = await adminService.getAllUsers(cleanFilters);
      setUsers(usersRes.data);
    } catch (err) {
      setError('Failed to fetch filtered users.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      setFormLoading(true);
      await adminService.createUser(userData);
      setUserModalOpen(false);
      await fetchDashboardData();
    } catch (err) {
      alert('Error creating user: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateStore = async (storeData) => {
    try {
      setFormLoading(true);
      await adminService.createStore(storeData);
      setStoreModalOpen(false);
      await fetchDashboardData();
    } catch (err) { 
      alert('Error creating store: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setFormLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // --- MEMOIZED SORTING ---
  const sortedUsers = React.useMemo(() => {
    if (users.length === 0) return [];
    let sortableUsers = [...users];
    sortableUsers.sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortableUsers;
  }, [users, sortConfig]);

  // --- RENDER LOGIC ---
  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className="page-container">
      <h2>Admin Dashboard</h2>
      <section className="stats-section">
        <div className="stat-card"><h3>Total Users</h3><p>{stats.totalUsers}</p></div>
        <div className="stat-card"><h3>Total Stores</h3><p>{stats.totalStores}</p></div>
        <div className="stat-card"><h3>Total Ratings</h3><p>{stats.totalRatings}</p></div>
      </section>

      <div className="admin-actions">
        <button onClick={() => setUserModalOpen(true)}>+ Create  User</button>
        <button onClick={() => setStoreModalOpen(true)}>+ Create New Store</button>
      </div>

      <Modal isOpen={isUserModalOpen} onClose={() => setUserModalOpen(false)}>
        <CreateUserForm onFormSubmit={handleCreateUser} isLoading={formLoading} />
      </Modal>

      <Modal isOpen={isStoreModalOpen} onClose={() => setStoreModalOpen(false)}>
        <CreateStoreForm 
          onFormSubmit={handleCreateStore} 
          isLoading={formLoading} 
          storeOwners={storeOwners} 
        />
      </Modal>

      <section>
        <h3>All Users</h3>
        <form onSubmit={handleFilterSubmit} className="filter-form">
          <input type="text" name="name" placeholder="Filter by Name" value={filters.name} onChange={handleFilterChange} />
          <input type="email" name="email" placeholder="Filter by Email" value={filters.email} onChange={handleFilterChange} />
          <input type="text" name="address" placeholder="Filter by Address" value={filters.address} onChange={handleFilterChange} />
          <select name="role" value={filters.role} onChange={handleFilterChange}>
            <option value="">All Roles</option>
            <option value="Normal User">Normal User</option>
            <option value="Store Owner">Store Owner</option>
            <option value="System Administrator">System Administrator</option>
          </select>
          <button type="submit">Apply Filters</button>
        </form>
        <table className="data-table">
          <thead>
            <tr>
              <SortableHeader name="name" sortConfig={sortConfig} onSort={handleSort}>Name</SortableHeader>
              <SortableHeader name="email" sortConfig={sortConfig} onSort={handleSort}>Email</SortableHeader>
              <th>Address</th>
              <SortableHeader name="role" sortConfig={sortConfig} onSort={handleSort}>Role</SortableHeader>
              <SortableHeader name="average_store_rating" sortConfig={sortConfig} onSort={handleSort}>
                Owned Store Rating
              </SortableHeader>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>{user.role}</td>
                <td>
                  {user.role === 'Store Owner' ? (
                    user.average_store_rating ? 
                    parseFloat(user.average_store_rating).toFixed(2) + ' / 5' : 
                    'No ratings yet'
                  ) : (
                    'N/A'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3>All Stores</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.email}</td>
                <td>{store.address}</td>
                <td>{parseFloat(store.average_rating).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboardPage;