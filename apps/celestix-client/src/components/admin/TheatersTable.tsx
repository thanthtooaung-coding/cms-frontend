import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Plus, Search, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchWithAuth } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const theaterSchema = z.object({
  name: z.string().min(1, "Theater name is required"),
  location: z.string().min(1, "Location is required"),
  seatConfig: z.string().regex(/^\d+x\d+$/, "Seat configuration must be in format 'rowsxcolumns' (e.g., 14x12)"),
  premiumSeatRows: z.string().min(1, "Premium seat rows are required"),
  regularSeatRows: z.string().min(1, "Regular seat rows are required"),
  economySeatRows: z.string().min(1, "Economy seat rows are required"),
  basicSeatRows: z.string().min(1, "Basic seat rows are required"),
  premiumSeatPrice: z.string().min(1, "Premium price is required").refine(
    (val) => parseFloat(val) > 0,
    { message: "Price must be greater than zero" }
  ),
  regularSeatPrice: z.string().min(1, "Regular price is required").refine(
    (val) => parseFloat(val) > 0,
    { message: "Price must be greater than zero" }
  ),
  economySeatPrice: z.string().min(1, "Economy price is required").refine(
    (val) => parseFloat(val) > 0,
    { message: "Price must be greater than zero" }
  ),
  basicSeatPrice: z.string().min(1, "Basic price is required").refine(
    (val) => parseFloat(val) > 0,
    { message: "Price must be greater than zero" }
  ),
});

type Theater = {
  id: string;
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
  capacity: number;
  status: "Active" | "Maintenance" | "Inactive";
};

