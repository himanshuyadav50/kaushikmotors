import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Eye, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import { vehiclesAPI, settingsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Vehicle } from '@/app/types';

const formatPrice = (price: number) =>
  price >= 10000000 ? `₹${(price / 10000000).toFixed(2)} Cr` : `₹${(price / 100000).toFixed(2)} L`;

const emptyVehicle = {
  title: '',
  brand: '',
  model: '',
  year: '',
  price: '',
  mileage: '',
  fuelType: 'Petrol',
  transmission: 'Automatic',
  status: 'available',
  featured: false,
  description: '',
  // images: [''],
  images: [] as string[],
  specs: {
    engine: '',
    power: '',
    seats: '',
    color: '',
    owners: '',
  },
};

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });





const AdminVehicles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<any>(emptyVehicle);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);




  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsAPI.get,
  });
  
  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', 'admin', search, page],
    queryFn: () =>
      vehiclesAPI.getAll({
        search: search || undefined,
        page,
        limit: 10,
      }),
  });
  
  const vehicles = Array.isArray(data) ? data : [];
  const pagination = null; // or remove pagination UI for now

  /* -------------------- MUTATIONS -------------------- */


  const deleteVehicle = useMutation({
    mutationFn: vehiclesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({ title: 'Vehicle deleted' });
    },
  });

  const createVehicle = useMutation({
    mutationFn: vehiclesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setForm(emptyVehicle);
      setShowModal(false);
      toast({ title: 'Vehicle added successfully' });
    },
  });

  const toggleFeatured = useMutation({
    mutationFn: ({ id, featured }: any) =>
      vehiclesAPI.update(id, { featured }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  /* -------------------- HANDLERS -------------------- */

  const handleDelete = (id: string) => {
    if (confirm('Delete this vehicle?')) {
      deleteVehicle.mutate(id);

    }
  };


  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      vehiclesAPI.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({ title: 'Status updated' });
    },
  });

  const availableVehicles = vehicles.filter(
    (v: any) => v.status === 'available'
  );

  
const handleSubmit = () => {
  if (!form.images || form.images.length === 0) {
    toast({
      title: 'Image required',
      description: 'Please upload at least one vehicle image',
      variant: 'destructive',
    });
    return;
  }

  createVehicle.mutate({
    ...form,
    year: Number(form.year),
    price: Number(form.price),
    mileage: Number(form.mileage),
    images: form.images, // ✅ array of base64 images
    specs: {
      engine: form.specs.engine || undefined,
      power: form.specs.power || undefined,
      seats: form.specs.seats ? Number(form.specs.seats) : undefined,
      color: form.specs.color || undefined,
      owners: form.specs.owners ? Number(form.specs.owners) : undefined,
    },
  });
};


  const handleImageChange = (index: number, value: string) => {
    const updated = [...form.images];
    updated[index] = value;
    setForm({ ...form, images: updated });
  };



  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;
  
    const MAX_SIZE = 300 * 1024; // 300KB per image
  
    // validate each file
    for (const file of Array.from(files)) {
      if (file.size > MAX_SIZE) {
        toast({
          title: 'Image too large',
          description: 'Each image must be under 300KB',
          variant: 'destructive',
        });
        return;
      }
    }
  
    // convert all to base64
    const base64Images = await Promise.all(
      Array.from(files).map(file => fileToBase64(file))
    );
  
    // append images
    setForm((prev: any) => ({
      ...prev,
      images: [...prev.images, ...base64Images],
    }));
  };
  
  
  const addImageField = () => {
    setForm({ ...form, images: [...form.images, ''] });
  };

  const removeImageField = (index: number) => {
    const updated = form.images.filter((_: any, i: number) => i !== index);
    setForm({ ...form, images: updated.length ? updated : [''] });
  };
  // console.log('VEHICLES API RESPONSE 👉', data);

