import { useEffect, useState } from "react";
import { MovieCard } from "@/components/movies/MovieCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Calendar, Clock, Film, VideoOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchApi } from "@/lib/api";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useAuthDataStore } from "@/store/auth-store";

interface HomePageProps {
  isAuthenticated?: boolean;
}

export const HomePage = ({ isAuthenticated }: HomePageProps) => {
  const [selectedCategory, setSelectedCategory] = useState("Now Showing");
  const navigate = useNavigate();
  const { getPath } = useTenantPath();
  const { user } = useAuthDataStore();
  const [movies, setMovies] = useState<any[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoadingMovies(true);
      try {
        const response = await fetchApi(`/public/movies?status=${selectedCategory.replace('now-playing', 'Now Showing').replace('coming-soon', 'Coming Soon')}`);
        if (response.ok) {
          const data = await response.json();
          setMovies(data.data);
        } else {
          console.error("Failed to fetch movies");
          setMovies([]);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]);
      } finally {
        setLoadingMovies(false);
      }
    };

    fetchMovies();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoadingSchedules(true);
      try {
        const response = await fetchApi("/public/showtimes/grouped");
        if (response.ok) {
          const data = await response.json();
          setSchedules(data.data);
        } else {
          console.error("Failed to fetch schedules");
          setSchedules([]);
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
        setSchedules([]);
      } finally {
        setLoadingSchedules(false);
      }
    };

    const fetchFeaturedMovie = async () => {
        try {
            const response = await fetchApi('/public/movies/popular');
            if (response.ok) {
                const data = await response.json();
                if (data.data && data.data.length > 0) {
                    setFeaturedMovie(data.data[0]);
                }
            } else {
                console.error("Failed to fetch featured movie");
            }
        } catch (error) {
            console.error("Error fetching featured movie:", error);
        }
    };

    fetchSchedules();
    fetchFeaturedMovie();
  }, []);


  const handleBookTicket = (movieId: string) => {
    // Check if user is authenticated using auth store or bms_token
    const isAuth = user !== null || localStorage.getItem("bms_token") !== null;
    if (isAuth) {
      navigate(getPath(`/booking/${movieId}`));
    } else {
      navigate(getPath("/login"));
    }
  };

  const formatTime = (timeString: string) => {
    const [hour, minute] = timeString.split(':');
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const formattedHour = hourNum % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const categories = [
    { id: "Now Showing", label: "Now Playing" },
    { id: "Coming Soon", label: "Coming Soon" }
  ];

  const NoMoviesAvailable = () => (
    <div className="text-center col-span-full py-12">
      <VideoOff className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold text-foreground">No Movies Found</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        There are currently no movies available in this category. Please check back later.
      </p>
    </div>
  );

  const NoSchedulesAvailable = () => (
    <div className="text-center bg-card/50 border border-border/50 rounded-lg p-8">
      <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold text-foreground">No Showtime Schedules</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        There are no showtimes available at the moment. Please check again soon.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-cinema">
      {/* Hero Section */}
      {featuredMovie && (
        <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={featuredMovie.moviePosterUrl || "/lovable-uploads/hero-bg.jpg"}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {featuredMovie.genres.map((genre: any) => (
                  <Badge key={genre.name} variant="secondary">{genre.name}</Badge>
                ))}
              </div>
              <h1 className="text-5xl font-bold text-foreground">{featuredMovie.title}</h1>
            </div>

            <p className="text-lg text-muted-foreground max-w-xl">
              {featuredMovie.description}
            </p>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{featuredMovie.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(featuredMovie.releaseDate).getFullYear()}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                size="lg"
                className="bg-gradient-accent hover:shadow-glow"
                onClick={() => window.open(featuredMovie.trailerUrl, '_blank')}
              >
                <Play className="w-5 h-5 mr-2" />
                🎬 Watch Trailer
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleBookTicket(featuredMovie.id)}
              >
                Book Tickets
              </Button>
            </div>
          </div>
        </div>
      </section>
      )}


      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Movies Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Movies</h2>
            <div className="flex space-x-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  onClick={() => {
                    setSelectedCategory(category.id);
                  }}
                  className={selectedCategory === category.id ? "bg-primary" : ""}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingMovies ? (
              <p>Loading movies...</p>
            ) : movies.length > 0 ? (
              movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={{
                    ...movie,
                    image: movie.moviePosterUrl,
                    genre: movie.genres.map((g: any) => g.name).join(', '),
                    ageRating: movie.rating,
                    status: movie.status
                  }}
                  onBookTicket={handleBookTicket}
                  onViewDetails={(id) => navigate(getPath(`/movies/${id}`))}
                />
              ))
            ) : (
              <NoMoviesAvailable />
            )}
          </div>
        </section>

        {/* Showtimes Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Showtime Schedules</h2>
          <div className="space-y-4">
          {loadingSchedules ? (
            <p>Loading schedules...</p>
          ) : schedules.length > 0 ? (
            schedules.map((schedule, index) =>
                schedule.theaters.map((theater: any, theaterIndex: number) => (
                  <div key={`${index}-${theaterIndex}`} className="bg-card/50 border border-border/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{theater.theater.name}</h3>
                        <p className="text-sm text-muted-foreground">{schedule.movie.title}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {theater.showtimes.map((showtime: any, timeIndex: number) => (
                          <Button
                            key={timeIndex}
                            variant="outline"
                            size="sm"
                            onClick={() => handleBookTicket(schedule.movie.id)}
                          >
                            {formatTime(showtime.showtimeTime)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )
          ) : (
            <NoSchedulesAvailable />
          )}
          </div>
        </section>
      </div>
    </div>
  );
};