import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const AdminsTable = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth("/admins");
            if (!response.ok) throw new Error("Failed to fetch admins");
            const data = await response.json();
            setAdmins(data.data);
        } catch (err) {
            console.error("Error fetching admins:", err);
            toast({
                title: "Error",
                description: "Failed to fetch admins.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleDelete = async (adminId: number) => {
        try {
            const response = await fetchWithAuth(`/admins/${adminId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                toast({
                    title: "Admin Deleted",
                    description: "Admin has been successfully deleted.",
                });
                fetchAdmins();
            } else {
                const errorData = await response.json();
                toast({
                    title: "Error",
                    description: errorData.message || "Failed to delete admin.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occurred while deleting the admin.",
                variant: "destructive",
            });
        }
    };

    const filteredAdmins = admins.filter((admin) =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Admins</h1>
                <Button
                    className="bg-gradient-accent hover:shadow-glow"
                    onClick={() => navigate("/admin/admins/add")}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Admin
                </Button>
            </div>

            <Card className="glass-card p-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search Admins..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-secondary/50 border-border/50"
                    />
                </div>
            </Card>

            <Card className="glass-card">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/50">
                                <th className="text-left p-4 text-muted-foreground font-medium">Name</th>
                                <th className="text-left p-4 text-muted-foreground font-medium">Email</th>
                                <th className="text-left p-4 text-muted-foreground font-medium">Role</th>
                                <th className="text-left p-4 text-muted-foreground font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAdmins.map((admin) => (
                                <tr key={admin.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                                    <td className="p-4 font-medium text-foreground">{admin.name}</td>
                                    <td className="p-4 text-muted-foreground">{admin.email}</td>
                                    <td className="p-4 text-muted-foreground">Admin</td>
                                    <td className="p-4">
                                        <div className="flex items-center space-x-2">
                                            {admin.email !== "admin@celestix.com" ? (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the admin account.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(admin.id)}>
                                                    Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                            ) : (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground opacity-40 cursor-not-allowed"
                                                disabled
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};