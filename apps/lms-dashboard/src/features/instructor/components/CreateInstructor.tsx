import { Button } from '@cms/ui/components/button';
import { Input } from '@cms/ui/components/input';
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

const CreateInstructor = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const newInstructor = {
        name,
        email,
        password,
        username,
        address,
        phoneNumber,
        roleId: 3,
        tenantId: 1,
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInstructor),
      });

      if (!response.ok) {
        throw new Error('Failed to create instructor');
      }

      navigate(-1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-3">
      <div className="">
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mt-20 p-4 border rounded">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Instructor</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border px-3 py-2 border-gray-300 rounded"
            placeholder="Enter instructor name..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border px-3 py-2 border-gray-300 rounded"
            placeholder="Enter email..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border px-3 py-2 border-gray-300 rounded"
            placeholder="Enter password..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border px-3 py-2 border-gray-300 rounded"
            placeholder="Enter username..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Address</label>
          <Input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full border px-3 py-2 border-gray-300 rounded"
            placeholder="Enter address..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <Input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="w-full border px-3 py-2 border-gray-300 rounded"
            placeholder="Enter phone number..."
          />
        </div>

        <div className="w-full">
          <Button type="submit" className="w-full text-white text-base px-4 py-2 rounded transition" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Instructor'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateInstructor;