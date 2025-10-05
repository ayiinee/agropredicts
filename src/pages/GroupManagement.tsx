
import { RoleBasedLayout } from "@/components/RoleBasedLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const mockGroups = [
  { id: 1, name: "Kelompok Tani Sumber Makmur", memberCount: 45, totalFields: 187, expectedProduction: "15.000 kg", location: "Kecamatan Dau, Malang" },
  { id: 2, name: "Kelompok Tani Tunas Organik", memberCount: 32, totalFields: 98, expectedProduction: "8.500 kg", location: "Kecamatan Pujon, Malang" },
  { id: 3, name: "Kelompok Tani Sejahtera", memberCount: 28, totalFields: 120, expectedProduction: "10.000 kg", location: "Kecamatan Singosari, Malang" },
  { id: 4, name: "Kelompok Tani Bersatu", memberCount: 50, totalFields: 200, expectedProduction: "20.000 kg", location: "Kecamatan Lawang, Malang" },
];
const mockAnnouncements = [
  { id: 1, title: "Rapat Bulanan", date: "2024-09-10", priority: "high" },
  { id: 2, title: "Update Harga Pupuk", date: "2024-09-05", priority: "medium" },
];


export default function GroupManagement() {
  return (
    <RoleBasedLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kelompok Tani</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockGroups.map(group => (
                <div key={group.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{group.name}</h3>
                    <Badge variant="outline">{group.memberCount} anggota</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{group.location}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Lahan</p>
                      <p className="font-medium">{group.totalFields}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Perkiraan Produksi</p>
                      <p className="font-medium">{group.expectedProduction}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">Kelola Kelompok</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pengumuman</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnnouncements.map(announcement => (
                <div key={announcement.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{announcement.title}</h3>
                      <p className="text-sm text-muted-foreground">{announcement.date}</p>
                    </div>
                    <Badge variant={announcement.priority === "high" ? "destructive" : announcement.priority === "medium" ? "default" : "secondary"}>{announcement.priority}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleBasedLayout>
  );
}
