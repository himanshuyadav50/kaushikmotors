import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/components/admin/AdminLayout';
import { settingsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsAPI.get(),
  });

  const [settings, setSettings] = useState({
    siteName: '',
    tagline: '',
    phone: '',
    email: '',
    whatsapp: '',
    address: '',
    facebook: '',
    instagram: '',
    youtube: '',
  });

  useEffect(() => {
    if (settingsData) {
      setSettings({
        siteName: settingsData.siteName || '',
        tagline: settingsData.tagline || '',
        phone: settingsData.phone || '',
        email: settingsData.email || '',
        whatsapp: settingsData.whatsapp || '',
        address: settingsData.address || '',
        facebook: settingsData.socialLinks?.facebook || '',
        instagram: settingsData.socialLinks?.instagram || '',
        youtube: settingsData.socialLinks?.youtube || '',
  });
    }
  }, [settingsData]);

  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) => settingsAPI.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    toast({
      title: 'Settings Saved',
      description: 'Your website settings have been updated.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save settings.',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    updateSettingsMutation.mutate({
      siteName: settings.siteName,
      tagline: settings.tagline,
      phone: settings.phone,
      email: settings.email,
      whatsapp: settings.whatsapp,
      address: settings.address,
      socialLinks: {
        facebook: settings.facebook,
        instagram: settings.instagram,
        youtube: settings.youtube,
      },
    });
  };

  return (
    <AdminLayout title="Settings">
      <Helmet>
        <title>Settings | Admin - {settingsData?.siteName || 'Car Dealership'}</title>
      </Helmet>

      <div className="max-w-3xl space-y-8">
        {/* General Settings */}
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-6">General Settings</h2>
          <div className="grid gap-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Site Name</label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tagline</label>
                <Input
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-6">Contact Information</h2>
          <div className="grid gap-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                <Input
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">WhatsApp Number</label>
              <Input
                placeholder="+919876543210"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">Include country code without spaces</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Address</label>
              <Textarea
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-6">Social Media Links</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Facebook URL</label>
              <Input
                placeholder="https://facebook.com/yourpage"
                value={settings.facebook}
                onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Instagram URL</label>
              <Input
                placeholder="https://instagram.com/yourpage"
                value={settings.instagram}
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">YouTube URL</label>
              <Input
                placeholder="https://youtube.com/yourchannel"
                value={settings.youtube}
                onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button variant="gold" size="lg" className="gap-2" onClick={handleSave} disabled={updateSettingsMutation.isPending}>
            <Save className="w-4 h-4" />
            {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
