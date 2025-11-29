import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar, MapPin, Edit3, Trash2 } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useToast } from "@/components/ui/use-toast";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { getPath } = useTenantPath();
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [completedBookings, setCompletedBookings] = useState<any[]>([]);
  const [user, setUser] = useState({ name: "", email: "", profileUrl: "" });
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [foodOrders, setFoodOrders] = useState<any[]>([]);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchWithAuth("/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    const fetchBookings = async () => {
      try {
        const response = await fetchWithAuth("/auth/me/bookings");
        if (response.ok) {
          const data = await response.json();
          setUpcomingBookings(data.data.upcoming);
          setCompletedBookings(data.data.completed);
        }
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      }
    };
    const fetchFoodOrders = async () => {
      try {
        const response = await fetchWithAuth("/food-orders/me");
        if (response.ok) {
          const data = await response.json();
          setFoodOrders(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch food orders", error);
      }
    };
    fetchUser();
    fetchBookings();
    fetchFoodOrders()
  }, []);

  const handleCancelBooking = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setIsCancelDialogOpen(true);
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;

    try {
      const response = await fetchWithAuth(
        `/bookings/${bookingToCancel}/cancel`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        // Move the cancelled booking to completedBookings
        const cancelledBooking = upcomingBookings.find(b => b.id === bookingToCancel);
        if(cancelledBooking){
            cancelledBooking.status = "Cancelled";
            setCompletedBookings(prev => [cancelledBooking, ...prev]);
        }

        setUpcomingBookings((prev) =>
          prev.filter((booking) => booking.id !== bookingToCancel)
        );
        toast({
          title: "Success",
          description: "Booking cancelled successfully.",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to cancel booking.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsCancelDialogOpen(false);
      setBookingToCancel(null);
    }
  };

  const handleRequestRefund = async (bookingId: string) => {
    try {
      const response = await fetchWithAuth(`/refunds/request/${bookingId}`, {
        method: "POST",
      });
      if (response.ok) {
        toast({
          title: "Refund Requested",
          description: "Your refund request has been submitted successfully.",
        });
        setCompletedBookings(prev => 
            prev.map(b => 
                b.id === bookingId ? { ...b, refundStatus: 'PENDING' } : b
            )
        );
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to request refund.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while requesting the refund.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-cinema">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

            <Tabs defaultValue="bookings" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-card/50 border-border/50">
                <TabsTrigger
                  value="bookings"
                  className="text-white data-[state=active]:bg-primary"
                >
                  Bookings
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="text-white data-[state=active]:bg-primary"
                >
                  History
                </TabsTrigger>
                <TabsTrigger value="food_orders" className="text-white data-[state=active]:bg-primary">
                  Food Orders
                </TabsTrigger>
                <TabsTrigger
                  value="profile"
                  className="text-white data-[state=active]:bg-primary"
                >
                  Profile Info
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bookings" className="mt-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Upcoming Bookings
                  </h2>
                  {upcomingBookings.length > 0 ? (
                    upcomingBookings.map((booking) => (
                      <Card
                        key={booking.id}
                        className="bg-card/50 border-border/50 p-6"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {booking.movieTitle}
                            </h3>
                            <div className="flex items-center gap-4 text-muted-foreground mt-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {booking.showtimeDate} at {booking.showtimeTime}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{booking.theaterName}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Seats</p>
                            <div className="flex gap-1 mt-1">
                              {booking.seats.split(",").map((seat: any) => (
                                <Badge
                                  key={seat}
                                  variant="outline"
                                  className="text-white border-white/20"
                                >
                                  {seat}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                        </div>

                        <div className="mt-4 pt-4 border-t border-border/50">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Total Amount
                            </span>
                            <span className="text-lg font-semibold text-accent">
                              {booking.totalAmount} Ks
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground">You have no upcoming bookings.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Booking History
                  </h2>
                  {completedBookings.length > 0 ? (
                    completedBookings.map((booking) => (
                      <Card
                        key={booking.id}
                        className="bg-card/50 border-border/50 p-6 opacity-80"
                      >
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-white">
                            {booking.movieTitle}
                          </h3>
                          <div className="flex items-center gap-4 text-muted-foreground mt-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {booking.showtimeDate} at {booking.showtimeTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{booking.theaterName}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex gap-1">
                            {booking.seats.split(",").map((seat: any) => (
                              <Badge
                                key={seat}
                                variant="outline"
                                className="text-white border-white/20"
                              >
                                {seat}
                              </Badge>
                            ))}
                          </div>
                          {booking.status === "Confirmed" ? (
                            <Badge className="bg-green-600 text-white">
                              {booking.status}
                            </Badge>
                          ) : booking.status === "Cancelled" ? (
                              <div className="flex items-center gap-2">
                                  <Badge className="bg-red-600 text-white">
                                      {booking.status}
                                  </Badge>
                                  {booking.refundStatus !== 'PENDING' && (
                                      <Button
                                      size="sm"
                                      onClick={() => handleRequestRefund(booking.id)}
                                      disabled={booking.isAlreadyRequestRefund || booking.refundStatus === 'PENDING'}
                                      >
                                      {booking.isAlreadyRequestRefund || booking.refundStatus === 'PENDING' ? "Refund Requested" : "Request Refund"}
                                      </Button>
                                  )}
                              </div>
                          ) : (
                            <Badge className="bg-gray-600 text-white">
                              {booking.status}
                            </Badge>
                          )}
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground">You have no past bookings.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="food_orders" className="mt-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    My Food & Beverage Orders
                  </h2>
                  {foodOrders.length > 0 ? (
                    foodOrders.map((order) => (
                      <Card key={order.id} className="bg-card/50 border-border/50 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              Order #{order.id}
                            </h3>
                            <div className="flex items-center gap-2 text-muted-foreground mt-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(order.orderDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Badge className={order.paymentStatus === 'SUCCESS' ? 'bg-green-600' : 'bg-red-600'}>
                            {order.paymentStatus}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span className="text-white">{item.quantity}x {item.itemName}</span>
                              <span className="text-muted-foreground">{(item.price * item.quantity).toFixed(2)} Ks</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-border/50">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Total Amount
                            </span>
                            <span className="text-lg font-semibold text-accent">
                              {order.totalPrice.toFixed(2)} Ks
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground">You have no past food orders.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="profile" className="mt-6">
                <Card className="bg-card/50 border-border/50 p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={user.profileUrl} />
                      <AvatarFallback>
                        <User className="w-8 h-8 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {user.name}
                      </h2>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={user.name}
                        className="w-full px-3 py-2 bg-background/50 border border-border/50 rounded-md text-white"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        className="w-full px-3 py-2 bg-background/50 border border-border/50 rounded-md text-white"
                        readOnly
                      />
                    </div>
                  </div>

                  <Button
                    className="mt-6 bg-gradient-accent hover:shadow-glow"
                    onClick={() => navigate(getPath("/edit-profile"))}
                  >
                    Edit Profile
                  </Button>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to cancel?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will cancel your booking.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBookingToCancel(null)}>
              Back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelBooking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};