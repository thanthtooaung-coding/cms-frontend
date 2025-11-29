import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, Calendar, Play, Heart } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useTenantPath } from "@/hooks/useTenantPath";

interface Movie {
  id: string;
  title: string;
  moviePosterUrl: string;
  duration: string;
  rating: string;
  genres: { name: string }[];
  releaseDate: string;
  description: string;
  director: string;
  movieCast: string;
  trailerUrl: string;
  status: string;
}

export const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPath } = useTenantPath();
  const [isLiked, setIsLiked] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (id) {
        try {
          const response = await fetchApi(`/public/movies/${id}`);
          if (response.ok) {
            const data = await response.json();
            setMovie(data.data);
          } else {
            console.error("Failed to fetch movie details");
          }
        } catch (error) {
          console.error("Error fetching movie details:", error);
        }
      }
    };

    fetchMovie();
  }, [id]);

  const handleWatchTrailer = () => {
    if (movie?.trailerUrl) {
      window.open(movie.trailerUrl, '_blank');
    }
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-cinema flex items-center justify-center">
        <p className="text-white text-2xl">Loading...</p>
      </div>
    );
  }

  const castList = movie.movieCast ? movie.movieCast.split(',').map(actor => actor.trim()) : [];

  return (
    <div className="min-h-screen bg-gradient-cinema">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(getPath("/"))}
          className="mb-6 text-white hover:bg-white/10"
        >
          ← Back to Home
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden bg-card/50 border-border/50">
              <img
                src={movie.moviePosterUrl}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
              />
            </Card>
          </div>

          {/* Movie Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold text-white">{movie.title}</h1>
                <Badge className="bg-primary text-primary-foreground">
                  {movie.rating}
                </Badge>
              </div>

              <div className="flex items-center gap-6 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-white font-semibold">{movie.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{movie.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{movie.releaseDate}</span>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <Button
                  className="bg-gradient-accent hover:shadow-glow"
                  onClick={() => navigate(getPath(`/booking/${movie.id}`))}
                  disabled={movie.status === "Coming Soon"}
                >
                  Book Tickets
                </Button>
                <Button
                  variant="outline"
                  className="text-white border-white/20 hover:bg-white/10"
                  onClick={handleWatchTrailer}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Trailer
                </Button>                
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Synopsis</h3>
              <p className="text-muted-foreground leading-relaxed">{movie.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Director</h3>
                <p className="text-muted-foreground">{movie.director}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Genre</h3>
                <p className="text-muted-foreground">
                  {movie.genres.map(g => g.name).join(', ')}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Cast</h3>
              <div className="flex flex-wrap gap-2">
                {castList.map((actor, index) => (
                  <Badge key={index} variant="outline" className="text-white border-white/20">
                    {actor}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};