"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Dumbbell, 
  Activity, 
  Flame, 
  Layers, 
  Maximize2, 
  Sparkles, 
  ShieldCheck, 
  Coffee, 
  Trophy, 
  Loader2,
  ExternalLink
} from "lucide-react"
import { 
  createFacility, 
  updateFacility, 
  deleteFacility, 
  toggleFacilityStatus 
} from "@/app/actions/facilities"
import { toast } from "sonner"

interface Facility {
  id: string
  title: string
  description: string | null
  icon: string | null
  imageUrl: string | null
  isActive: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

interface FacilitiesClientProps {
  initialFacilities: Facility[]
}

const AVAILABLE_ICONS = [
  { name: "Dumbbell", icon: Dumbbell, label: "Strength / Weights" },
  { name: "Activity", icon: Activity, label: "Cardio / Aerobics" },
  { name: "Flame", icon: Flame, label: "Crossfit / HIIT" },
  { name: "Layers", icon: Layers, label: "Machines / Circuits" },
  { name: "Maximize2", icon: Maximize2, label: "Calisthenics / Stretch" },
  { name: "Sparkles", icon: Sparkles, label: "Spa / Steam Bath" },
  { name: "ShieldCheck", icon: ShieldCheck, label: "Lockers / Security" },
  { name: "Coffee", icon: Coffee, label: "Nutrition / Cafe" },
  { name: "Trophy", icon: Trophy, label: "Personal Training" },
]

const PRESET_IMAGES = [
  { label: "Free Weights", url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop" },
  { label: "Cardio", url: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=1200&auto=format&fit=crop" },
  { label: "Crossfit", url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop" },
  { label: "Machines", url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop" },
  { label: "Calisthenics", url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop" },
  { label: "Steam Room", url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200&auto=format&fit=crop" },
  { label: "Smart Lockers", url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1200&auto=format&fit=crop" },
  { label: "Protein Bar", url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop" },
  { label: "Trainer Studio", url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop" },
]

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Dumbbell,
  Activity,
  Flame,
  Layers,
  Maximize2,
  Sparkles,
  ShieldCheck,
  Coffee,
  Trophy,
}

export default function FacilitiesClient({ initialFacilities }: FacilitiesClientProps) {
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities)
  const [searchQuery, setSearchQuery] = useState("")
  const [isPending, startTransition] = useTransition()

  // Modal State
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null)
  const [facilityToDelete, setFacilityToDelete] = useState<Facility | null>(null)

  // Form State
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("Dumbbell")
  const [imageUrl, setImageUrl] = useState("")
  const [isActive, setIsActive] = useState(true)

  function handleOpenCreate() {
    setEditingFacility(null)
    setTitle("")
    setDescription("")
    setIcon("Dumbbell")
    setImageUrl(PRESET_IMAGES[0].url)
    setIsActive(true)
    setDialogOpen(true)
  }

  function handleOpenEdit(facility: Facility) {
    setEditingFacility(facility)
    setTitle(facility.title)
    setDescription(facility.description || "")
    setIcon(facility.icon || "Dumbbell")
    setImageUrl(facility.imageUrl || "")
    setIsActive(facility.isActive)
    setDialogOpen(true)
  }

  function handleOpenDelete(facility: Facility) {
    setFacilityToDelete(facility)
    setDeleteDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Please provide a title for the facility")
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("icon", icon)
    formData.append("imageUrl", imageUrl)
    formData.append("isActive", isActive ? "true" : "false")

    startTransition(async () => {
      if (editingFacility) {
        const res = await updateFacility(editingFacility.id, formData)
        if (res.success && res.facility) {
          toast.success(res.message)
          setFacilities((prev) =>
            prev.map((f) => (f.id === editingFacility.id ? (res.facility as Facility) : f))
          )
          setDialogOpen(false)
        } else {
          toast.error(res.message || "Failed to update facility")
        }
      } else {
        const res = await createFacility(formData)
        if (res.success && res.facility) {
          toast.success(res.message)
          setFacilities((prev) => [res.facility as Facility, ...prev])
          setDialogOpen(false)
        } else {
          toast.error(res.message || "Failed to create facility")
        }
      }
    })
  }

  async function handleToggleStatus(facility: Facility) {
    startTransition(async () => {
      const res = await toggleFacilityStatus(facility.id, facility.isActive)
      if (res.success) {
        toast.success(res.message)
        setFacilities((prev) =>
          prev.map((f) => (f.id === facility.id ? { ...f, isActive: !f.isActive } : f))
        )
      } else {
        toast.error(res.message)
      }
    })
  }

  async function handleConfirmDelete() {
    if (!facilityToDelete) return

    startTransition(async () => {
      const res = await deleteFacility(facilityToDelete.id)
      if (res.success) {
        toast.success(res.message)
        setFacilities((prev) => prev.filter((f) => f.id !== facilityToDelete.id))
        setDeleteDialogOpen(false)
        setFacilityToDelete(null)
      } else {
        toast.error(res.message)
      }
    })
  }

  const filteredFacilities = facilities.filter(
    (f) =>
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Facilities Management</h1>
          <p className="text-muted-foreground text-sm">
            Manage gym zones, workout equipment areas, and member amenities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Facility
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border/60">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <div className="text-xs text-muted-foreground self-end sm:self-center">
          Showing {filteredFacilities.length} of {facilities.length} facilities
        </div>
      </div>

      {/* Facilities Table */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Preview</TableHead>
              <TableHead>Facility Name</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFacilities.map((facility) => {
              const IconComp = (facility.icon && iconMap[facility.icon]) || Dumbbell

              return (
                <TableRow key={facility.id} className="hover:bg-muted/40 transition-colors">
                  {/* Thumbnail */}
                  <TableCell>
                    <div 
                      className="h-14 w-18 rounded-lg bg-cover bg-center border border-border/60 shadow-xs"
                      style={{ 
                        backgroundImage: `url(${facility.imageUrl || 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop'})` 
                      }}
                    />
                  </TableCell>

                  {/* Title */}
                  <TableCell className="font-semibold text-foreground">
                    <div>{facility.title}</div>
                    <div className="text-xs text-muted-foreground md:hidden line-clamp-1 mt-0.5">
                      {facility.description}
                    </div>
                  </TableCell>

                  {/* Icon */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/60 text-xs font-medium w-fit border border-border/40">
                      <IconComp className="w-3.5 h-3.5 text-primary" />
                      <span>{facility.icon || "Dumbbell"}</span>
                    </div>
                  </TableCell>

                  {/* Description */}
                  <TableCell className="hidden md:table-cell max-w-xs truncate text-muted-foreground text-sm">
                    {facility.description || "—"}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(facility)}
                      disabled={isPending}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                        facility.isActive
                          ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                          : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      }`}
                    >
                      {facility.isActive ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </>
                      )}
                    </button>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(facility)}
                        disabled={isPending}
                        title="Edit Facility"
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDelete(facility)}
                        disabled={isPending}
                        title="Delete Facility"
                        className="hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}

            {filteredFacilities.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Dumbbell className="w-10 h-10 text-muted-foreground/40 stroke-1" />
                    <div>No facilities match your search.</div>
                    <Button variant="outline" size="sm" onClick={handleOpenCreate}>
                      Add First Facility
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create / Edit Facility Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingFacility ? "Edit Facility" : "Add New Gym Facility"}
            </DialogTitle>
            <DialogDescription>
              {editingFacility
                ? "Update the details, media, and status of this gym facility."
                : "Create a new facility zone or amenity to showcase on Paradise Gym's website."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="facility-title">Facility Title *</Label>
              <Input
                id="facility-title"
                placeholder="e.g. Olympic Free Weights & Power Racks"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="facility-desc">Description</Label>
              <Textarea
                id="facility-desc"
                placeholder="Highlight equipment, floor size, key benefits..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Icon Picker */}
            <div className="space-y-2">
              <Label>Facility Icon</Label>
              <div className="grid grid-cols-3 gap-2">
                {AVAILABLE_ICONS.map((item) => {
                  const ItemIcon = item.icon
                  const isSelected = icon === item.name
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setIcon(item.name)}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-border/60 hover:bg-muted/50 text-foreground"
                      }`}
                    >
                      <ItemIcon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Image URL & Presets */}
            <div className="space-y-2">
              <Label htmlFor="facility-image">Image URL</Label>
              <Input
                id="facility-image"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <div className="space-y-1.5 pt-1">
                <span className="text-xs text-muted-foreground">Quick Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`text-xs px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        imageUrl === preset.url
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/40 hover:bg-muted border-border/50 text-muted-foreground"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Preview */}
              {imageUrl && (
                <div className="mt-3 relative h-36 w-full rounded-lg overflow-hidden border border-border/60">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium backdrop-blur">
                    Image Preview
                  </div>
                </div>
              )}
            </div>

            {/* Status Switch */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/20">
              <div>
                <div className="text-sm font-medium">Active Status</div>
                <div className="text-xs text-muted-foreground">
                  Visible to public visitors on the facilities page
                </div>
              </div>
              <input
                type="checkbox"
                id="facility-active"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 accent-primary rounded cursor-pointer"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="gap-2">
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingFacility ? "Save Changes" : "Create Facility"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive">
              Delete Facility
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong className="text-foreground">{facilityToDelete?.title}</strong>? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isPending}
              className="gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
