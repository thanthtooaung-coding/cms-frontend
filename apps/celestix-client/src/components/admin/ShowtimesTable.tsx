import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTenantPath } from "@/hooks/useTenantPath";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { FilterPopover } from "@/components/FilterPopover";
import { fetchWithAuth } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const StatusBadge = ({ status }: { status: string }) => {
  const variants: { [key: string]: string } = {
    Available: "bg-green-500/20 text-green-400 border-green-500/30",
    "Sold Out": "bg-red-500/20 text-red-400 border-red-500/30",
    Cancelled: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };
  return <Badge className={`${variants[status]} border`}>{status}</Badge>;
};

export const ShowtimesTable = () => {
  const navigate = useNavigate();
  const { getPath } = useTenantPath();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string[]>>({
    status: [],
  });
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [isSchedulerDialogOpen, setIsSchedulerDialogOpen] = useState(false);
  const [schedulerMinutes, setSchedulerMinutes] = useState("");
  const [isConfirmFixDialogOpen, setIsConfirmFixDialogOpen] = useState(false);
  const [conflictingShowtimes, setConflictingShowtimes] = useState<any[]>([]);
  const itemsPerPage = 12;

  const fetchShowtimes = async () => {
    try {
      const response = await fetchWithAuth("/showtimes");
      if (response.ok) {
        const data = await response.json();
        setShowtimes(data.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch showtimes.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching showtimes.",
        variant: "destructive",
      });
    }
  };

  const fetchSchedulerMinutes = async () => {
    try {
      const response = await fetchWithAuth("/configurations/SHOWTIME_SCHEDULER_MINUTES");
      if (response.ok) {
        const data = await response.json();
        setSchedulerMinutes(data.data.value);
      }
    } catch (error) {
        toast({
            title: "Warning",
            description: "Could not fetch scheduler configuration.",
            variant: "default",
          });
    }
  };

  useEffect(() => {
    fetchShowtimes();
    fetchSchedulerMinutes();
  }, []);

  const updateConfiguration = async () => {
    try {
        const response = await fetchWithAuth("/configurations/SHOWTIME_SCHEDULER_MINUTES", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: schedulerMinutes }),
        });
        if (response.ok) {
            toast({ title: "Success", description: "Showtime scheduler updated successfully." });
            setIsSchedulerDialogOpen(false);
        } else {
            const errorData = await response.json();
            toast({ title: "Error", description: (errorData as any).message || "Failed to update scheduler.", variant: "destructive" });
        }
    } catch (error) {
        toast({ title: "Error", description: "An error occurred while updating the scheduler.", variant: "destructive" });
    }
  };

  const handleConfirmFix = async () => {
      try {
          const response = await fetchWithAuth("/configurations/SHOWTIME_SCHEDULER_MINUTES/update-and-fix", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ value: schedulerMinutes }),
          });
          if (response.ok) {
              toast({ title: "Success", description: "Scheduler updated and conflicting showtimes have been adjusted." });
              setTimeout(() => {
                setIsConfirmFixDialogOpen(false);
                setIsSchedulerDialogOpen(false);
                setConflictingShowtimes([]);
              }, 100);
              window.location.reload();
              fetchShowtimes();
          } else {
              const errorData = await response.json();
              toast({ title: "Error", description: (errorData as any).message || "Failed to fix and update.", variant: "destructive" });
          }
      } catch (error) {
          toast({ title: "Error", description: "An error occurred during the fix and update process.", variant: "destructive" });
      }
  };

  const handleUpdateSchedulerMinutes = async () => {
    try {
      const checkResponse = await fetchWithAuth(`/showtimes/check-conflicts?newInterval=${schedulerMinutes}`);
      if (!checkResponse.ok) {
          const errorData = await checkResponse.json();
          throw new Error((errorData as any).message || "Failed to check for showtime conflicts.");
      }
      const conflicts = await checkResponse.json();

      if (conflicts.data && conflicts.data.length > 0) {
        setConflictingShowtimes(conflicts.data);
        setIsConfirmFixDialogOpen(true);
      } else {
        await updateConfiguration();
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "An error occurred.", variant: "destructive" });
    }
  };


  const handleDelete = async (id: string) => {
    try {
      const response = await fetchWithAuth(`/showtimes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Showtime Deleted",
          description: "Showtime has been successfully deleted.",
        });
        fetchShowtimes();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: (errorData as any).message || "Failed to delete showtime.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the showtime.",
        variant: "destructive",
      });
    }
  };

  const filteredShowtimes = showtimes
    .filter(
      (showtime) =>
        showtime.movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        showtime.theater.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (showtime) =>
        filters.status.length === 0 || filters.status.includes(showtime.status)
    );

  const totalPages = Math.ceil(filteredShowtimes.length / itemsPerPage);

  const filterSections = [
    { title: "By Status", stateKey: "status", options: ["Available"] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Showtimes</h1>
        <div className="flex items-center gap-4">
            <Dialog open={isSchedulerDialogOpen} onOpenChange={setIsSchedulerDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">Manage Scheduler</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Manage Showtime Scheduler</DialogTitle>
                    <DialogDescription>
                    Set the minute interval for creating showtimes and sending reminders.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Input
                    type="number"
                    value={schedulerMinutes}
                    onChange={(e) => setSchedulerMinutes(e.target.value)}
                    placeholder="Enter minute interval"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsSchedulerDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateSchedulerMinutes}>Save Changes</Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
            <Button
            className="bg-gradient-accent hover:shadow-glow transition-all duration-300"
            onClick={() => navigate(getPath("/admin/showtimes/add"))}
            >
            <Plus className="w-4 h-4 mr-2" />
            New Showtime
            </Button>
        </div>
      </div>

      <Card className="glass-card p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search Showtimes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-secondary/50 border-border/50"
            />
          </div>
          <FilterPopover
            filterSections={filterSections}
            selectedFilters={filters}
            onFilterChange={setFilters}
          />
        </div>
      </Card>

      <Card className="glass-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-muted-foreground font-medium">Movie ↕</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Theater</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Date</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Time</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Seats Available</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShowtimes.map((showtime) => (
                <tr
                  key={showtime.id}
                  className="border-b border-border/30 hover:bg-secondary/30 transition-colors"
                >
                  <td className="p-4 font-medium text-foreground">{showtime.movie.title}</td>
                  <td className="p-4 text-muted-foreground">{showtime.theater.name}</td>
                  <td className="p-4 text-muted-foreground">{showtime.showtimeDate}</td>
                  <td className="p-4 text-muted-foreground">{`${showtime.showtimeTime}`}</td>
                  <td className="p-4 text-muted-foreground">{showtime.seatsAvailable}</td>
                  <td className="p-4">
                    <StatusBadge status={showtime.status} />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"
                        onClick={() => navigate(getPath(`/admin/showtimes/edit/${showtime.id}`))}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(showtime.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-border/50">
          <div className="text-sm text-muted-foreground">
            Rows per page: {itemsPerPage} | 1-{filteredShowtimes.length} of{" "}
            {showtimes.length}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}
              className="text-muted-foreground">←</Button>
            <Button variant="ghost" size="icon" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}
              className="text-muted-foreground">→</Button>
          </div>
        </div>
      </Card>
      
      <AlertDialog open={isConfirmFixDialogOpen} onOpenChange={setIsConfirmFixDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Resolve Showtime Conflicts?</AlertDialogTitle>
              <AlertDialogDescription asChild>
                  <div>
                    Changing the interval to {schedulerMinutes} minutes will make the following unbooked showtimes invalid. Do you want to automatically adjust them to the nearest valid time?
                    <Card className="mt-4 p-4 max-h-48 overflow-y-auto">
                        <ul className="space-y-2 text-sm">
                            {conflictingShowtimes.map((st, index) => (
                                <li key={index}>
                                    <strong>{st.movieTitle}</strong> at {st.theaterName}
                                    <br />
                                    <span className="text-muted-foreground">{st.showtimeDate} @ {st.showtimeTime}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                  </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setTimeout(() => {
                    setConflictingShowtimes([]);
                    setIsConfirmFixDialogOpen(false);
                    window.location.reload();
                  }, 100);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmFix}>
                  Yes, Fix Them
              </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

