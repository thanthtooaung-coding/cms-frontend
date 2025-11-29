import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MovieCard } from "@/components/movies/MovieCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useAuthDataStore } from "@/store/auth-store";

interface DiscoverPageProps {
  isAuthenticated: boolean;
}

interface Movie {
  id: string;
  title: string;
  description: string;
  moviePosterUrl: string;
  trailerUrl: string;
  duration: string;
  popularityRating: number;
  genres: { name: string }[];
  releaseDate: string;
  ageRating: string;
}

interface Genre {
  id: number;
  name: string;
}

export const DiscoverPage = ({ isAuthenticated }: DiscoverPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { getPath } = useTenantPath();


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [moviesResponse, genresResponse] = await Promise.all([
          fetchApi('/public/movies/popular'),
          fetchApi('/public/movie-genres')
        ]);

        if (!moviesResponse.ok) {
          throw new Error('Failed to fetch movies');
        }
        if (!genresResponse.ok) {
            throw new Error('Failed to fetch genres');
        }

        const moviesApiResponse = await moviesResponse.json();
        const genresApiResponse = await genresResponse.json();

        const moviesData = moviesApiResponse.data.map((movie: any) => ({
          id: movie.id.toString(),
          title: movie.title,
          description: movie.description,
          image: movie.moviePosterUrl,
          trailerUrl: movie.trailerUrl,
          duration: movie.duration,
          rating: movie.popularityRating,
          genre: movie.genres.map((g: any) => g.name).join(', '),
          releaseDate: new Date(movie.releaseDate).toLocaleString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          }),
          ageRating: movie.rating
        }));

        setMovies(moviesData);
        setGenres(genresApiResponse.data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);


  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

    const handleBookTicket = (movieId: string) => {
        // Check if user is authenticated using auth store or bms_token
        const { user } = useAuthDataStore.getState();
        const isAuth = user !== null || localStorage.getItem("bms_token") !== null;
        if (isAuth || isAuthenticated) {
            navigate(getPath(`/booking/${movieId}`));
        } else {
            navigate(getPath("/login"));
        }
    };

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const movieGenres = movie.genre.split(', ').map(g => g.toUpperCase());
    const matchesGenre = selectedGenres.length === 0 || selectedGenres.some(g => movieGenres.includes(g.toUpperCase()));
    return matchesSearch && matchesGenre;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div className="min-h-screen bg-gradient-cinema">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">SEARCH MOVIE</h1>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-secondary/50 border-border/50 text-foreground"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-card/50 border border-border/50 rounded-lg p-6 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-sm font-medium text-foreground">🔽</span>
                <h3 className="text-lg font-bold text-foreground">SEARCH FILTER</h3>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">GENRES</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {genres.map((genre) => (
                    <div key={genre.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={genre.name}
                        checked={selectedGenres.includes(genre.name)}
                        onCheckedChange={() => handleGenreToggle(genre.name)}
                      />
                      <label
                        htmlFor={genre.name}
                        className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                      >
                        {genre.name.toUpperCase()}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Movie Results */}
          <div className="lg:col-span-3">
            {/* Featured Movie */}
            {
              movies.length > 0 && (
                <div className="mb-8">
              <div className="relative rounded-lg overflow-hidden bg-card/50 border border-border/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  <div>
                    <img
                      src={movies[0].image}
                      alt="Featured Movie"
                      className="w-full h-64 object-cover rounded"
                    />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">{movies[0].title}</h2>
                    <p className="text-muted-foreground">
                      {movies[0].description || "No description available."}
                    </p>
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => window.open(movies[0].trailerUrl, '_blank')}
                      >
                        🎬 Watch Trailer
                      </Button>
                      <Button
                        className="bg-gradient-accent hover:shadow-glow"
                        onClick={() => handleBookTicket(movies[0].id)}
                      >
                        BOOK TICKET
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              )
            }


            {/* Movie Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onBookTicket={handleBookTicket}
                  onViewDetails={(id) => navigate(getPath(`/movies/${id}`))}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
