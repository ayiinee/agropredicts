import { useAuth } from '@/hooks/useAuth';
import { RoleBasedLayout } from '@/components/RoleBasedLayout';
import { FarmerDashboard } from '@/components/dashboards/FarmerDashboard';
import { DistributorDashboard } from '@/components/dashboards/DistributorDashboard';
import { CooperativeDashboard } from '@/components/dashboards/CooperativeDashboard';

const Index = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderDashboard = () => {
    if (!profile) return null;

    switch (profile.role) {
      case 'farmer':
        return <FarmerDashboard />;
      case 'distributor':
        return <DistributorDashboard />;
      case 'cooperative':
        return <CooperativeDashboard />;
      default:
        return <div>Peran tidak dikenal</div>;
    }
  };

  return (
    <RoleBasedLayout>
      {renderDashboard()}
    </RoleBasedLayout>
  );
};

export default Index;
