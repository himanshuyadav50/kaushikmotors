import { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface VehicleFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  brand: string;
  fuelType: string;
  transmission: string;
  priceRange: string;
  sortBy: string;
}

const brands = ['All Brands', 'BMW', 'Mercedes-Benz', 'Audi', 'Toyota', 'Hyundai', 'Honda'];
const fuelTypes = ['All Fuel Types', 'Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
const transmissions = ['All Transmissions', 'Automatic', 'Manual'];
const priceRanges = [
  { value: 'all', label: 'All Prices' },
  { value: '0-1500000', label: 'Under ₹15 Lakh' },
  { value: '1500000-3000000', label: '₹15 - 30 Lakh' },
  { value: '3000000-5000000', label: '₹30 - 50 Lakh' },
  { value: '5000000+', label: 'Above ₹50 Lakh' },
];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'year-new', label: 'Year: Newest' },
];

const VehicleFilters = ({ onFilterChange }: VehicleFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    brand: 'All Brands',
    fuelType: 'All Fuel Types',
    transmission: 'All Transmissions',
    priceRange: 'all',
    sortBy: 'newest',
  });

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by brand, model, or keyword..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        <Button
          variant="outline"
          className="h-12 gap-2 lg:hidden"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4" />
          Filters
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* Filters Grid */}
      <div className={`grid grid-cols-2 lg:grid-cols-5 gap-3 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
        <Select value={filters.brand} onValueChange={(v) => updateFilter('brand', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Brand" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.fuelType} onValueChange={(v) => updateFilter('fuelType', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Fuel Type" />
          </SelectTrigger>
          <SelectContent>
            {fuelTypes.map((fuel) => (
              <SelectItem key={fuel} value={fuel}>
                {fuel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.transmission} onValueChange={(v) => updateFilter('transmission', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Transmission" />
          </SelectTrigger>
          <SelectContent>
            {transmissions.map((trans) => (
              <SelectItem key={trans} value={trans}>
                {trans}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.priceRange} onValueChange={(v) => updateFilter('priceRange', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.sortBy} onValueChange={(v) => updateFilter('sortBy', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default VehicleFilters;
