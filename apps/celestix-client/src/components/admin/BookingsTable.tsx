import { useEffect, useState } from "react";
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
// Import DropdownMenu components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
// Added MoreHorizontal icon for the actions menu
import { Search, Trash2, Armchair, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchWithAuth } from "@/lib/api";
import { FilterPopover } from "../FilterPopover";

const StatusBadge = ({ status }: { status: string }) => {
  const variants: { [key: string]: string } = {
    Confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
    Cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return <Badge className={`${variants[status]} border`}>{status}</Badge>;
};

const PaymentStatusBadge = ({ status }: { status: string }) => {
  const variants: { [key: string]: string } = {
    Success: "bg-green-500/20 text-green-400 border-green-500/30",
    Failed: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return <Badge className={`${variants[status]} border`}>{status}</Badge>;
};

export const BookingsTable = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string[]>>({ status: [] });
  const itemsPerPage = 12;

  // State for all dialogs
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSeatsDialogOpen, setIsSeatsDialogOpen] = useState(false);
  const [isShowtimeDialogOpen, setIsShowtimeDialogOpen] = useState(false);
  const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);
  const [isCancellationDialogOpen, setIsCancellationDialogOpen] = useState(false);
  const [bookingLimit, setBookingLimit] = useState("");
  const [cancellationMinutes, setCancellationMinutes] = useState("");
  
  // State to hold the booking object for the selected row
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  // State to hold only the ID for deletion confirmation
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetchWithAuth("/bookings");
        if (response.ok) {
          const data = await response.json();
          setBookings(data.data);
        } else {
          toast({ title: "Error", description: "Failed to fetch bookings.", variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Error", description: "An error occurred while fetching bookings.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    const fetchBookingLimit = async () => {
      try {
        const response = await fetchWithAuth("/configurations/MAX_BOOKINGS_PER_USER");
        if (response.ok) {
          const data = await response.json();
          setBookingLimit(data.data.value);
        }
      } catch (error) {
          console.error("Failed to fetch booking limit", error);
      }
    };

    const fetchCancellationMinutes = async () => {
        try {
            const response = await fetchWithAuth("/configurations/CANCELLATION_MINUTES");
            if (response.ok) {
                const data = await response.json();
                setCancellationMinutes(data.data.value);
            }
        } catch (error) {
            console.error("Failed to fetch cancellation minutes", error);
        }
    };
    fetchBookings();
    fetchBookingLimit();
    fetchCancellationMinutes();
  }, [toast]);

  const handleDelete = async (bookingId: string) => {
    // Delete logic remains the same
    try {
      const response = await fetchWithAuth(`/bookings/${bookingId}`, { method: "DELETE" });
      if (response.ok) {
        setBookings((prevBookings) => prevBookings.filter((b) => b.id !== bookingId));
        toast({ title: "Success", description: "Booking deleted successfully." });
      } else {
        const errorData = await response.json();
        toast({ title: "Error", description: errorData.message || "Failed to delete booking.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred while deleting the booking.", variant: "destructive" });
    } finally {
      setIsDeleteDialogOpen(false);
      setBookingToDelete(null);
    }
  };

  const handleUpdateLimit = async () => {
    try {
      const response = await fetchWithAuth("/configurations/MAX_BOOKINGS_PER_USER", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: bookingLimit }),
      });
      if (response.ok) {
        toast({ title: "Success", description: "Booking limit updated successfully." });
        setIsLimitDialogOpen(false);
      } else {
        toast({ title: "Error", description: "Failed to update booking limit.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred while updating the limit.", variant: "destructive" });
    }
  };

    const handleUpdateCancellationMinutes = async () => {
        try {
            const response = await fetchWithAuth("/configurations/CANCELLATION_MINUTES", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value: cancellationMinutes }),
            });
            if (response.ok) {
                toast({ title: "Success", description: "Cancellation time updated successfully." });
                setIsCancellationDialogOpen(false);
            } else {
                toast({ title: "Error", description: "Failed to update cancellation time.", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "An error occurred while updating the cancellation time.", variant: "destructive" });
        }
    };

  const filteredBookings = bookings
    .filter((b) =>
        (b.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (b.theaterName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (b.bookingId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (b.movieTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )
    .filter((b) => filters.status.length === 0 || filters.status.includes(b.status));

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const filterSections = [{ title: "By Booking Status", stateKey: "status", options: ["Confirmed", "Cancelled"] }];

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
          <div className="flex gap-2">
            <Dialog open={isLimitDialogOpen} onOpenChange={setIsLimitDialogOpen}>
                <DialogTrigger asChild>
                <Button>Manage Booking Limit</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Manage Booking Limit</DialogTitle>
                    <DialogDescription>
                    Set the maximum number of bookings a user can have.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Input
                    type="number"
                    value={bookingLimit}
                    onChange={(e) => setBookingLimit(e.target.value)}
                    placeholder="Enter booking limit"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsLimitDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateLimit}>Save Changes</Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isCancellationDialogOpen} onOpenChange={setIsCancellationDialogOpen}>
                <DialogTrigger asChild>
                    <Button>Manage Cancellation Time</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Manage Cancellation Time</DialogTitle>
                        <DialogDescription>
                            Set the time in minutes before a showtime that a user can cancel their booking.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            type="number"
                            value={cancellationMinutes}
                            onChange={(e) => setCancellationMinutes(e.target.value)}
                            placeholder="Enter cancellation minutes"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCancellationDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateCancellationMinutes}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="glass-card p-4">
          <div className="flex items-center justify-between space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by Customer, Theater, or Movie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-secondary/50 border-border/50"
              />
            </div>
            <FilterPopover filterSections={filterSections} selectedFilters={filters} onFilterChange={setFilters} />
          </div>
        </Card>

        <Card className="glass-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">                  
                  <th className="text-left p-4 text-muted-foreground font-medium">Booking ID</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Customer</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Theater Name</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Movie</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Date & Time</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Seats</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Amount</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Payment</th>
                  <th className="text-right p-4 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => {
                  const seatsArray = b.seats ? b.seats.split(',').map((s: string) => s.trim()) : [];
                  return (
                    <tr key={b.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">                      
                      <td className="p-4 text-muted-foreground">{b.bookingId}</td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-foreground">{b.customerName}</div>
                          <div className="text-sm text-muted-foreground">{b.customerEmail}</div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{b.theaterName}</td>
                      <td className="p-4 text-muted-foreground">{b.movieTitle}</td>
                      <td className="p-4 text-muted-foreground">
                        <div>{b.bookingDate}</div>
                        <div className="text-sm">{b.bookingTime}</div>
                      </td>
                      <td className="p-4 text-muted-foreground">
                         <Button
                            variant="link"
                            className="p-0 h-auto font-normal text-muted-foreground hover:text-primary justify-start"
                            onClick={() => { setSelectedBooking(b); setIsSeatsDialogOpen(true); }}
                         >
                            {seatsArray.length > 5 ? (
                              <div className="flex items-center gap-2">
                                <span>{`${seatsArray.length} seats`}</span>
                                <Armchair className="w-4 h-4" />
                              </div>
                            ) : ( b.seats || 'N/A' )}
                         </Button>
                      </td>
                      <td className="p-4 text-foreground font-medium">{b.totalAmount ? `$${b.totalAmount}` : 'N/A'}</td>
                      <td className="p-4"><StatusBadge status={b.status} /></td>
                      <td className="p-4"><PaymentStatusBadge status={b.paymentStatus} /></td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() => {
                                setTimeout(() => {
                                  setSelectedBooking(b);
                                  setIsShowtimeDialogOpen(true);
                                }, 100);
                              }}
                            >
                              View Showtime Details
                            </DropdownMenuItem>
                            {/* <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                              onSelect={() => {
                                setTimeout(() => {
                                  setBookingToDelete(b.id);
                                  setIsDeleteDialogOpen(true);
                                }, 100);
                              }}
                            >
                              Delete Booking
                            </DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              Rows per page: {itemsPerPage} | 1-{filteredBookings.length} of{" "}
              {bookings.length}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="text-muted-foreground"
              >
                ←
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="text-muted-foreground"
              >
                →
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* --- DIALOGS --- */}

      {/* View Seats Dialog */}
      <Dialog open={isSeatsDialogOpen} onOpenChange={(open) => { setIsSeatsDialogOpen(open); if (!open) setSelectedBooking(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Seats for {selectedBooking?.movieTitle}</DialogTitle>
            <DialogDescription>Booked by {selectedBooking?.customerName}.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap gap-2 pt-4">
            {selectedBooking?.seats?.split(',').map((seat: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-base">{seat.trim()}</Badge>
            )) || <p className="text-sm text-muted-foreground">No seats information.</p>}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* View Showtime Details Dialog */}
      <Dialog open={isShowtimeDialogOpen} onOpenChange={(open) => { setIsShowtimeDialogOpen(open); if (!open) setSelectedBooking(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Showtime Details</DialogTitle>
            <DialogDescription>Full showtime information for this booking.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-sm">
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-muted-foreground">Movie</span>
              <span className="col-span-2 font-semibold">{selectedBooking?.movieTitle}</span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-muted-foreground">Theater</span>
              <span className="col-span-2">{selectedBooking?.theaterName}</span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-muted-foreground">Show Date</span>
              <span className="col-span-2">{selectedBooking?.showtimeDate}</span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-muted-foreground">Show Time</span>
              <span className="col-span-2">{selectedBooking?.showtimeTime}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the booking record from the servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBookingToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (bookingToDelete) handleDelete(bookingToDelete); }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
