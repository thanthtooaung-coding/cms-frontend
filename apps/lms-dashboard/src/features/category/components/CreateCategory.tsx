import { Button } from '@cms/ui/components/button';
import { Textarea } from '@cms/ui/components/textarea';
import { Input } from '@cms/ui/components/input';
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

const CreateCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const newCategory = {
        name,
        description,
        tenantId: 1,
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      setName('');
      setDescription('');
      navigate(-1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='py-3'>
    <div className="">
      <Button onClick={()=> navigate(-1)}>
      <ArrowLeft/>
    </Button>
    </div>
    
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mt-20 p-4 border rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Category</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border px-3 py-2 border-gray-300 rounded"
          placeholder="Enter category name..."
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="w-full h-30 text-sm border rounded border border-gray-300 focus:border-gray-700"
          placeholder="Enter description..."
        />
      </div>
      <div className="w-full">
          <Button
            type="submit"
            className="w-full text-white text-base px-4 py-2 rounded transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Category'}
          </Button>
      </div>
      
    </form>
    </div>
    
  );
};

export default CreateCategory;