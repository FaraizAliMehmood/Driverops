import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Filter,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { zoneService } from "@/services/zoneService";

interface Zone {
  _id: string;
  zone_name: string;
  is_active: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  created_at: string;
  updated_at: string;
}

interface ZoneFormData {
  zone_name: string;
  is_active: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const ZoneManagement = () => {
  const navigate = useNavigate();
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [formData, setFormData] = useState<ZoneFormData>({
    zone_name: "",
    is_active: true,
    coordinates: {
      lat: 1.28,
      lng: 103.86,
    },
  });

  // Fetch zones on component mount
  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    setLoading(true);
    try {
      const response = await zoneService.getAllZones();
      setZones(response.data);
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch zones");
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveZones = async () => {
    setLoading(true);
    try {
      const response = await zoneService.getActiveZones();
      setZones(response.data);
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch active zones");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActiveFilter = () => {
    const newValue = !showActiveOnly;
    setShowActiveOnly(newValue);
    if (newValue) {
      fetchActiveZones();
    } else {
      fetchZones();
    }
  };

  const handleCreateZone = async () => {
    if (!formData.zone_name.trim()) {
      toast.error("Zone name is required");
      return;
    }

    setLoading(true);
    try {
      const response = await zoneService.createZone(formData);
      toast.success(response.message);
      setIsCreateDialogOpen(false);
      resetForm();
      showActiveOnly ? fetchActiveZones() : fetchZones();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create zone");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateZone = async () => {
    if (!selectedZone || !formData.zone_name.trim()) {
      toast.error("Zone name is required");
      return;
    }

    setLoading(true);
    try {
      const response = await zoneService.updateZone(selectedZone._id, formData);
      toast.success(response.message);
      setIsEditDialogOpen(false);
      setSelectedZone(null);
      resetForm();
      showActiveOnly ? fetchActiveZones() : fetchZones();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update zone");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteZone = async () => {
    if (!selectedZone) return;

    setLoading(true);
    try {
      const response = await zoneService.deleteZone(selectedZone._id);
      toast.success(response.message);
      setIsDeleteDialogOpen(false);
      setSelectedZone(null);
      showActiveOnly ? fetchActiveZones() : fetchZones();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete zone");
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (zone: Zone) => {
    setSelectedZone(zone);
    setFormData({
      zone_name: zone.zone_name,
      is_active: zone.is_active,
      coordinates: {
        lat: zone.coordinates.lat,
        lng: zone.coordinates.lng,
      },
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (zone: Zone) => {
    setSelectedZone(zone);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      zone_name: "",
      is_active: true,
      coordinates: {
        lat: 1.28,
        lng: 103.86,
      },
    });
  };

  const handleFormChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/")}
              className="bg-white/10 hover:bg-white/20 border-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Zone Management</h1>
              <p className="text-white/70">Manage delivery zones and their configurations</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleToggleActiveFilter}
              className={`${
                showActiveOnly
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showActiveOnly ? "Active Only" : "All Zones"}
            </Button>

            <Button
              variant="outline"
              onClick={() => (showActiveOnly ? fetchActiveZones() : fetchZones())}
              disabled={loading}
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Zone
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Zone</DialogTitle>
                  <DialogDescription>
                    Add a new delivery zone to the system
                  </DialogDescription>
                </DialogHeader>
                <ZoneForm
                  formData={formData}
                  onChange={handleFormChange}
                  onSubmit={handleCreateZone}
                  onCancel={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}
                  loading={loading}
                  isEdit={false}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Zones Table */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {showActiveOnly ? "Active Zones" : "All Zones"}
            </CardTitle>
            <CardDescription className="text-white/70">
              {zones.length} {zones.length === 1 ? "zone" : "zones"} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && zones.length === 0 ? (
              <div className="text-center py-8 text-white/70">Loading zones...</div>
            ) : zones.length === 0 ? (
              <div className="text-center py-8 text-white/70">
                No zones found. Create your first zone to get started.
              </div>
            ) : (
              <div className="rounded-md border border-white/20 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20 hover:bg-white/5">
                      <TableHead className="text-white font-semibold">Zone Name</TableHead>
                      <TableHead className="text-white font-semibold">Status</TableHead>
                      <TableHead className="text-white font-semibold">Coordinates</TableHead>
                      <TableHead className="text-white font-semibold">Created</TableHead>
                      <TableHead className="text-white font-semibold">Updated</TableHead>
                      <TableHead className="text-white font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {zones.map((zone) => (
                      <TableRow
                        key={zone._id}
                        className="border-white/20 hover:bg-white/5"
                      >
                        <TableCell className="font-medium text-white">
                          {zone.zone_name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={zone.is_active ? "default" : "secondary"}
                            className={
                              zone.is_active
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-gray-500 hover:bg-gray-600"
                            }
                          >
                            {zone.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white/80">
                          <div className="text-sm">
                            <div>Lat: {zone.coordinates.lat.toFixed(3)}</div>
                            <div>Lng: {zone.coordinates.lng.toFixed(3)}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white/80 text-sm">
                          {new Date(zone.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-white/80 text-sm">
                          {new Date(zone.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openEditDialog(zone)}
                              className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openDeleteDialog(zone)}
                              className="bg-red-500/20 hover:bg-red-500/30 border-red-500/20 text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Zone</DialogTitle>
              <DialogDescription>
                Update zone information and settings
              </DialogDescription>
            </DialogHeader>
            <ZoneForm
              formData={formData}
              onChange={handleFormChange}
              onSubmit={handleUpdateZone}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedZone(null);
                resetForm();
              }}
              loading={loading}
              isEdit={true}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the zone "{selectedZone?.zone_name}".
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setSelectedZone(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteZone}
                className="bg-red-500 hover:bg-red-600"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

// Zone Form Component
interface ZoneFormProps {
  formData: ZoneFormData;
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  loading: boolean;
  isEdit: boolean;
}

const ZoneForm = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
  loading,
  isEdit,
}: ZoneFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="zone_name">Zone Name *</Label>
        <Input
          id="zone_name"
          placeholder="e.g., Marina Bay"
          value={formData.zone_name}
          onChange={(e) => onChange("zone_name", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lat">Latitude *</Label>
          <Input
            id="lat"
            type="number"
            step="0.000001"
            placeholder="1.280"
            value={formData.coordinates.lat}
            onChange={(e) => onChange("coordinates.lat", parseFloat(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lng">Longitude *</Label>
          <Input
            id="lng"
            type="number"
            step="0.000001"
            placeholder="103.860"
            value={formData.coordinates.lng}
            onChange={(e) => onChange("coordinates.lng", parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="is_active" className="text-base">
            Active Status
          </Label>
          <div className="text-sm text-muted-foreground">
            Enable or disable this zone
          </div>
        </div>
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => onChange("is_active", checked)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={loading}>
          {loading ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update Zone" : "Create Zone"}
        </Button>
      </div>
    </div>
  );
};

export default ZoneManagement;

