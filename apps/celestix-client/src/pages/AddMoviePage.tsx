import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { fetchWithAuth } from "@/lib/api";

export const AddMoviePage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [movieData, setMovieData] = useState({
        title: "",
        duration: "",
        genre: [] as string[],
        rating: "",
        description: "",
        releaseDate: "",
        director: "",
        cast: "",
        trailerUrl: "",
        language: "",
        status: ""
    });

    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);
    const [genreOptions, setGenreOptions] = useState<any[]>([]);
    const [templateData, setTemplateData] = useState<any>({
        ratingOptions: [],
        languageOptions: [],
        statusOptions: []
    });

    useEffect(() => {
        const fetchInitialData = async () => {
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
                    const templateData = await templateResponse.json();
                    setTemplateData(templateData.data);
                } else {
                    console.error("Failed to fetch movie template");
                }
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };

        fetchInitialData();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPosterFile(file);
            setPosterPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let moviePosterUrl = "";

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
                    moviePosterUrl = mediaData.data.url;
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
            moviePosterUrl,
            genreIds: movieData.genre.map(genreName => {
                const selectedGenre = genreOptions.find(g => g.name === genreName);
                return selectedGenre ? selectedGenre.id : null;
            }).filter(id => id !== null)
        };
        try {
            const response = await fetchWithAuth("/movies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(moviePayload),
            });

            if (response.ok) {
                toast({
                    title: "Movie Added",
                    description: "New movie has been successfully added.",
                });
                navigate(-1);
            } else {
                const errorData = await response.json();
                toast({
                    title: "Error",
                    description: errorData.message || "Failed to add movie.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occurred while adding the movie.",
                variant: "destructive",
            });
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setMovieData(prev => ({ ...prev, [field]: value }));
    };

    const handleGenreChange = (newGenres: string[]) => {
        setMovieData(prev => ({ ...prev, genre: newGenres }));
    };

    return (
        <div className="min-h-screen bg-gradient-primary">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <ArrowLeft
                        className="w-6 h-6 text-foreground mr-4 cursor-pointer"
                        onClick={() => navigate(-1)}
                    />
                    <h1 className="text-2xl font-bold text-foreground">Add New Movie</h1>
                </div>

                <Card className="p-6 bg-card/50 border-border/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Movie Title */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Movie Title *
                                </label>
                                <Input
                                    value={movieData.title}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                    placeholder="Enter movie title"
                                    required
                                />
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Duration *
                                </label>
                                <Input
                                    value={movieData.duration}
                                    onChange={(e) => handleInputChange("duration", e.target.value)}
                                    placeholder="e.g., 2h 30m"
                                    required
                                />
                            </div>

                            {/* Genre */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Genre *
                                </label>
                                <MultiSelect
                                    options={genreOptions}
                                    selected={movieData.genre}
                                    onChange={handleGenreChange}
                                    placeholder="Select genres..."
                                />
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Rating
                                </label>
                                <Select value={movieData.rating} onValueChange={(value) => handleInputChange("rating", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select rating" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {templateData.ratingOptions.map((option: any) => (
                                            <SelectItem key={option.id} value={option.name}>{option.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Release Date */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Release Date *
                                </label>
                                <Input
                                    type="date"
                                    value={movieData.releaseDate}
                                    min={new Date().toLocaleDateString('en-CA')}
                                    onChange={(e) => handleInputChange("releaseDate", e.target.value)}
                                    required
                                />
                            </div>

                            {/* Language */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Language
                                </label>
                                <Select value={movieData.language} onValueChange={(value) => handleInputChange("language", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {templateData.languageOptions.map((option: any) => (
                                            <SelectItem key={option.id} value={option.name}>{option.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Director */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Director
                                </label>
                                <Input
                                    value={movieData.director}
                                    onChange={(e) => handleInputChange("director", e.target.value)}
                                    placeholder="Enter director name"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Status
                                </label>
                                <Select value={movieData.status} onValueChange={(value) => handleInputChange("status", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {templateData.statusOptions.map((option: any) => (
                                            <SelectItem key={option.id} value={option.name}>{option.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Cast */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Cast
                            </label>
                            <Input
                                value={movieData.cast}
                                onChange={(e) => handleInputChange("cast", e.target.value)}
                                placeholder="Enter main cast members (comma separated)"
                            />
                        </div>

                        {/* Trailer URL */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Trailer URL
                            </label>
                            <Input
                                value={movieData.trailerUrl}
                                onChange={(e) => handleInputChange("trailerUrl", e.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Description
                            </label>
                            <Textarea
                                value={movieData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                placeholder="Enter movie description"
                                rows={4}
                            />
                        </div>

                        {/* Movie Poster Upload */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Movie Poster
                            </label>
                            <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center">
                                <Input type="file" onChange={handleFileChange} className="hidden" id="poster-upload" />
                                <label htmlFor="poster-upload" className="cursor-pointer">
                                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground mb-2">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        PNG, JPG, GIF up to 10MB
                                    </p>
                                </label>
                                {posterPreview && <img src={posterPreview} alt="Poster Preview" className="mt-4 mx-auto h-32" />}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-gradient-accent text-background">
                                Add Movie
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};