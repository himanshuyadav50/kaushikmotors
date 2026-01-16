import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/components/layout/PublicLayout';
import VehicleCard from '@/components/vehicles/VehicleCard';
import { vehiclesAPI, testimonialsAPI, settingsAPI } from '@/lib/api';
import heroImage from '@/assets/hero-showroom.jpg';

const HomePage = () => {
  const { data: vehicles = [], isLoading: vehiclesLoading, error: vehiclesError } = useQuery({
    queryKey: ['vehicles', 'featured'],
    queryFn: () => vehiclesAPI.getAll({ featured: true, status: 'available', limit: 3 }),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => testimonialsAPI.getAll(),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsAPI.get(),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const featuredVehicles = vehicles.slice(0, 3);

  const stats = [
    { value: '500+', label: 'Cars Sold' },
    { value: '10+', label: 'Years Experience' },
    { value: '98%', label: 'Happy Customers' },
    { value: '150+', label: 'Vehicles in Stock' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'Every vehicle undergoes a 150-point inspection before listing',
    },
    {
      icon: Award,
      title: 'Best Price Guarantee',
      description: 'Transparent pricing with no hidden charges or surprises',
    },
    {
      icon: Users,
      title: 'Trusted Service',
      description: 'Dedicated support team to assist you throughout your journey',
    },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Premium car showroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
        </div>

        {/* Content */}
        <div className="relative container-custom py-20">
          <div className="max-w-2xl space-y-6 animate-slide-up">
            <span className="inline-block text-accent font-medium tracking-wide uppercase text-sm">
            {settings?.tagline || 'Premium Cars. Trusted Deals.'}
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
              Find Your Perfect <span className="text-accent">Premium</span> Vehicle
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              Discover our handpicked collection of certified pre-owned luxury vehicles.
              Every car comes with a comprehensive inspection report and warranty.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/vehicles">
                  Browse Collection
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary py-12">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-display text-3xl lg:text-4xl font-bold text-accent">{stat.value}</p>
                <p className="text-primary-foreground/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-accent font-medium tracking-wide uppercase text-sm">Our Collection</span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mt-2">
              Featured Vehicles
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Explore our handpicked selection of premium pre-owned vehicles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="gold-outline" size="lg" asChild>
              <Link to="/vehicles">
                View All Vehicles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-muted">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-accent font-medium tracking-wide uppercase text-sm">Why Choose Us</span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mt-2">
              The Kaushik Motors Difference
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-shadow border border-border/50"
              >
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-5">
                  <feature.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-accent font-medium tracking-wide uppercase text-sm">Testimonials</span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mt-2">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-card rounded-xl p-6 shadow-md border border-border/50"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground/80 leading-relaxed mb-6">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Find Your Dream Car?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Visit our showroom or browse our online collection. Our expert team is here to help you
            find the perfect vehicle.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/vehicles">Browse Vehicles</Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default HomePage;
