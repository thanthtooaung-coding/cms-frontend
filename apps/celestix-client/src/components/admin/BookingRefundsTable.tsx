import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchWithAuth } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const StatusBadge = ({ status }: { status: string }) => {
  const variants: { [key: string]: string } = {
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    APPROVED: "bg-green-500/20 text-green-400 border-green-500/30",
    REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return <Badge className={`${variants[status]} border`}>{status}</Badge>;
};

export const BookingRefundsTable = () => {
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRefunds = async () => {
    try {
      const response = await fetchWithAuth("/refunds");
      if (response.ok) {
        const data = await response.json();
        setRefunds(data.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch refund requests.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching refund requests.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const handleUpdateStatus = async (
    refundId: number,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      const response = await fetchWithAuth(`/refunds/${refundId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Refund has been ${status.toLowerCase()}.`,
        });
        fetchRefunds();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to update refund status.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating the refund status.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading refund requests...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Booking Refunds</h1>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Refund Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {refunds.length > 0 ? (
                refunds.map((refund) => (
                  <TableRow key={refund.id}>
                    <TableCell>{refund.bookingId}</TableCell>
                    <TableCell>
                      <div>{refund.customerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {refund.customerEmail}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={refund.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {refund.status === "PENDING" && (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateStatus(refund.id, "APPROVED")
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleUpdateStatus(refund.id, "REJECTED")
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No refund requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
