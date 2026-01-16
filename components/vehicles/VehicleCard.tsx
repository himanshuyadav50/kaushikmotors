import { Link } from 'react-router-dom';
import { Fuel, Calendar, Gauge, Settings2 } from 'lucide-react';
import { Vehicle } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const formatPrice = (price: number) => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  return `₹${(price / 100000).toFixed(2)} L`;
};

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border/50">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={vehicle.images[0]}
          alt={vehicle.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Status Badge */}
        {vehicle.status === 'sold' && (
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-base px-4 py-1">SOLD</Badge>
          </div>
        )}
        
        {vehicle.featured && vehicle.status !== 'sold' && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
            Featured
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title & Price */}
        <div className="space-y-1">
          <h3 className="font-display font-semibold text-lg text-foreground line-clamp-1">
            {vehicle.title}
          </h3>
          <p className="text-2xl font-bold text-accent">
            {formatPrice(vehicle.price)}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-accent" />
            <span>{(vehicle.mileage / 1000).toFixed(0)}k km</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4 text-accent" />
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-accent" />
            <span>{vehicle.transmission}</span>
          </div>
        </div>

        {/* CTA */}
        {vehicle.status !== 'sold' && (
          <Button variant="gold" className="w-full" asChild>
            <Link to={`/vehicles/${(vehicle as any)._id || vehicle.id}`}>View Details</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
