import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { fetchWithAuth } from "@/lib/api";

export const AddShowtimePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showtimeData, setShowtimeData] = useState({
    movieId: "",
    theaterId: "",
    showtimeDate: "",
    showtimeTime: "",
  });
  const [templateData, setTemplateData] = useState({
    movies: [],
    theaters: [],
    statusOptions: [],
  });
  const [schedulerMinutes, setSchedulerMinutes] = useState(10);

  // Effect to fetch initial template data for dropdowns
  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        const response = await fetchWithAuth("/showtimes/template");
        if (response.ok) {
          const data = await response.json();
          setTemplateData(data.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch template data.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching template data.",
          variant: "destructive",
        });
      }
    };
    const fetchSchedulerMinutes = async () => {
        try {
          const response = await fetchWithAuth("/configurations/SHOWTIME_SCHEDULER_MINUTES");
          if (response.ok) {
            const data = await response.json();
            setSchedulerMinutes(parseInt(data.data.value, 10));
          }
        } catch (error) {
            // Fails silently, using the default of 10
        }
      };
    fetchTemplateData();
    fetchSchedulerMinutes();
  }, [toast]);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
        ...showtimeData
    };

    try {
      const response = await fetchWithAuth("/showtimes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Showtime Added",
          description: "New showtime has been successfully added.",
        });
        navigate(-1);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to add showtime.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while adding the showtime.",
        variant: "destructive",
      });
    }
  };

  // Generic input change handler
  const handleInputChange = (field: string, value: string) => {
    setShowtimeData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    const [, minutes] = time.split(':').map(Number);

    if (minutes % schedulerMinutes !== 0) {
      e.target.setCustomValidity(`Time must be in ${schedulerMinutes}-minute increments.`);
    } else {
      e.target.setCustomValidity("");
    }
    handleInputChange("showtimeTime", time);
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
          <h1 className="text-2xl font-bold text-foreground">
            Add New Showtime
          </h1>
        </div>

        <Card className="p-6 bg-card/50 border-border/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Movie */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Movie *
                </label>
                <Select
                  value={showtimeData.movieId}
                  onValueChange={(value) => handleInputChange("movieId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select movie" />
                  </SelectTrigger>
                  <SelectContent>
                    {templateData.movies.map((movie: any) => (
                      <SelectItem key={movie.id} value={movie.id.toString()}>
                        {movie.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Theater */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Theater *
                </label>
                <Select
                  value={showtimeData.theaterId}
                  onValueChange={(value) => handleInputChange("theaterId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theater" />
                  </SelectTrigger>
                  <SelectContent>
                    {templateData.theaters.map((theater: any) => (
                      <SelectItem key={theater.id} value={theater.id.toString()}>
                        {theater.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date *
                </label>
                <Input
                  type="date"
                  value={showtimeData.showtimeDate}
                  min={new Date().toLocaleDateString('en-CA')} // Prevents past dates
                  onChange={(e) =>
                    handleInputChange("showtimeDate", e.target.value)
                  }
                  required
                />
              </div>

              {/* Time */}
              <div>
                 <div className="flex items-center mb-2">
                    <label className="block text-sm font-medium text-foreground">
                    Time *
                    </label>
                    <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-muted-foreground ml-2 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                        <p>
                            Showtime intervals are based on the scheduler setting.
                            <br />
                            Current interval: <strong>Every {schedulerMinutes} minutes</strong>.
                        </p>
                        </TooltipContent>
                    </Tooltip>
                    </TooltipProvider>
                </div>
                <Input
                  type="time"
                  value={showtimeData.showtimeTime}
                  onChange={handleTimeChange}
                  step={schedulerMinutes * 60}
                  required
                />
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
              <Button
                type="submit"
                className="bg-gradient-accent text-background"
              >
                Add Showtime
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
