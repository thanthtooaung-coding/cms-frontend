import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, User, Calendar, Clock } from "lucide-react";
import { fetchApi, fetchWithAuth } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useTenantPath } from "@/hooks/useTenantPath";

// --- Type Definitions based on API Schema ---
interface Movie {
  id: number;
  title: string;
  duration: string;
  genres: { name: string }[];
  moviePosterUrl: string;
}

interface Theater {
  id: number;
  name: string;
  location: string;
  seatConfiguration: { row: number; column: number };
  premiumSeat: { totalRows: number; totalPrice: number };
  regularSeat: { totalRows: number; totalPrice: number };
  economySeat: { totalRows: number; totalPrice: number };
  basicSeat: { totalRows: number; totalPrice: number };
}

interface Showtime {
  id: number;
  showtimeTime: string;
  bookedSeats: string[];
}

interface GroupedShowtime {
  movie: { id: number; title: string };
  theaters: {
    theater: { id: number; name: string };
    showtimes: { id: number; showtimeDate: string; showtimeTime: string }[];
  }[];
}

interface UserProfile {
    id: number;
    name: string;
    email: string;
    role: string;
}

// --- Component ---
export const BookingPage = () => {
  const { id: movieId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPath } = useTenantPath();
  const { toast } = useToast();

  const [step, setStep] = useState<"cinema" | "seats" | "checkout">("cinema");
  const [loading, setLoading] = useState(true);
  
  // Data from API
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimesByTheater, setShowtimesByTheater] = useState<GroupedShowtime['theaters']>([]);
  const [selectedTheaterDetails, setSelectedTheaterDetails] = useState<Theater | null>(null);
  const [selectedShowtimeDetails, setSelectedShowtimeDetails] = useState<Showtime | null>(null);

  // User selections
  const [dates, setDates] = useState<{ date: string; day: string; isoDate: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedShowtime, setSelectedShowtime] = useState<{ theaterId: number; showtimeId: number; time: string } | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  // Checkout Form State
  const [contactInfo, setContactInfo] = useState({ name: '', email: '' });
  const [paymentInfo, setPaymentInfo] = useState({ cardNumber: '', expiry: '', cvc: '' });

  useEffect(() => {
    const generateDates = () => {
        const dateArray = [];
        const today = new Date();
        for (let i = 0; i < 3; i++) {
            const newDate = new Date(today);
            newDate.setDate(today.getDate() + i);
            dateArray.push({
                date: newDate.getDate().toString().padStart(2, '0'),
                day: newDate.toLocaleDateString('en-US', { weekday: 'short' }),
                // isoDate: newDate.toISOString().split('T')[0],
                isoDate: newDate.toLocaleDateString('en-CA')
            });
        }
        setDates(dateArray);
        setSelectedDate(dateArray[0].isoDate);
    };
    generateDates();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetchWithAuth('/auth/me');
        if (response.ok) {
          const userData = await response.json();
          const user: UserProfile = userData.data;
          setContactInfo({ name: user.name, email: user.email });
        } else {
          toast({
            title: "Error",
            description: "Could not fetch your user information.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching your details.",
          variant: "destructive",
        });
      }
    };

    if (step === 'checkout') {
      fetchUserInfo();
    }
  }, [step, toast]);

  useEffect(() => {
    if (!movieId) return;

    const fetchBookingData = async () => {
      setLoading(true);
      try {
        const [movieRes, showtimesRes] = await Promise.all([
          fetchApi(`/public/movies/${movieId}`),
          fetchApi(`/public/showtimes/grouped?retrieveAll=true`)
        ]);

        if (movieRes.ok) {
          const movieData = await movieRes.json();
          setMovie(movieData.data);
        } else {
          toast({ title: "Error", description: "Failed to load movie details.", variant: "destructive" });
        }
        
        if (showtimesRes.ok) {
            const showtimesData = await showtimesRes.json();
            const movieShowtimes = showtimesData.data.find((s: GroupedShowtime) => s.movie.id === parseInt(movieId));
            setShowtimesByTheater(movieShowtimes ? movieShowtimes.theaters : []);
        } else {
             toast({ title: "Error", description: "Failed to load showtimes.", variant: "destructive" });
        }

      } catch (error) {
        toast({ title: "Error", description: "An error occurred while fetching booking data.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [movieId, toast]);

  const handleSelectShowtime = async () => {
    if (!selectedShowtime) return;
    setLoading(true);
    try {
        const [theaterRes, showtimeRes] = await Promise.all([
            fetchWithAuth(`/theaters/${selectedShowtime.theaterId}`),
            fetchWithAuth(`/showtimes/${selectedShowtime.showtimeId}`)
        ]);

        if (theaterRes.ok) {
            const theaterData = await theaterRes.json();
            setSelectedTheaterDetails(theaterData.data);
        } else {
            toast({ title: "Error", description: "Failed to load theater details.", variant: "destructive" });
            setLoading(false);
            return;
        }

        if (showtimeRes.ok) {
            const showtimeData = await showtimeRes.json();
            setSelectedShowtimeDetails(showtimeData.data);
        } else {
            toast({ title: "Error", description: "Failed to load showtime details.", variant: "destructive" });
            setLoading(false);
            return;
        }
        setStep("seats");
    } catch (error) {
         toast({ title: "Error", description: "An error occurred.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };


  const getSeatInfo = (rowIndex: number) => {
    if (!selectedTheaterDetails) return { type: 'basic', price: 0, color: 'bg-gray-500' };
    const { premiumSeat, regularSeat, economySeat } = selectedTheaterDetails;
    if (rowIndex < premiumSeat.totalRows) {
        return { type: 'premium', price: premiumSeat.totalPrice, color: 'bg-purple-300 hover:bg-purple-300' };
    } else if (rowIndex < premiumSeat.totalRows + regularSeat.totalRows) {
        return { type: 'regular', price: regularSeat.totalPrice, color: 'bg-yellow-200 hover:bg-yellow-300' };
    } else if (rowIndex < premiumSeat.totalRows + regularSeat.totalRows + economySeat.totalRows) {
        return { type: 'economy', price: economySeat.totalPrice, color: 'bg-green-200 hover:bg-green-300' };
    }
    return { type: 'basic', price: selectedTheaterDetails.basicSeat.totalPrice, color: 'bg-blue-200 hover:bg-blue-300' };
  };

  const getSeatStatus = (seatId: string) => {
    if (selectedSeats.includes(seatId)) return "selected";
    if (selectedShowtimeDetails?.bookedSeats.includes(seatId)) return "reserved";
    return "available";
  };

  const handleSeatClick = (seatId: string) => {
    if (getSeatStatus(seatId) === "reserved") return;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const getSeatClass = (status: string, rowIndex: number) => {
    const { color } = getSeatInfo(rowIndex);
    if (status === "selected") return "bg-primary text-primary-foreground border-2 border-primary";
    if (status === "reserved") return "bg-muted text-muted-foreground cursor-not-allowed";
    return `${color} text-gray-600 border border-border cursor-pointer`;
  };

  const seatPrice = selectedSeats.reduce((sum, seat) => {
    const rowLetter = seat.charAt(0);
    const rowIndex = rowLetter.charCodeAt(0) - 'A'.charCodeAt(0);
    const { price } = getSeatInfo(rowIndex);
    return sum + price;
  }, 0);

  const handleBack = () => {
    if (step === "checkout") {
      setStep("seats");
    } else if (step === "seats") {
      setStep("cinema");
      setSelectedSeats([]);
      setSelectedTheaterDetails(null);
      setSelectedShowtimeDetails(null);
    } else {
      navigate(-1);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedShowtime) return;
    setLoading(true);
    try {
        const response = await fetchWithAuth('/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                showtimeId: selectedShowtime.showtimeId,
                seatNumbers: selectedSeats,
                cardDetails: {
                    cardNumber: paymentInfo.cardNumber,
                    expiryDate: paymentInfo.expiry,
                    cvc: paymentInfo.cvc
                }
            })
        });

        if (response.ok) {
            toast({ title: "Booking Successful!", description: "Your tickets have been confirmed." });
            navigate(getPath('/'));
        } else {
            const error = await response.json();
            toast({ title: "Booking Failed", description: error.message || "Could not complete your booking.", variant: "destructive" });
        }
    } catch (error) {
        toast({ title: "Error", description: "An error occurred during booking.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  const seatLayout = selectedTheaterDetails ? Array.from({ length: selectedTheaterDetails.seatConfiguration.row }, (_, i) => ({
      row: String.fromCharCode(65 + i),
      seats: Array.from({ length: selectedTheaterDetails.seatConfiguration.column }, (_, j) => `${String.fromCharCode(65 + i)}${j + 1}`)
  })) : [];
  
  if (loading || !movie) {
    return <div className="min-h-screen bg-gradient-cinema flex items-center justify-center text-white">Loading...</div>;
  }
  
  // --- RENDER ---
  if (step === "cinema") {
    const hasShowtimesForSelectedDate = showtimesByTheater.some(
        ({ showtimes }) => showtimes.some(st => st.showtimeDate === selectedDate)
    );

    return (
      <div className="min-h-screen bg-gradient-cinema">
        <div className="container mx-auto px-4 py-8 max-w-md">
          <div className="flex items-center mb-6">
            <ArrowLeft className="w-6 h-6 mr-4 cursor-pointer" onClick={handleBack} />
            <h1 className="text-xl font-bold">Showtimes</h1>
          </div>
          <Card className="p-4 mb-6 bg-card/50 border-border/50">
            <div className="flex space-x-4">
              <img src={movie.moviePosterUrl} alt={movie.title} className="w-16 h-20 rounded object-cover" />
              <div>
                <h2 className="font-bold">{movie.title}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs">{movie.duration}</Badge>
                  <Badge variant="outline" className="text-xs">{movie.genres.map(g => g.name).join(', ')}</Badge>
                </div>
              </div>
            </div>
          </Card>
          <div className="mb-6">
            <div className="flex justify-center space-x-4">
              {dates.map(({ date, day, isoDate }) => (
                <button key={date} onClick={() => { setSelectedDate(isoDate); setSelectedShowtime(null); }}
                  className={`px-4 py-3 rounded-lg text-center ${selectedDate === isoDate ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                  <div className="text-xl font-bold">{date}</div>
                  <div className="text-xs">{day}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            {hasShowtimesForSelectedDate ? (
                showtimesByTheater.map(({ theater, showtimes }) => {
                const relevantShowtimes = showtimes.filter(st => st.showtimeDate === selectedDate);
                if (relevantShowtimes.length === 0) return null;
                return (
                    <div key={theater.id} className="mb-4">
                    <h3 className="font-bold mb-2">{theater.name}</h3>
                    <div className="flex flex-wrap gap-2">
                        {relevantShowtimes.map(({ id, showtimeTime }) => (
                        <button key={id} onClick={() => setSelectedShowtime({ theaterId: theater.id, showtimeId: id, time: showtimeTime })}
                            className={`px-4 py-2 rounded-lg font-medium ${selectedShowtime?.showtimeId === id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                            {showtimeTime.substring(0, 5)}
                        </button>
                        ))}
                    </div>
                    </div>
                )
                })
            ) : (
                <Card className="p-4 mb-6 bg-card/50 border-border/50 text-center">
                    <p className="text-muted-foreground">No showtimes available for the selected date.</p>
                </Card>
            )}
          </div>
          <Button onClick={handleSelectShowtime} disabled={!selectedShowtime} className="w-full bg-gradient-accent hover:shadow-glow text-lg font-bold py-3">
            Select Seats
          </Button>
        </div>
      </div>
    );
  }

  if (step === "seats") {
    return (
      <div className="min-h-screen bg-gradient-cinema">
        <div className="container mx-auto px-4 py-8 max-w-md">
          <div className="flex items-center mb-6">
            <ArrowLeft className="w-6 h-6 mr-4 cursor-pointer" onClick={handleBack} />
            <h1 className="text-xl font-bold">{selectedTheaterDetails?.name}</h1>
          </div>
          {selectedTheaterDetails && (
            <div className="flex justify-center space-x-4 mb-4">
              {Object.entries(getSeatInfo(0)).length > 0 && <div className="text-center"><div className={`w-6 h-6 ${getSeatInfo(0).color.split(' ')[0]} rounded border mx-auto mb-1`} /><span className="text-xs text-muted-foreground">{getSeatInfo(0).price}KS</span></div>}
              {Object.entries(getSeatInfo(selectedTheaterDetails.premiumSeat.totalRows)).length > 0 && <div className="text-center"><div className={`w-6 h-6 ${getSeatInfo(selectedTheaterDetails.premiumSeat.totalRows).color.split(' ')[0]} rounded border mx-auto mb-1`} /><span className="text-xs text-muted-foreground">{getSeatInfo(selectedTheaterDetails.premiumSeat.totalRows).price}KS</span></div>}
              {Object.entries(getSeatInfo(selectedTheaterDetails.premiumSeat.totalRows + selectedTheaterDetails.regularSeat.totalRows)).length > 0 && <div className="text-center"><div className={`w-6 h-6 ${getSeatInfo(selectedTheaterDetails.premiumSeat.totalRows + selectedTheaterDetails.regularSeat.totalRows).color.split(' ')[0]} rounded border mx-auto mb-1`} /><span className="text-xs text-muted-foreground">{getSeatInfo(selectedTheaterDetails.premiumSeat.totalRows + selectedTheaterDetails.regularSeat.totalRows).price}KS</span></div>}
              {Object.entries(getSeatInfo(selectedTheaterDetails.premiumSeat.totalRows + selectedTheaterDetails.regularSeat.totalRows + selectedTheaterDetails.economySeat.totalRows)).length > 0 && <div className="text-center"><div className={`w-6 h-6 ${getSeatInfo(selectedTheaterDetails.premiumSeat.totalRows + selectedTheaterDetails.regularSeat.totalRows + selectedTheaterDetails.economySeat.totalRows).color.split(' ')[0]} rounded border mx-auto mb-1`} /><span className="text-xs text-muted-foreground">{getSeatInfo(selectedTheaterDetails.premiumSeat.totalRows + selectedTheaterDetails.regularSeat.totalRows + selectedTheaterDetails.economySeat.totalRows).price}KS</span></div>}
            </div>
          )}
          <Card className="p-4 mb-6 bg-card/50 border-border/50">
            <div className="mb-6"><div className="bg-gradient-accent rounded-lg h-2 mb-4 relative" /><p className="text-center text-muted-foreground text-sm -mt-2">SCREEN</p></div>
            {seatLayout.map(({ row }, rowIndex) => (
              <div key={row} className="flex items-center justify-center space-x-1 mb-1">
                <span className="w-6 text-center text-xs font-bold text-muted-foreground">{row}</span>
                <div className="flex space-x-1">
                  {Array.from({ length: selectedTheaterDetails?.seatConfiguration.column || 0 }, (_, i) => i + 1).map((num) => {
                    const seatId = `${row}${num}`;
                    const status = getSeatStatus(seatId);
                    return (
                      <button key={seatId} onClick={() => handleSeatClick(seatId)} className={`w-6 h-6 rounded text-xs font-bold transition-colors ${getSeatClass(status, rowIndex)}`} disabled={status === "reserved"}>
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </Card>
          {selectedSeats.length > 0 && (
            <Card className="p-4 mb-6 bg-card/50 border-border/50">
              <h4 className="font-bold mb-2">Checkout Summary</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between"><span>Selected Seats:</span><span>{selectedSeats.join(", ")}</span></div>
                <div className="flex justify-between"><span>Total Price:</span><span className="font-bold">{seatPrice}KS</span></div>
              </div>
            </Card>
          )}
          <Button onClick={() => setStep('checkout')} disabled={selectedSeats.length === 0} className="w-full bg-gradient-accent hover:shadow-glow text-lg font-bold py-3">
            NEXT
          </Button>
        </div>
      </div>
    );
  }

  if (step === "checkout") {
    return (
        <div className="min-h-screen bg-gradient-cinema">
            <div className="container mx-auto px-4 py-8 max-w-md">
                <div className="flex items-center mb-6">
                    <ArrowLeft className="w-6 h-6 mr-4 cursor-pointer" onClick={handleBack} />
                    <h1 className="text-xl font-bold">Checkout</h1>
                </div>

                {/* Booking Summary */}
                <Card className="p-4 mb-6 bg-card/50 border-border/50">
                    <h2 className="text-lg font-semibold mb-3">Booking Summary</h2>
                    <div className="flex space-x-4">
                        <img src={movie.moviePosterUrl} alt={movie.title} className="w-20 h-28 rounded object-cover" />
                        <div className="text-sm space-y-1">
                            <h3 className="font-bold text-base">{movie.title}</h3>
                            <p className="text-muted-foreground">{selectedTheaterDetails?.name}</p>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>{selectedDate}</span>
                            </div>
                             <div className="flex items-center space-x-2 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{selectedShowtime?.time.substring(0,5)}</span>
                            </div>
                            <div>
                                <span className="font-semibold">Seats: </span>
                                {selectedSeats.join(', ')}
                            </div>
                             <div>
                                <span className="font-semibold">Total: </span>
                                <span className="text-primary font-bold">{seatPrice}KS</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Contact Info */}
                <Card className="p-4 mb-6 bg-card/50 border-border/50">
                    <h2 className="text-lg font-semibold mb-4 flex items-center"><User className="w-5 h-5 mr-2" />Contact Information</h2>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="John Doe" className="bg-secondary/50" value={contactInfo.name} onChange={e => setContactInfo({...contactInfo, name: e.target.value})} />
                        </div>
                         <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="john.doe@example.com" className="bg-secondary/50" value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} />
                        </div>
                    </div>
                </Card>

                {/* Payment Details */}
                 <Card className="p-4 mb-6 bg-card/50 border-border/50">
                    <h2 className="text-lg font-semibold mb-4 flex items-center"><CreditCard className="w-5 h-5 mr-2" />Payment Details</h2>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input id="cardNumber" placeholder="**** **** **** ****" className="bg-secondary/50" value={paymentInfo.cardNumber} onChange={e => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})} />
                        </div>
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input id="expiry" placeholder="MM/YY" className="bg-secondary/50" value={paymentInfo.expiry} onChange={e => setPaymentInfo({...paymentInfo, expiry: e.target.value})} />
                            </div>
                             <div className="flex-1">
                                <Label htmlFor="cvc">CVC</Label>
                                <Input id="cvc" placeholder="***" className="bg-secondary/50" value={paymentInfo.cvc} onChange={e => setPaymentInfo({...paymentInfo, cvc: e.target.value})} />
                            </div>
                        </div>
                    </div>
                </Card>

                <Button onClick={handleConfirmBooking} disabled={loading} className="w-full bg-gradient-accent hover:shadow-glow text-lg font-bold py-3">
                    {loading ? 'Processing...' : `Pay ${seatPrice}KS and Confirm`}
                </Button>
            </div>
        </div>
    );
  }

  return null;
};