const filteredVehicles = vehicles.filter((v: any) => {
  const q = searchQuery.toLowerCase();
  return (
    v.title?.toLowerCase().includes(q) ||
    v.brand?.toLowerCase().includes(q)
  );
});

  /* -------------------- UI -------------------- */

  return (
    <AdminLayout title="Vehicles">
      <Helmet>
        {settings?.siteName && <title>Vehicles | Admin - {settings?.siteName}</title>}
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative max-w-md w-full">
          {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /> */}
          <Input
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="gold" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Vehicle
        </Button>
      </div>

         {/* Table */}
<div className="bg-card border rounded-xl overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-muted/50">
        <tr className="text-muted-foreground">
          <th className="px-4 py-3 text-left font-medium">Vehicle</th>
          <th className="px-4 py-3 text-right font-medium">Price</th>
          <th className="px-4 py-3 text-center font-medium">Status</th>
          <th className="px-4 py-3 text-right font-medium">Actions</th>
        </tr>
      </thead>

      <tbody className="divide-y">
        {filteredVehicles.map((v: any) => (
          <tr
            key={v._id}
            className="hover:bg-muted/40 transition-colors"
          >
            {/* Vehicle */}
            <td className="px-4 py-3">
              <p className="font-medium leading-tight">
                {v.title || '-'}
              </p>
              <p className="text-xs text-muted-foreground">
                {v.brand || '-'} • {v.year || '-'}
              </p>
            </td>

            {/* Price */}
            <td className="px-4 py-3 text-right font-semibold">
              {v.price !== undefined ? formatPrice(v.price) : '-'}
            </td>

          {/* Status */}
<td className="px-4 py-3">
  <div className="flex items-center justify-center gap-2">
    <select
      value={v.status}
      onChange={(e) =>
        updateStatus.mutate({
          id: v._id,
          status: e.target.value,
        })
      }
      className={`
        border rounded-md px-2 py-1 text-xs font-medium outline-none
        ${v.status === 'available' && 'bg-green-50 text-green-700 border-green-300'}
        ${v.status === 'reserved' && 'bg-yellow-50 text-yellow-700 border-yellow-300'}
        ${v.status === 'sold' && 'bg-red-50 text-red-700 border-red-300'}
      `}
    >
      <option value="available">Available</option>
      <option value="reserved">Reserved</option>
      <option value="sold">Sold</option>
    </select>

    {v.featured && v.status === 'available' && (
      <Star className="w-4 h-4 fill-accent text-accent" />
    )}
  </div>
</td>


            {/* Actions */}
            <td className="px-4 py-3">
              <div className="flex justify-end gap-1">
                <Button size="icon" variant="ghost" asChild>
                  <a
                    href={`/vehicles/${v._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    toggleFeatured.mutate({
                      id: v._id,
                      featured: !v.featured,
                    })
                  }
                >
                  <Star className="w-4 h-4" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    if (confirm('Delete this vehicle?')) {
                      deleteVehicle.mutate(v._id);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Empty state */}
  {!isLoading && filteredVehicles.length === 0 && (
    <div className="text-center py-12 text-muted-foreground">
      No vehicles found
    </div>
  )}

  {/* Loading state */}
  {isLoading && (
    <div className="text-center py-12 text-muted-foreground">
      Loading vehicles…
    </div>
  )}
</div>



      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span className="px-3 py-2 text-sm">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            disabled={page === pagination.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}


      {/* ADD VEHICLE MODAL */}
     {/* MODAL */}
     {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-card w-full max-w-2xl p-6 rounded-xl space-y-4 overflow-y-auto max-h-[90vh]">

            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">Add Vehicle</h2>
              <Button size="icon" variant="ghost" onClick={() => setShowModal(false)}>
                <X />
              </Button>
            </div>

            {/* BASIC INFO */}
            <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <Input placeholder="Brand" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
            <Input placeholder="Model" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} />
            <Input placeholder="Year" type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
            <Input placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            <Input placeholder="Mileage (km)" type="number" value={form.mileage} onChange={e => setForm({ ...form, mileage: e.target.value })} />
            <textarea
  className="input min-h-[100px]"
  placeholder="Vehicle Description"
  value={form.description}
  onChange={e => setForm({ ...form, description: e.target.value })}
/>

            {/* DROPDOWNS */}
            <select className="input" value={form.fuelType} onChange={e => setForm({ ...form, fuelType: e.target.value })}>
              {['Petrol','Diesel','Electric','Hybrid','CNG'].map(v => <option key={v}>{v}</option>)}
            </select>

            <select className="input" value={form.transmission} onChange={e => setForm({ ...form, transmission: e.target.value })}>
              {['Manual','Automatic'].map(v => <option key={v}>{v}</option>)}
            </select>

            <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              {['available','sold'].map(v => <option key={v}>{v}</option>)}
            </select>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
              Featured Vehicle
            </label>

            {/* SPECS */}
            <Input placeholder="Engine (e.g. 2.0L Turbo)" value={form.specs.engine} onChange={e => setForm({ ...form, specs: { ...form.specs, engine: e.target.value } })} />
            <Input placeholder="Power (e.g. 190 HP)" value={form.specs.power} onChange={e => setForm({ ...form, specs: { ...form.specs, power: e.target.value } })} />
            <Input placeholder="Color" value={form.specs.color} onChange={e => setForm({ ...form, specs: { ...form.specs, color: e.target.value } })} />

            <select className="input" value={form.specs.seats} onChange={e => setForm({ ...form, specs: { ...form.specs, seats: e.target.value } })}>
              <option value="">Seats</option>
              {[2,4,5,7].map(n => <option key={n}>{n}</option>)}
            </select>

            <select className="input" value={form.specs.owners} onChange={e => setForm({ ...form, specs: { ...form.specs, owners: e.target.value } })}>
              <option value="">Owners</option>
              {[1,2,3].map(n => <option key={n}>{n}</option>)}
            </select>

          
          {/* IMAGE UPLOAD */}
<div className="space-y-3">
  <label className="text-sm font-medium">Vehicle Images</label>

  <Input
    type="file"
    accept="image/*"
    multiple
    onChange={handleImageUpload}
  />

  {/* Preview */}
  {form.images.length > 0 && (
  <div className="grid grid-cols-3 gap-3">
    {form.images.map((img: string, i: number) => (
      <div key={i} className="relative group">
        <img
          src={img}
          alt="preview"
          className="h-24 w-full object-cover rounded-lg border"
        />
        <button
          type="button"
          onClick={() =>
            setForm({
              ...form,
              images: form.images.filter((_, idx) => idx !== i),
            })
          }
          className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
        >
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
)}

</div>


            <Button className="w-full" onClick={handleSubmit}>
              Save Vehicle
            </Button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminVehicles;
