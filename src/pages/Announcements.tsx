import { RoleBasedLayout } from "@/components/RoleBasedLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MessageCircle } from "lucide-react";
import { useState } from "react";

const mockAnnouncements = [
  { id: 1, title: "Harga Gabah Musim Panen 2024", date: "2024-01-15", priority: "high", content: "Berdasarkan hasil rapat dengan pengurus koperasi dan perwakilan petani, harga gabah untuk musim panen 2024 telah ditetapkan sebagai berikut..." },
  { id: 2, title: "Rapat Bulanan Koperasi", date: "2024-01-14", priority: "medium", content: "Rapat bulanan koperasi akan diadakan pada:" },
  { id: 3, title: "Pembaruan Standar Mutu Gabah", date: "2024-01-12", priority: "low", content: "Berikut adalah pembaruan standar mutu gabah yang berlaku mulai bulan depan:" },
  { id: 4, title: "Pelatihan Pertanian Modern", date: "2024-01-10", priority: "medium", content: "Koperasi akan mengadakan pelatihan pertanian modern untuk seluruh anggota." },
];

export default function Announcements() {
  const [filter, setFilter] = useState("all");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<typeof mockAnnouncements[0] | null>(null);

  const getFilteredAnnouncements = () => {
    if (filter === "all") return mockAnnouncements;
    return mockAnnouncements.filter(a => a.priority === filter);
  };

  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Announcements</h1>
            <p className="text-muted-foreground">Manage and view all cooperative announcements</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Announcement
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            className="sm:w-[300px]"
            placeholder="Search announcements..."
          />
          <Select
            value={filter}
            onValueChange={setFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Announcements List */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {getFilteredAnnouncements().map((announcement) => (
                <Dialog key={announcement.id}>
                  <DialogTrigger asChild>
                    <div
                      className="p-4 border rounded-lg flex justify-between items-start cursor-pointer hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setSelectedAnnouncement(announcement)}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{announcement.title}</p>
                          <Badge
                            variant={
                              announcement.priority === "high"
                                ? "destructive"
                                : announcement.priority === "medium"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {announcement.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(announcement.date).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{announcement.title}</DialogTitle>
                      <DialogDescription>
                        Posted on{" "}
                        {new Date(announcement.date).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Badge
                        variant={
                          announcement.priority === "high"
                            ? "destructive"
                            : announcement.priority === "medium"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {announcement.priority} priority
                      </Badge>
                      <p className="leading-7">{announcement.content}</p>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleBasedLayout>
  );
}