export const TheatersTable = () => {
  const navigate = useNavigate();
  const { getPath } = useTenantPath();
  const { toast } = useToast();
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTheater, setEditingTheater] = useState<Theater | null>(null);

  const form = useForm<z.infer<typeof theaterSchema>>({
    resolver: zodResolver(theaterSchema),
    defaultValues: {
      name: "",
      location: "",
      seatConfig: "14x12",
      premiumSeatRows: "2",
      regularSeatRows: "4",
      economySeatRows: "4",
      basicSeatRows: "4",
      premiumSeatPrice: "",
      regularSeatPrice: "",
      economySeatPrice: "",
      basicSeatPrice: "",
    },
  });

  const defaultFormValues = {
    name: "",
    location: "",
    seatConfig: "14x12",
    premiumSeatRows: "2",
    regularSeatRows: "4",
    economySeatRows: "4",
    basicSeatRows: "4",
    premiumSeatPrice: "",
    regularSeatPrice: "",
    economySeatPrice: "",
    basicSeatPrice: "",
  };

  const fetchTheaters = async () => {
    try {
      const response = await fetchWithAuth("/theaters");
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.data.map((theater: any) => ({
          ...theater,
          capacity: theater.seatConfiguration.row * theater.seatConfiguration.column,
          status: "Active", // Assuming default status
        }));
        setTheaters(formattedData);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch theaters.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching theaters.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

  const filteredTheaters = theaters.filter((theater) => {
    const matchesSearch =
      theater.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      theater.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || theater.status === statusFilter;
    const matchesLocation =
      locationFilter === "all" || theater.location === locationFilter;

    return matchesSearch && matchesStatus && matchesLocation;
  });
  
  const handleOpenChange = (isOpen: boolean) => {
    setIsAddDialogOpen(isOpen);
    if (!isOpen) {
      setEditingTheater(null);
      form.reset(defaultFormValues);
    }
  };

  const handleAddNewClick = () => {
      setEditingTheater(null);
      form.reset(defaultFormValues);
      setIsAddDialogOpen(true);
  }

  const onSubmit = async (values: z.infer<typeof theaterSchema>) => {
    const [rows, columns] = values.seatConfig.split("x").map(Number);
    const payload = {
      name: values.name,
      location: values.location,
      seatConfiguration: {
        row: rows,
        column: columns,
      },
      premiumSeat: {
        totalRows: parseInt(values.premiumSeatRows),
        totalPrice: parseFloat(values.premiumSeatPrice),
      },
      regularSeat: {
        totalRows: parseInt(values.regularSeatRows),
        totalPrice: parseFloat(values.regularSeatPrice),
      },
      economySeat: {
        totalRows: parseInt(values.economySeatRows),
        totalPrice: parseFloat(values.economySeatPrice),
      },
      basicSeat: {
        totalRows: parseInt(values.basicSeatRows),
        totalPrice: parseFloat(values.basicSeatPrice),
      },
    };

    try {
      const response = editingTheater
        ? await fetchWithAuth(`/theaters/${editingTheater.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          })
        : await fetchWithAuth("/theaters", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

      if (response.ok) {
        toast({
          title: `Theater ${editingTheater ? "Updated" : "Added"}`,
          description: `Theater has been successfully ${
            editingTheater ? "updated" : "added"
          }.`,
        });
        fetchTheaters();
        handleOpenChange(false);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description:
            errorData.message ||
            `Failed to ${editingTheater ? "update" : "add"} theater.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `An error occurred while ${
          editingTheater ? "updating" : "adding"
        } the theater.`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (theater: Theater) => {
    setEditingTheater(theater);
    form.reset({
      name: theater.name,
      location: theater.location,
      seatConfig: `${theater.seatConfiguration.row}x${theater.seatConfiguration.column}`,
      premiumSeatRows: theater.premiumSeat.totalRows.toString(),
      regularSeatRows: theater.regularSeat.totalRows.toString(),
      economySeatRows: theater.economySeat.totalRows.toString(),
      basicSeatRows: theater.basicSeat.totalRows.toString(),
      premiumSeatPrice: theater.premiumSeat.totalPrice.toString(),
      regularSeatPrice: theater.regularSeat.totalPrice.toString(),
      economySeatPrice: theater.economySeat.totalPrice.toString(),
      basicSeatPrice: theater.basicSeat.totalPrice.toString(),
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetchWithAuth(`/theaters/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Theater Deleted",
          description: "Theater has been successfully deleted.",
        });
        fetchTheaters();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to delete theater.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the theater.",
        variant: "destructive",
      });
    }
  };

  const uniqueLocations = Array.from(
    new Set(theaters.map((theater) => theater.location))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Theater Management
        </h1>

        <Dialog open={isAddDialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNewClick} className="bg-gradient-accent hover:shadow-glow">
              <Plus className="w-4 h-4 mr-2" />
              Add Theater
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTheater ? "Edit Theater" : "Add New Theater"}
              </DialogTitle>
              <DialogDescription>
                {editingTheater
                  ? "Update theater information and seat pricing."
                  : "Add a new theater with seat configuration and pricing."}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Theater Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CINEMA 01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., J Cineplex (Junction City)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="seatConfig"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seat Configuration (RxC)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 14x12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Seat Details</h4>
                  <div className="grid grid-cols-4 gap-4">
                    {/* Premium */}
                    <FormField
                      control={form.control}
                      name="premiumSeatRows"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Premium Rows</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="premiumSeatPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Premium Price</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 26000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Regular */}
                    <FormField
                      control={form.control}
                      name="regularSeatRows"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Regular Rows</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 4" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="regularSeatPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Regular Price</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 12000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Economy */}
                    <FormField
                      control={form.control}
                      name="economySeatRows"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Economy Rows</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 4" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="economySeatPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Economy Price</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 11000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Basic */}
                    <FormField
                      control={form.control}
                      name="basicSeatRows"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Basic Rows</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 4" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="basicSeatPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Basic Price</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 5000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>


                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-accent hover:shadow-glow"
                  >
                    {editingTheater ? "Update Theater" : "Add Theater"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-card/50 border-border/50">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search theaters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="min-w-[350px]">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Location
            </label>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Theaters Table */}
      <Card className="bg-card/50 border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead className="text-foreground">Theater</TableHead>
              <TableHead className="text-foreground">Location</TableHead>
              <TableHead className="text-foreground">Configuration</TableHead>
              <TableHead className="text-foreground">Seat Pricing</TableHead>
              <TableHead className="text-foreground">Capacity</TableHead>
              <TableHead className="text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTheaters.map((theater) => (
              <TableRow key={theater.id} className="border-border/50">
                <TableCell className="text-foreground font-medium">
                  {theater.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {theater.location}
                </TableCell>
                <TableCell className="text-muted-foreground">{`${theater.seatConfiguration.row}x${theater.seatConfiguration.column}`}</TableCell>
                <TableCell>
                  <div className="space-y-1 text-xs">
                    <div>Premium: {theater.premiumSeat.totalPrice}KS</div>
                    <div>Regular: {theater.regularSeat.totalPrice}KS</div>
                    <div>Economy: {theater.economySeat.totalPrice}KS</div>
                    <div>Basic: {theater.basicSeat.totalPrice}KS</div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {theater.capacity}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(theater)}
                      className="hover:bg-primary/10"
                      title="Edit Theater"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        navigate(getPath(`/admin/theaters/${theater.id}/pricing`))
                      }
                      className="hover:bg-primary/10"
                      title="Manage Seat Pricing"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(theater.id)}
                      className="hover:bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
