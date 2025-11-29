import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { fetchWithAuth } from "@/lib/api";

export const EditMovieGenrePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [genreData, setGenreData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const response = await fetchWithAuth(`/movie-genres/${id}`);
        if (response.ok) {
          const data = await response.json();
          setGenreData(data.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch movie genre.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching the movie genre.",
          variant: "destructive",
        });
      }
    };
    fetchGenre();
  }, [id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetchWithAuth(`/movie-genres/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(genreData),
      });

      if (response.ok) {
        toast({
          title: "Movie Genre Updated",
          description: "The movie genre has been successfully updated.",
        });
        navigate(-1);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to update movie genre.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating the movie genre.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setGenreData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <ArrowLeft 
            className="w-6 h-6 text-foreground mr-4 cursor-pointer" 
            onClick={() => navigate(-1)}
          />
          <h1 className="text-2xl font-bold text-foreground">Edit Movie Genre</h1>
        </div>

        <Card className="p-6 bg-card/50 border-border/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Genre Name *
              </label>
              <Input
                value={genreData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter genre name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <Textarea
                value={genreData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter genre description"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-accent text-background">
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
