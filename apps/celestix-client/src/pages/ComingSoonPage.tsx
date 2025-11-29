

interface ComingSoonPageProps {
  onPageChange: (page: string, movieId?: string) => void;
  isAuthenticated: boolean;
}

export const ComingSoonPage = ({ onPageChange, isAuthenticated }: ComingSoonPageProps) => {
  const comingSoonMovies = [
    {
      id: "5",
      title: "Avatar: The Way of Water",
      image: "/lovable-uploads/avatar2.jpg",
      duration: "192 min",
      rating: 8.1,
      genre: "Sci-Fi",
      releaseDate: "Dec 16, 2022",
      ageRating: "PG-13"
    },
    {
      id: "6",
      title: "Black Panther: Wakanda Forever",
      image: "/lovable-uploads/blackpanther2.jpg",
      duration: "161 min",
      rating: 7.3,
      genre: "Action",
      releaseDate: "Nov 11, 2022",
      ageRating: "PG-13"
    },
    {
      id: "7",
      title: "Fast X",
      image: "/lovable-uploads/fastx.jpg",
      duration: "141 min",
      rating: 5.8,
      genre: "Action",
      releaseDate: "May 19, 2023",
      ageRating: "PG-13"
    },
    {
      id: "8",
      title: "Indiana Jones 5",
      image: "/lovable-uploads/indiana5.jpg",
      duration: "154 min",
      rating: 6.5,
      genre: "Adventure",
      releaseDate: "Jun 30, 2023",
      ageRating: "PG-13"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-cinema">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Coming Soon</h1>
          <p className="text-muted-foreground">Get ready for these upcoming blockbusters</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {comingSoonMovies.map((movie) => (
            <div key={movie.id} className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:shadow-glow transition-all duration-300">
              <div className="relative">
                <img 
                  src={movie.image} 
                  alt={movie.title}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 space-y-2">
                    <button 
                      onClick={() => onPageChange("details", movie.id)}
                      className="w-full bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg font-medium hover:bg-primary transition-colors"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => {
                        const trailerLinks: { [key: string]: string } = {
                          "5": "https://www.youtube.com/watch?v=d9MyW72ELq0", // Avatar: The Way of Water
                          "6": "https://www.youtube.com/watch?v=RlOB3UALvrQ", // Black Panther: Wakanda Forever
                          "7": "https://www.youtube.com/watch?v=32RAq6JzY-w", // Fast X
                          "8": "https://www.youtube.com/watch?v=ZVDUq_bxqaw"  // Indiana Jones 5
                        };
                        
                        const trailerUrl = trailerLinks[movie.id] || `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' trailer')}`;
                        window.open(trailerUrl, '_blank');
                      }}
                      className="w-full bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg font-medium hover:bg-secondary transition-colors"
                    >
                      Watch Trailer
                    </button>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                  {movie.ageRating}
                </div>
                <div className="absolute top-4 left-4 flex items-center space-x-1 bg-black/70 text-white px-2 py-1 rounded">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm font-medium">{movie.rating}</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1">{movie.title}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{movie.duration}</p>
                  <p>{movie.releaseDate}</p>
                  <p className="text-accent font-medium">{movie.genre}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};