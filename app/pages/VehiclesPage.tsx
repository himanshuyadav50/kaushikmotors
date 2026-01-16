import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import PublicLayout from '@/components/layout/PublicLayout';
import VehicleCard from '@/components/vehicles/VehicleCard';
import VehicleFilters, { FilterState } from '@/components/vehicles/VehicleFilters';
import { vehiclesAPI, settingsAPI } from '@/lib/api';

const VehiclesPage = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    brand: 'All Brands',
    fuelType: 'All Fuel Types',
    transmission: 'All Transmissions',
    priceRange: 'all',
    sortBy: 'newest',
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsAPI.get(),
  });

  // Build API query params
  const queryParams = useMemo(() => {
    const params: any = { status: 'available' };
    
    if (filters.brand !== 'All Brands') {
      params.brand = filters.brand;
    }

    if (filters.fuelType !== 'All Fuel Types') {
      params.fuelType = filters.fuelType;
    }

    if (filters.transmission !== 'All Transmissions') {
      params.transmission = filters.transmission;
    }

    if (filters.search) {
      params.search = filters.search;
    }
    
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map((p) => parseInt(p.replace('+', '')));
        if (filters.priceRange.includes('+')) {
        params.minPrice = min;
      } else {
        params.minPrice = min;
        params.maxPrice = max;
      }
    }
    
    params.sortBy = filters.sortBy;
    
    return params;
  }, [filters]);

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles', queryParams],
    queryFn: () => vehiclesAPI.getAll(queryParams),
  });

  const filteredVehicles = vehicles;

  return (
    <PublicLayout>
      <Helmet>
        <title>Browse Vehicles | {settings?.siteName || 'Car Dealership'}</title>
        <meta name="description" content="Explore our collection of premium pre-owned vehicles. Find your perfect car with our comprehensive filters and detailed listings." />
      </Helmet>

      {/* Header */}
      <section className="bg-primary py-12 lg:py-16">
        <div className="container-custom">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-primary-foreground">
            Browse Our Collection
          </h1>
          <p className="text-primary-foreground/70 mt-2">
            {filteredVehicles.length} vehicles available
          </p>
        </div>
      </section>

      {/* Filters & Grid */}
      <section className="py-8 lg:py-12 bg-background">
        <div className="container-custom space-y-8">
          <VehicleFilters onFilterChange={setFilters} />

          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Loading vehicles...</p>
            </div>
          ) : filteredVehicles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id || vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No vehicles found matching your criteria.</p>
              <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
};

export default VehiclesPage;
