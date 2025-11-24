import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@cms/ui/components/button';
import { Input } from '@cms/ui/components/input';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Header } from '../../../components/Layout/Header';
import { Main } from '../../../components/Layout/main';
import { ProfileDropdown } from '../../../components/profile-dropdown';
import { Search } from '../../../components/search';

interface UserResponse {
  id: number;
  username: string;
  email: string;
  name: string;
  address?: string;
  phoneNumber?: string;
  role: {
    id: number;
    name: string;
  };
  tenant: {
    id: number;
    name: string;
  };
}

const EditInstructor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstructor = async () => {
      if (!id) {
        setError('Instructor ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch instructor');
        }

        const instructor: UserResponse = await response.json();
        setName(instructor.name || '');
        setEmail(instructor.email || '');
        setAddress(instructor.address || '');
        setPhoneNumber(instructor.phoneNumber || '');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!id) {
        throw new Error('Instructor ID is required');
      }

      const updateData = {
        name,
        address,
        phoneNumber,
        roleId: 3, // Staff role ID - adjust if needed
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update instructor');
      }

      navigate(`/instructor/${id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to update instructor');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header>
          <Search />
          <div className="ml-auto flex items-center gap-4">
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading instructor...</p>
            </div>
          </div>
        </Main>
      </>
    );
  }

  return (
    <>
      <Header>
        <Search />
        <div className="ml-auto flex items-center gap-4">
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="py-3">
          <div className="mb-4">
            <Button onClick={() => navigate(-1)} variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-3xl mx-auto mt-8 p-6 border rounded-lg shadow-sm"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Instructor</h2>

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter instructor name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={email}
                  disabled
                  className="bg-muted cursor-not-allowed"
                  placeholder="Email (cannot be changed)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed after account creation
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <Input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter address..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <Input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number..."
                />
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Instructor'
                )}
              </Button>
            </div>
          </form>
        </div>
      </Main>
    </>
  );
};

export default EditInstructor;

