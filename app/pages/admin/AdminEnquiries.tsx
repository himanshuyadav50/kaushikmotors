import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Phone, MessageSquare, ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/components/admin/AdminLayout';
import { enquiriesAPI, settingsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const statusColors: Record<string, string> = {
  new: 'bg-green-100 text-green-700',
  contacted: 'bg-blue-100 text-blue-700',
  'follow-up': 'bg-yellow-100 text-yellow-700',
  converted: 'bg-purple-100 text-purple-700',
  lost: 'bg-gray-100 text-gray-700',
};

const AdminEnquiries = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [newNote, setNewNote] = useState('');

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsAPI.get(),
  });

  const { data: enquiries = [] } = useQuery({
    queryKey: ['enquiries', { status: statusFilter, search: searchQuery }],
    queryFn: () => enquiriesAPI.getAll({ status: statusFilter !== 'all' ? statusFilter : undefined, search: searchQuery || undefined }),
  });

  const updateEnquiryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => enquiriesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
    toast({
      title: 'Status Updated',
        description: 'Enquiry status has been updated.',
    });
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => enquiriesAPI.addNote(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      if (selectedEnquiry) {
        setSelectedEnquiry({ ...selectedEnquiry, notes: [...(selectedEnquiry.notes || []), newNote.trim()] });
      }
    toast({
      title: 'Note Added',
      description: 'Your note has been saved.',
    });
    setNewNote('');
    },
  });

  const handleStatusChange = (enquiryId: string, newStatus: string) => {
    updateEnquiryMutation.mutate({ id: enquiryId, data: { status: newStatus } });
    if (selectedEnquiry && (selectedEnquiry._id || selectedEnquiry.id) === enquiryId) {
      setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedEnquiry) return;
    addNoteMutation.mutate({ id: selectedEnquiry._id || selectedEnquiry.id, note: newNote.trim() });
  };

  return (
    <AdminLayout title="Enquiries">
      <Helmet>
        <title>Enquiries | Admin - {settings?.siteName || 'Car Dealership'}</title>
      </Helmet>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Enquiries List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Enquiries Table */}
          <div className="bg-card rounded-xl border border-border/50 divide-y divide-border">
            {enquiries.map((enquiry: any) => (
              <button
                key={enquiry._id || enquiry.id}
                onClick={() => setSelectedEnquiry(enquiry)}
                className={`w-full text-left p-4 hover:bg-muted/30 transition-colors ${
                  (selectedEnquiry?._id || selectedEnquiry?.id) === (enquiry._id || enquiry.id) ? 'bg-muted/50' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{enquiry.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[enquiry.status]}`}>
                        {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{enquiry.phone}</p>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {enquiry.vehicleTitle || 'General Enquiry'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </p>
                    <ChevronDown className="w-4 h-4 text-muted-foreground mt-2 rotate-[-90deg]" />
                  </div>
                </div>
              </button>
            ))}

            {enquiries.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No enquiries found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Enquiry Detail */}
        <div className="lg:col-span-1">
          {selectedEnquiry ? (
            <div className="bg-card rounded-xl border border-border/50 p-6 sticky top-24 space-y-6">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {selectedEnquiry.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-accent" />
                  <a href={`tel:${selectedEnquiry.phone}`} className="text-foreground hover:text-accent">
                    {selectedEnquiry.phone}
                  </a>
                </div>
                {selectedEnquiry.email && (
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-accent" />
                    <a href={`mailto:${selectedEnquiry.email}`} className="text-foreground hover:text-accent">
                      {selectedEnquiry.email}
                    </a>
                  </div>
                )}
              </div>

              {selectedEnquiry.vehicleTitle && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Vehicle Interest</p>
                  <a
                    href={`/vehicles/${selectedEnquiry.vehicleId?._id || selectedEnquiry.vehicleId}`}
                    target="_blank"
                    className="text-sm text-foreground hover:text-accent flex items-center gap-1"
                  >
                    {selectedEnquiry.vehicleTitle}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-foreground mb-2">Message</p>
                <p className="text-muted-foreground text-sm bg-muted p-3 rounded-lg">
                  {selectedEnquiry.message}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-2">Status</p>
                <Select
                  value={selectedEnquiry.status}
                  onValueChange={(v) => handleStatusChange(selectedEnquiry._id || selectedEnquiry.id, v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedEnquiry.notes && selectedEnquiry.notes.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Notes</p>
                  <div className="space-y-2">
                    {selectedEnquiry.notes.map((note: string, index: number) => (
                      <p key={index} className="text-sm text-muted-foreground bg-muted p-2 rounded">
                        {note}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-foreground mb-2">Add Note</p>
                <Textarea
                  placeholder="Add internal note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <Button
                  variant="gold"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || addNoteMutation.isPending}
                >
                  Add Note
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border/50 p-6 text-center">
              <p className="text-muted-foreground">Select an enquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEnquiries;
