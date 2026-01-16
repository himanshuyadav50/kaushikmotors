import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Car, MessageSquare, TrendingUp, Clock } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminAPI, enquiriesAPI, settingsAPI } from '@/lib/api';

const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminAPI.getStats(),
  });

  const { data: enquiries = [] } = useQuery({
    queryKey: ['enquiries', 'recent'],
    queryFn: () => enquiriesAPI.getAll({ limit: 5 }),
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsAPI.get(),
  });

  const statsArray = [
    {
      title: 'Total Vehicles',
      value: stats?.totalVehicles || 0,
      icon: Car,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Vehicles',
      value: stats?.availableVehicles || 0,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Total Enquiries',
      value: stats?.totalEnquiries || 0,
      icon: MessageSquare,
      color: 'bg-purple-500',
    },
    {
      title: 'New Today',
      value: stats?.newEnquiries || 0,
      icon: Clock,
      color: 'bg-accent',
    },
  ];

  const recentEnquiries = enquiries.slice(0, 5);

  return (
    <AdminLayout title="Dashboard">
      <Helmet>
        <title>Dashboard | Admin - {settings?.siteName || 'Car Dealership'}</title>
      </Helmet>

      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsArray.map((stat, index) => (
            <div key={index} className="bg-card rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="font-display text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Enquiries */}
        <div className="bg-card rounded-xl border border-border/50">
          <div className="p-6 border-b border-border">
            <h2 className="font-display text-lg font-semibold text-foreground">Recent Enquiries</h2>
          </div>
          <div className="divide-y divide-border">
            {recentEnquiries.map((enquiry: any) => (
              <div key={enquiry._id || enquiry.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{enquiry.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {enquiry.vehicleTitle || 'General Enquiry'}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`
                    inline-flex px-2 py-1 text-xs font-medium rounded-full
                    ${enquiry.status === 'new' ? 'bg-green-100 text-green-700' :
                      enquiry.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                      enquiry.status === 'follow-up' ? 'bg-yellow-100 text-yellow-700' :
                      enquiry.status === 'converted' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'}
                  `}>
                    {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl p-6 border border-border/50">
            <h3 className="font-display font-semibold text-foreground mb-2">Add New Vehicle</h3>
            <p className="text-sm text-muted-foreground mb-4">
              List a new vehicle in your inventory with photos and specifications.
            </p>
            <a href="/admin/vehicles" className="text-accent hover:underline text-sm font-medium">
              Go to Vehicles →
            </a>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border/50">
            <h3 className="font-display font-semibold text-foreground mb-2">Manage Enquiries</h3>
            <p className="text-sm text-muted-foreground mb-4">
              View and respond to customer enquiries, update their status.
            </p>
            <a href="/admin/enquiries" className="text-accent hover:underline text-sm font-medium">
              Go to Enquiries →
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
