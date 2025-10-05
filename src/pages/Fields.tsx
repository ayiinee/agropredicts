import { useNavigate } from 'react-router-dom';
import { RoleBasedLayout } from '@/components/RoleBasedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sprout, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
export default function Fields() {
  const {
    profile
  } = useAuth();
  const navigate = useNavigate();

  // Mock data - in real app, this would come from API
  const fields = [{
      id: 1,
      name: 'Ladang A - Jagung',
      area: '5.2 hektar',
      growth: 75,
      harvestDate: '2024-09-15',
      estimatedYield: '2,400 kg',
      alerts: 1
    },
    {
      id: 2,
      name: 'Ladang B - Padi', 
      area: '3.8 hektar',
      growth: 45,
      harvestDate: '2024-08-20',
      estimatedYield: '1,800 kg',
      alerts: 2
    },
    {
      id: 3,
      name: 'Ladang C - Padi',
      area: '4.1 hektar', 
      growth: 30,
      harvestDate: '2024-10-05',
      estimatedYield: '1,600 kg',
      alerts: 0
    },{
    id: 1,
    name: 'Field A - Corn',
    area: '5.2 hectares',
    growth: 75,
    harvestDate: '2024-09-15',
    estimatedYield: '2,400 kg',
    alerts: 1,
    cropType: 'corn',
    plantingDate: '2024-03-15'
  }, {
    id: 2,
    name: 'Field B - Wheat',
    area: '3.8 hectares',
    growth: 45,
    harvestDate: '2024-08-20',
    estimatedYield: '1,800 kg',
    alerts: 2,
    cropType: 'wheat',
    plantingDate: '2024-04-01'
  }, {
    id: 3,
    name: 'Field C - Soybeans',
    area: '4.1 hectares',
    growth: 30,
    harvestDate: '2024-10-05',
    estimatedYield: '1,600 kg',
    alerts: 0,
    cropType: 'soybeans',
    plantingDate: '2024-05-10'
  }];
  const handleViewDetails = (fieldId: number) => {
    navigate(`/field/${fieldId}`);
  };
  return (<RoleBasedLayout>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Lahan Saya</h1>
          <p className="text-muted-foreground">Kelola dan pantau semua lahan pertanian Anda</p>
        </div>
      </div>

      {/* Add Field Button */}
      <div className="flex justify-end">
        <Button variant="outline">
          <Sprout className="h-4 w-4 mr-2" />
          Tambah Lahan Baru
        </Button>
      </div>
      
      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map(field => <Card key={field.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{field.name}</CardTitle>
                  <CardDescription>{field.area}</CardDescription>
                </div>
                {field.alerts > 0 && <Badge variant="destructive" className="text-xs">
                    {field.alerts} peringatan
                  </Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Growth Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Perkembangan Pertumbuhan</span>
                  <span className="font-medium">{field.growth}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary rounded-full h-2 transition-all duration-300" style={{
                width: `${field.growth}%`
              }} />
                </div>
              </div>

              {/* Key Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Ditanam: {field.plantingDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Panen: {field.harvestDate}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" size="sm" onClick={() => handleViewDetails(field.id)}>
                Lihat Detail
              </Button>
            </CardContent>
          </Card>)}
      </div>
    </div>
  </RoleBasedLayout>);
}