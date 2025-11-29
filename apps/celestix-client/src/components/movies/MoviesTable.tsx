import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { FilterPopover } from "@/components/FilterPopover";
import { fetchWithAuth } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useTenantPath } from "@/hooks/useTenantPath";


const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={`text-lg ${star <= rating ? "text-yellow-400" : "text-gray-600"}`}>★</span>
    ))}
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const variants: { [key: string]: string } = {
    "Now Showing": "bg-green-500/20 text-green-400 border-green-500/30",
    "Coming Soon": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };
  return <Badge className={`${variants[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'} border`}>{status}</Badge>;
};

export const MoviesTable = () => {
  const navigate = useNavigate();
  const { getPath } = useTenantPath();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string[]>>({ genre: [] });
  const [movies, setMovies] = useState<any[]>([]);
  const [genreOptions, setGenreOptions] = useState<string[]>([]);
  const itemsPerPage = 12;

   useEffect(() => {
    fetchMovies();
    fetchGenres();
  }, []);

  const fetchMovies = async () => {
      try {
        const response = await fetchWithAuth("/movies");
        if (response.ok) {
          const data = await response.json();
          setMovies(data.data);
        } else {
          console.error("Failed to fetch movies");
          toast({
            title: "Error",
            description: "Failed to fetch movies.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        toast({
            title: "Error",
            description: "An error occurred while fetching movies.",
            variant: "destructive",
        });
      }
    };

  const fetchGenres = async () => {
    try {
      const response = await fetchWithAuth("/movie-genres");
      if (response.ok) {
        const data = await response.json();
        // Extract the name from each genre object to create an array of strings
        const names = data.data.map((genre: { name: string }) => genre.name);
        setGenreOptions(names);
      } else {
        console.error("Failed to fetch genres");
        toast({
          title: "Error",
          description: "Failed to fetch genre options for filtering.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching genres:", error);
      toast({
          title: "Error",
          description: "An error occurred while fetching genre options.",
          variant: "destructive",
      });
    }
  };

  const handleDelete = async (movieId: number) => {
    try {
        const response = await fetchWithAuth(`/movies/${movieId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
            toast({
                title: "Success",
                description: "Movie deleted successfully.",
            });
        } else {
            const errorData = await response.json();
            toast({
                title: "Error",
                description: errorData.message || "Failed to delete movie.",
                variant: "destructive",
            });
        }
    } catch (error) {
        toast({
            title: "Error",
            description: "An error occurred while deleting the movie.",
            variant: "destructive",
        });
    }
  };


  const filterSections = [
    {
      title: "By Genre",
      stateKey: "genre",
      options: genreOptions,
    },
  ];

  const filteredMovies = movies
    .filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((movie) => filters.genre.length === 0 || movie.genres.some((g: any) => filters.genre.includes(g.name)));


  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Movies</h1>
        <Button className="bg-gradient-accent hover:shadow-glow transition-all duration-300" onClick={() => navigate(getPath("/admin/movies/add"))}> <Plus className="w-4 h-4 mr-2" /> New Movie </Button>
      </div>

      <Card className="glass-card p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search Movie..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-secondary/50 border-border/50" />
          </div>
          <FilterPopover filterSections={filterSections} selectedFilters={filters} onFilterChange={setFilters} />
        </div>
      </Card>

      <Card className="glass-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-muted-foreground font-medium">Title ↕</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Duration</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Release Date</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Rating</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Genre</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovies.map((movie) => (
                <tr key={movie.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-16 bg-secondary rounded-lg flex items-center justify-center text-2xl overflow-hidden">
                        {movie.moviePosterUrl ? (
                            <img src={movie.moviePosterUrl} alt={movie.title} className="w-full h-full object-cover" />
                        ) : (
                            <span>🎬</span>
                        )}
                        </div>
                      <span className="font-medium text-foreground">{movie.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{movie.duration}</td>
                  <td className="p-4 text-muted-foreground">{movie.releaseDate}</td>
                  <td className="p-4 text-muted-foreground">{movie.rating}</td>
                  <td className="p-4 text-muted-foreground">
                    {movie.genres.map((g: any) => g.name).join(', ')}
                  </td>
                  <td className="p-4"><StatusBadge status={movie.status} /></td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => navigate(getPath(`/admin/movies/edit/${movie.id}`))}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleDelete(movie.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-4 border-t border-border/50">
          <div className="text-sm text-muted-foreground">Rows per page: {itemsPerPage} | 1-{filteredMovies.length} of {movies.length}</div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="text-muted-foreground">←</Button>
            <Button variant="ghost" size="icon" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="text-muted-foreground">→</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
