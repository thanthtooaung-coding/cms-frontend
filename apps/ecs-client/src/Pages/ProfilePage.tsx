import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@cms/ui/components/button';
import { Input } from '@cms/ui/components/input';
import { Label } from '@cms/ui/components/label';
import { useAuthDataStore } from '../store/auth-store';

export default function ProfilePage() {
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const { user } = useAuthDataStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const basePath = tenantSlug ? `/ecs-client/${tenantSlug}` : '/ecs-client';

  const handleUpdate = async () => {
    // TODO: Implement profile update
    alert('Profile update feature coming soon');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </div>
        <div>
          <Label>Address</Label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div>
          <Label>Phone Number</Label>
          <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>
        <Button onClick={handleUpdate}>Update Profile</Button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">My Reviews</h2>
        <Link to={`${basePath}/reviews`}>
          <Button variant="outline">View My Reviews</Button>
        </Link>
      </div>
    </div>
  );
}

