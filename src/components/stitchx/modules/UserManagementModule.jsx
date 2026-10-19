import React, { useState, useEffect } from 'react';
import {
  Plus,
  X,
} from 'lucide-react';
import { docApi } from '../../../lib/docApi';
import { formatDate } from '../utils';

export function UserManagementModule() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('doc_manager');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await docApi.getUsers();
      if (res.success) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await docApi.updateUserRole(userId, newRole);
      if (res.success) {
        loadUsers();
      } else {
        alert(res.error || 'Failed to update user role.');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setFormError('Username and password are required.');
      return;
    }
    setFormError('');
    setSubmitting(true);

    try {
      const res = await docApi.createUser({ username: username.trim(), password, role });
      if (res.success) {
        setIsAddOpen(false);
        setUsername('');
        setPassword('');
        loadUsers();
      } else {
        setFormError(res.error || 'Failed to create user.');
      }
    } catch (err) {
      setFormError(err.message || 'Error creating user.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            User & Role Governance
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
            Role-based access control (RBAC) enforced on server routes: Owner, Admin, Accountant, Document Manager, Viewer.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError('');
            setIsAddOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl text-xs font-mono font-black transition-all shadow-md border border-blue-400 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Staff User</span>
        </button>
      </div>

      {/* Role Definitions Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="font-black text-slate-900 text-sm block mb-1">Owner / Admin</span>
          <p className="text-xs font-bold text-slate-600">Full company authority, settings, deletion, and user permissions.</p>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="font-black text-slate-900 text-sm block mb-1">Accountant</span>
          <p className="text-xs font-bold text-slate-600">Authorized for Invoices, Payments, Receipts, and Financial Reports.</p>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="font-black text-slate-900 text-sm block mb-1">Document Manager</span>
          <p className="text-xs font-bold text-slate-600">Manages quotations, proposals, NDAs, client records, and files.</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-300 text-slate-800 font-black uppercase text-[11px] tracking-wider font-mono">
              <tr>
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Current Role</th>
                <th className="py-3.5 px-4">Account Created</th>
                <th className="py-3.5 px-4 text-right">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-600 font-bold font-mono">Loading users...</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-black">
                          {u.username[0]?.toUpperCase()}
                        </div>
                        <span className="font-black text-slate-900 text-sm">{u.username}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-300 uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-bold text-xs">{formatDate(u.created_at)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-900 focus:outline-hidden"
                      >
                        <option value="owner">Owner / Super Admin</option>
                        <option value="admin">Administrator</option>
                        <option value="accountant">Accountant</option>
                        <option value="doc_manager">Document Manager</option>
                        <option value="viewer">Read-Only Viewer</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">Provision Staff Account</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. accountant_rahul"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Secure Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Authorized Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                >
                  <option value="accountant">Accountant (Invoices & Payments)</option>
                  <option value="doc_manager">Document Manager (Quotes, Proposals, NDAs)</option>
                  <option value="admin">Administrator (Authorized modules)</option>
                  <option value="viewer">Read-Only Viewer</option>
                  <option value="owner">Owner / Super Admin</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-[#1677FF] hover:bg-blue-600 text-white rounded-lg font-bold shadow-xs"
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
