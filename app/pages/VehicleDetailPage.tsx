import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Fuel, Calendar, Gauge, Settings2, Users, Palette, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PublicLayout from '@/components/layout/PublicLayout';
import EnquiryForm from '@/components/vehicles/EnquiryForm';
import VehicleCard from '@/components/vehicles/VehicleCard';
import { vehiclesAPI, settingsAPI } from '@/lib/api';

const formatPrice = (price: number) => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  return `₹${(price / 100000).toFixed(2)} Lakh`;
};

const VehicleDetailPage = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehiclesAPI.getById(id!),
    enabled: !!id,
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsAPI.get(),
  });

  const { data: relatedVehicles = [] } = useQuery({
    queryKey: ['vehicles', 'related', vehicle?._id || vehicle?.id],
    queryFn: () => vehiclesAPI.getAll({ status: 'available', limit: 3 }),
    enabled: !!vehicle,
    select: (data) => data.filter((v: any) => (v._id || v.id) !== (vehicle?._id || vehicle?.id)).slice(0, 3),
  });

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container-custom py-20 text-center">
          <p className="text-muted-foreground">Loading vehicle details...</p>
        </div>
      </PublicLayout>
    );
  }

  if (!vehicle) {
    return (
      <PublicLayout>
        <div className="container-custom py-20 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">Vehicle Not Found</h1>
          <Button asChild>
            <Link to="/vehicles">Back to Vehicles</Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  const specs = [
    { icon: Calendar, label: 'Year', value: vehicle.year.toString() },
    { icon: Gauge, label: 'Mileage', value: `${(vehicle.mileage / 1000).toFixed(0)}k km` },
    { icon: Fuel, label: 'Fuel Type', value: vehicle.fuelType },
    { icon: Settings2, label: 'Transmission', value: vehicle.transmission },
    { icon: Users, label: 'Seats', value: vehicle.specs.seats?.toString() || 'N/A' },
    { icon: Palette, label: 'Color', value: vehicle.specs.color || 'N/A' },
    { icon: User, label: 'Owners', value: vehicle.specs.owners?.toString() || 'N/A' },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
  };

  return (
    <PublicLayout>
      <Helmet>
        <title>{vehicle.title} | {settings?.siteName || 'Car Dealership'}</title>
        <meta name="description" content={`${vehicle.title} - ${vehicle.fuelType}, ${vehicle.transmission}, ${vehicle.mileage} km. ${vehicle.description.slice(0, 150)}`} />
      </Helmet>

      <div className="bg-background">
        {/* Breadcrumb */}
        <div className="container-custom py-4">
          <Button variant="ghost" size="sm" className="gap-2" asChild>
            <Link to="/vehicles">
              <ArrowLeft className="w-4 h-4" />
              Back to Vehicles
            </Link>
          </Button>
        </div>

        <div className="container-custom pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-muted">
                  <img
                    src={vehicle.images[currentImageIndex]}
                    alt={vehicle.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {vehicle.status === 'sold' && (
                    <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                      <Badge variant="destructive" className="text-xl px-6 py-2">SOLD</Badge>
                    </div>
                  )}
                  
                  {vehicle.featured && vehicle.status !== 'sold' && (
                    <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                      Featured
                    </Badge>
                  )}

                  {vehicle.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {vehicle.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {vehicle.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex ? 'border-accent' : 'border-transparent'
                        }`}
                      >
                        <img src={image} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Price (Mobile) */}
              <div className="lg:hidden space-y-4">
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">{vehicle.title}</h1>
                  <p className="text-3xl font-bold text-accent mt-2">{formatPrice(vehicle.price)}</p>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">Specifications</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {specs.map((spec, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <spec.icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{spec.label}</p>
                        <p className="font-medium text-foreground">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{vehicle.description}</p>
              </div>

              {/* Engine Details */}
              {(vehicle.specs.engine || vehicle.specs.power) && (
                <div className="bg-card rounded-xl p-6 border border-border/50">
                  <h2 className="font-display text-lg font-semibold text-foreground mb-4">Engine & Performance</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {vehicle.specs.engine && (
                      <div>
                        <p className="text-sm text-muted-foreground">Engine</p>
                        <p className="font-medium text-foreground">{vehicle.specs.engine}</p>
                      </div>
                    )}
                    {vehicle.specs.power && (
                      <div>
                        <p className="text-sm text-muted-foreground">Power</p>
                        <p className="font-medium text-foreground">{vehicle.specs.power}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Enquiry Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Title & Price (Desktop) */}
                <div className="hidden lg:block space-y-2">
                  <h1 className="font-display text-2xl font-bold text-foreground">{vehicle.title}</h1>
                  <p className="text-3xl font-bold text-accent">{formatPrice(vehicle.price)}</p>
                </div>

                <EnquiryForm vehicleId={vehicle._id || vehicle.id} vehicleTitle={vehicle.title} />
              </div>
            </div>
          </div>

          {/* Related Vehicles */}
          {relatedVehicles.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl font-bold text-foreground mb-8">You May Also Like</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedVehicles.map((v: any) => (
                  <VehicleCard key={v._id || v.id} vehicle={v} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default VehicleDetailPage;
