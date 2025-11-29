import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast"; // Corrected hook path
import { fetchWithAuth } from "@/lib/api";
import { useTenantPath } from "@/hooks/useTenantPath";

type SeatType = 'premium' | 'regular' | 'economy' | 'basic';

interface SeatPricing {
  premium: string;
  regular: string;
  economy: string;
  basic: string;
}

type TheaterData = {
  id: number;
  name: string;
  location: string;
  seatConfiguration: {
    row: number;
    column: number;
  };
  premiumSeat: {
    totalRows: number;
    totalPrice: number;
  };
  regularSeat: {
    totalRows: number;
    totalPrice: number;
  };
  economySeat: {
    totalRows: number;
    totalPrice: number;
  };
  basicSeat: {
    totalRows: number;
    totalPrice: number;
  };
};

export const TheaterSeatPricingPage = () => {
  const { theaterId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getPath } = useTenantPath();
  
  const [theater, setTheater] = useState<TheaterData | null>(null);
  const [seatPricing, setSeatPricing] = useState<SeatPricing>({
    premium: "0",
    regular: "0",
    economy: "0",
    basic: "0"
  });

  useEffect(() => {
    if (theaterId) {
      const fetchTheaterData = async () => {
        try {
          const response = await fetchWithAuth(`/theaters/${theaterId}`);
          if (response.ok) {
            const data = await response.json();
            setTheater(data.data);
            setSeatPricing({
              premium: data.data.premiumSeat.totalPrice.toString(),
              regular: data.data.regularSeat.totalPrice.toString(),
              economy: data.data.economySeat.totalPrice.toString(),
              basic: data.data.basicSeat.totalPrice.toString(),
            });
          } else {
            toast({
              title: "Error",
              description: "Failed to fetch theater data.",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "An error occurred while fetching theater data.",
            variant: "destructive",
          });
        }
      };
      fetchTheaterData();
    }
  }, [theaterId, toast]);

  const generateSeatLayout = () => {
    if (!theater) return [];

    const { row, column } = theater.seatConfiguration;
    const { premiumSeat, regularSeat, economySeat } = theater;
    const rows = Array.from({ length: row }, (_, i) => String.fromCharCode(65 + i));
    
    return rows.map((rowLabel, rowIndex) => {
      const seats = [];
      for (let i = 1; i <= column; i++) {
        let seatType: SeatType = 'basic';
        if (rowIndex < premiumSeat.totalRows) {
          seatType = 'premium';
        } else if (rowIndex < premiumSeat.totalRows + regularSeat.totalRows) {
          seatType = 'regular';
        } else if (rowIndex < premiumSeat.totalRows + regularSeat.totalRows + economySeat.totalRows) {
          seatType = 'economy';
        }
        
        seats.push({
          id: `${rowLabel}${i}`,
          row: rowLabel,
          number: i,
          type: seatType
        });
      }
      return { row: rowLabel, seats };
    });
  };

  const seatLayout = generateSeatLayout();

  const getSeatColor = (seatType: SeatType) => {
    switch (seatType) {
      case 'premium': return 'bg-purple-500 hover:bg-purple-600';
      case 'regular': return 'bg-blue-500 hover:bg-blue-600';
      case 'economy': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'basic': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  const handlePriceChange = (seatType: SeatType, value: string) => {
    setSeatPricing(prev => ({
      ...prev,
      [seatType]: value
    }));
  };

  const handleSave = async () => {
    if (!theater) return;

    const prices = {
      premium: parseFloat(seatPricing.premium),
      regular: parseFloat(seatPricing.regular),
      economy: parseFloat(seatPricing.economy),
      basic: parseFloat(seatPricing.basic),
    };

    // Validate that all prices are numbers greater than zero
    for (const [seatType, price] of Object.entries(prices)) {
      if (isNaN(price) || price <= 0) {
        toast({
          title: "Invalid Price",
          description: `The ${seatType} seat price must be a number greater than zero.`,
          variant: "destructive",
        });
        return; // Stop the function if any price is invalid
      }
    }

    const payload = {
      ...theater,
      premiumSeat: { ...theater.premiumSeat, totalPrice: prices.premium },
      regularSeat: { ...theater.regularSeat, totalPrice: prices.regular },
      economySeat: { ...theater.economySeat, totalPrice: prices.economy },
      basicSeat: { ...theater.basicSeat, totalPrice: prices.basic }
    };

    try {
      const response = await fetchWithAuth(`/theaters/${theater.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast({
          title: "Pricing Updated",
          description: `Seat pricing has been successfully updated for ${theater.name}`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to update pricing.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating pricing.",
        variant: "destructive",
      });
    }
  };

  if (!theater) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Loading Theater...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <ArrowLeft 
            className="w-6 h-6 text-foreground mr-4 cursor-pointer hover:text-primary" 
            onClick={() => navigate(getPath('/admin/theaters'))}
          />
          <div>
            <h1 className="text-2xl font-bold text-foreground">{theater.name} - Seat Pricing</h1>
            <p className="text-muted-foreground">{theater.location}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seat Layout */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-card/50 border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">Seat Layout</h2>
              
              {/* Screen */}
              <div className="mb-6">
                <div className="w-full h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-t-full mb-2"></div>
                <div className="text-center text-sm text-muted-foreground">SCREEN</div>
              </div>

              {/* Price Legend */}
              <div className="flex flex-wrap gap-4 mb-6 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-sm">Premium - {seatPricing.premium}KS</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">Regular - {seatPricing.regular}KS</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm">Economy - {seatPricing.economy}KS</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Basic - {seatPricing.basic}KS</span>
                </div>
              </div>

              {/* Seats */}
              <div className="space-y-2">
                {seatLayout.map(({ row, seats }) => (
                  <div key={row} className="flex items-center justify-center gap-1">
                    <div className="w-6 text-center text-sm font-medium text-foreground">{row}</div>
                    <div className="flex gap-1">
                      {seats.map(seat => (
                        <div
                          key={seat.id}
                          className={`w-6 h-6 rounded cursor-pointer transition-colors ${getSeatColor(seat.type)}`}
                          title={`${seat.id} - ${seat.type} (${seatPricing[seat.type]}KS)`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Pricing Controls */}
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">Update Pricing</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Premium Seats Price
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <Input
                      type="number"
                      min="0.01" // Basic browser-level validation
                      step="any"
                      value={seatPricing.premium}
                      onChange={(e) => handlePriceChange('premium', e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">KS</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Regular Seats Price
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <Input
                      type="number"
                      min="0.01"
                      step="any"
                      value={seatPricing.regular}
                      onChange={(e) => handlePriceChange('regular', e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">KS</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Economy Seats Price
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <Input
                      type="number"
                      min="0.01"
                      step="any"
                      value={seatPricing.economy}
                      onChange={(e) => handlePriceChange('economy', e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">KS</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Basic Seats Price
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <Input
                      type="number"
                      min="0.01"
                      step="any"
                      value={seatPricing.basic}
                      onChange={(e) => handlePriceChange('basic', e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">KS</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSave}
                className="w-full mt-6 bg-gradient-accent hover:shadow-glow"
              >
                Save Pricing Changes
              </Button>
            </Card>

            {/* Theater Info */}
            <Card className="p-6 bg-card/50 border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-3">Theater Info</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <span className="ml-2 text-foreground">{theater.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <span className="ml-2 text-foreground">{theater.location}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Layout:</span>
                  <span className="ml-2 text-foreground">{`${theater.seatConfiguration.row}x${theater.seatConfiguration.column} (${theater.seatConfiguration.row * theater.seatConfiguration.column} seats)`}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="default" className="ml-2">Active</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};