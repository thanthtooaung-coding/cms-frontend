import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { fetchWithAuth } from "@/lib/api";

export const EditMoviePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [movieData, setMovieData] = useState({
        title: "",
        duration: "",
        genre: [] as string[],
        rating: "",
        releaseDate: "",
        language: "",
        director: "",
        status: "",
        cast: "",
        trailerUrl: "",
        description: "",
        moviePosterUrl: "",
    });

    // New state for handling the photo upload
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);

    const [genreOptions, setGenreOptions] = useState<any[]>([]);
    const [templateData, setTemplateData] = useState<any>({
        ratingOptions: [],
        languageOptions: [],
        statusOptions: []
    });

    useEffect(() => {
        const fetchMovieAndRelatedData = async () => {
            try {
                const [genresResponse, templateResponse] = await Promise.all([
                    fetchWithAuth("/movie-genres"),
                    fetchWithAuth("/movies/template")
                ]);

                if (genresResponse.ok) {
                    const genresData = await genresResponse.json();
                    setGenreOptions(genresData.data);
                } else {
                    console.error("Failed to fetch genres");
                }

                if (templateResponse.ok) {
                    const template = await templateResponse.json();
                    setTemplateData(template.data);
                } else {
                    console.error("Failed to fetch movie template");
                }

                if (id) {
                    const movieResponse = await fetchWithAuth(`/movies/${id}`);
                    if (movieResponse.ok) {
                        const movie = await movieResponse.json();
                        setMovieData({
                            ...movie.data,
                            genre: movie.data.genres.map((g: any) => g.name),
                            cast: movie.data.movieCast,
                        });
                        setPosterPreview(movie.data.moviePosterUrl);
                    } else {
                        console.error("Failed to fetch movie data");
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchMovieAndRelatedData();
    }, [id]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPosterFile(file);
            setPosterPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let newPosterUrl = movieData.moviePosterUrl;
        if (posterFile) {
            const formData = new FormData();
            formData.append("file", posterFile);

            try {
                const mediaResponse = await fetchWithAuth("/media", {
                    method: "POST",
                    body: formData,
                });

                if (mediaResponse.ok) {
                    const mediaData = await mediaResponse.json();
                    newPosterUrl = mediaData.data.url;
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to upload movie poster.",
                        variant: "destructive",
                    });
                    return;
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "An error occurred while uploading the poster.",
                    variant: "destructive",
                });
                return;
            }
        }

        const moviePayload = {
            ...movieData,
            movieCast: movieData.cast,
            moviePosterUrl: newPosterUrl,
            genreIds: movieData.genre.map(genreName => {
                const selectedGenre = genreOptions.find(g => g.name === genreName);
                return selectedGenre ? selectedGenre.id : null;
            }).filter(id => id !== null)
        };

        try {
            const response = await fetchWithAuth(`/movies/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(moviePayload),
            });

            if (response.ok) {
                toast({
                    title: "Movie Updated",
                    description: "Movie details have been successfully updated.",
                });
                navigate(-1);
            } else {
                const errorData = await response.json();
                toast({
                    title: "Error",
                    description: errorData.message || "Failed to update movie.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occurred while updating the movie.",
                variant: "destructive",
            });
        }
    };

    const handleInputChange = (field: string, value: string | string[]) => {
        setMovieData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-primary p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-2xl font-bold text-foreground">Edit Movie</h1>
                </div>

                <Card className="glass-card border-border/50">
                    <CardHeader>
                        <CardTitle className="text-foreground">Movie Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-foreground">Title</Label>
                                    <Input
                                        id="title"
                                        value={movieData.title}
                                        onChange={(e) => handleInputChange("title", e.target.value)}
                                        className="bg-secondary/50 border-border/50 text-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration" className="text-foreground">Duration</Label>
                                    <Input
                                        id="duration"
                                        value={movieData.duration}
                                        onChange={(e) => handleInputChange("duration", e.target.value)}
                                        className="bg-secondary/50 border-border/50 text-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="genre" className="text-foreground">Genre</Label>
                                    <MultiSelect
                                        options={genreOptions}
                                        selected={movieData.genre}
                                        onChange={(newGenres) => handleInputChange("genre", newGenres)}
                                        placeholder="Select genres..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rating" className="text-foreground">Rating</Label>
                                     <Select value={movieData.rating} onValueChange={(value) => handleInputChange("rating", value)}>
                                        <SelectTrigger className="bg-secondary/50 border-border/50 text-foreground">
                                            <SelectValue placeholder="Select rating" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {templateData.ratingOptions.map((option: any) => (
                                                <SelectItem key={option.id} value={option.name}>{option.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="releaseDate" className="text-foreground">Release Date</Label>
                                    <Input
                                        id="releaseDate"
                                        type="date"
                                        value={movieData.releaseDate}
                                        min={new Date().toLocaleDateString('en-CA')}
                                        onChange={(e) => handleInputChange("releaseDate", e.target.value)}
                                        className="bg-secondary/50 border-border/50 text-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="language" className="text-foreground">Language</Label>
                                    <Select value={movieData.language} onValueChange={(value) => handleInputChange("language", value)}>
                                        <SelectTrigger className="bg-secondary/50 border-border/50 text-foreground">
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {templateData.languageOptions.map((option: any) => (
                                                <SelectItem key={option.id} value={option.name}>{option.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="director" className="text-foreground">Director</Label>
                                    <Input
                                        id="director"
                                        value={movieData.director}
                                        onChange={(e) => handleInputChange("director", e.target.value)}
                                        className="bg-secondary/50 border-border/50 text-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status" className="text-foreground">Status</Label>
                                    <Select value={movieData.status} onValueChange={(value) => handleInputChange("status", value)}>
                                        <SelectTrigger className="bg-secondary/50 border-border/50 text-foreground">
                                            <SelectValue placeholder="Select status"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {templateData.statusOptions.map((option: any) => (
                                                <SelectItem key={option.id} value={option.name}>{option.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="cast" className="text-foreground">Cast</Label>
                                    <Input
                                        id="cast"
                                        value={movieData.cast}
                                        onChange={(e) => handleInputChange("cast", e.target.value)}
                                        placeholder="Leonardo DiCaprio, Marion Cotillard, Tom Hardy"
                                        className="bg-secondary/50 border-border/50 text-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="trailerUrl" className="text-foreground">Trailer URL</Label>
                                    <Input
                                        id="trailerUrl"
                                        value={movieData.trailerUrl}
                                        onChange={(e) => handleInputChange("trailerUrl", e.target.value)}
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="bg-secondary/50 border-border/50 text-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-foreground">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={movieData.description}
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                        rows={4}
                                        className="bg-secondary/50 border-border/50 text-foreground resize-none"
                                    />
                                </div>
                            </div>

                            {/* Movie Poster Upload */}
                            <div className="space-y-4">
                                <Label className="text-foreground">Movie Poster</Label>
                                <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-border transition-colors">
                                    <Input type="file" onChange={handleFileChange} className="hidden" id="poster-upload" />
                                    <label htmlFor="poster-upload" className="cursor-pointer block">
                                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground mb-2">Drop your poster here, or browse</p>
                                        <p className="text-sm text-muted-foreground">Supports: JPG, PNG (Max 10MB)</p>
                                    </label>
                                    {posterPreview && (
                                        <img
                                            src={posterPreview}
                                            alt="Poster Preview"
                                            className="mt-4 mx-auto h-32 w-auto object-contain rounded"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end space-x-4 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate(-1)}
                                    className="border-border/50 text-muted-foreground hover:text-foreground"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-gradient-accent text-background hover:opacity-90"
                                >
                                    Update Movie
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
