"use client";

import { useEffect, useState } from 'react';
// Assuming Dialog components are available
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface User {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  createdAt?: string;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to control modal visibility
  const [currentUser, setCurrentUser] = useState<User | null>(null); // State to hold user data for editing
  const [editFormData, setEditFormData] = useState<Partial<User>>({}); // State for form inputs

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to open edit modal and set current user data
  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setEditFormData(user); // Initialize form data with current user info
    setIsEditModalOpen(true);
  };

  // Function to handle form input changes
  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Function to save updated user data
  const handleSaveUser = async () => {
    if (!currentUser) return;

    try {
      const res = await fetch(`/api/admin/users/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (!res.ok) {
        throw new Error(`Error updating user: ${res.status}`);
      }

      // Find the index of the updated user and replace it in the state
      setUsers(users.map(user => user._id === currentUser._id ? { ...user, ...editFormData } : user));

      alert('User updated successfully!'); // Or use toast notification
      setIsEditModalOpen(false); // Close the modal

    } catch (error) {
      console.error('Error updating user:', error);
      alert(`Failed to update user: ${(error as Error).message}`);
    }
  };

  // Function for deleting user
  const handleDeleteUser = async (userId: string) => {
    if (confirm(`Are you sure you want to delete user with ID: ${userId}?`)) {
      try {
        const res = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          throw new Error(`Error deleting user: ${res.status}`);
        }

        // Remove the deleted user from the state
        setUsers(users.filter(user => user._id !== userId));

        alert('User deleted successfully!'); // Or use toast notification

      } catch (error) {
        console.error('Error deleting user:', error);
        alert(`Failed to delete user: ${(error as Error).message}`);
      }
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý tài khoản</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Username</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Full Name</th>
              <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="py-2 px-4 border-b">{user._id}</td>
                <td className="py-2 px-4 border-b">{user.username}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.fullName}</td>
                <td className="py-2 px-4 border-b">{user.phone}</td>
                <td className="py-2 px-4 border-b">
                  {/* Action buttons */}
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleEditUser(user)} // Pass the user object
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm w-full"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm w-full"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Dialog (Modal) - Correctly placed */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="fullName" className="text-right">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={editFormData.fullName || ''}
                  onChange={handleFormInputChange}
                  className="col-span-3"
                />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  value={editFormData.email || ''}
                  onChange={handleFormInputChange}
                   className="col-span-3"
                   type="email"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="phone" className="text-right">
                  Phone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={editFormData.phone || ''}
                  onChange={handleFormInputChange}
                   className="col-span-3"
                   type="tel"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="address" className="text-right">
                  Address
                </label>
                <Input
                  id="address"
                  name="address"
                  value={editFormData.address || ''}
                  onChange={handleFormInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="city" className="text-right">
                  City
                </label>
                <Input
                  id="city"
                  name="city"
                  value={editFormData.city || ''}
                  onChange={handleFormInputChange}
                  className="col-span-3"
                />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="province" className="text-right">
                  Province
                </label>
                <Input
                  id="province"
                  name="province"
                  value={editFormData.province || ''}
                  onChange={handleFormInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" onClick={handleSaveUser}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersPage; 