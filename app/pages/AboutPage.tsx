import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Shield, Award, Users, Target, CheckCircle } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { settingsAPI } from '@/lib/api';

const AboutPage = () => {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsAPI.get(),
  });

  const values = [
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'We believe in complete honesty about every vehicle we sell. No hidden issues, no surprises.',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Every car undergoes a rigorous 150-point inspection before being listed on our platform.',
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We go above and beyond to ensure a seamless experience.',
    },
    {
      icon: Target,
      title: 'Fair Pricing',
      description: 'Market-competitive pricing with no negotiation games. What you see is what you pay.',
    },
  ];

  const milestones = [
    'Established in 2014 with a vision to transform pre-owned car buying',
    'Sold our 100th vehicle within the first year',
    'Expanded to a state-of-the-art showroom in 2018',
    'Crossed 500+ happy customers milestone',
    'Introduced comprehensive vehicle inspection program',
    'Launched online browsing and enquiry platform',
  ];

  return (
    <PublicLayout>
      <Helmet>
        <title>About Us | {settings?.siteName || 'Car Dealership'}</title>
        <meta name="description" content={`Learn about ${settings?.siteName || 'Car Dealership'} - your trusted destination for premium pre-owned vehicles. Over 10 years of excellence in automotive retail.`} />
      </Helmet>

      {/* Hero */}
      <section className="bg-primary py-16 lg:py-24">
        <div className="container-custom">
          <div className="max-w-3xl">
            <span className="text-accent font-medium tracking-wide uppercase text-sm">About Us</span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-primary-foreground mt-2">
              Your Trusted Partner in Premium Pre-Owned Vehicles
            </h1>
            <p className="text-primary-foreground/80 text-lg mt-6 leading-relaxed">
              For over a decade, {settings?.siteName || 'Car Dealership'} has been the go-to destination for discerning
              buyers seeking quality pre-owned vehicles. We combine passion for automobiles with
              unwavering commitment to customer satisfaction.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent font-medium tracking-wide uppercase text-sm">Our Story</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mt-2">
                A Journey Built on Trust
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2014, {settings?.siteName || 'Car Dealership'} began with a simple mission: to bring
                  transparency and trust to the pre-owned car market. We saw an industry plagued
                  by uncertainty and decided to do things differently.
                </p>
                <p>
                  Today, we're proud to have served over 500 happy customers, each one a testament
                  to our commitment to quality and service. Our handpicked collection of vehicles
                  goes through rigorous inspection and certification processes.
                </p>
                <p>
                  What sets us apart is our unwavering focus on the customer experience. From the
                  moment you walk into our showroom to years after your purchase, we're here to
                  support you every step of the way.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1562141961-b5d1e0c5f684?w=800"
                  alt="Car showroom"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-xl shadow-lg">
                <p className="font-display text-3xl font-bold">10+</p>
                <p className="text-sm font-medium">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-muted">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-accent font-medium tracking-wide uppercase text-sm">Our Values</span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mt-2">
              What We Stand For
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border/50 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-accent font-medium tracking-wide uppercase text-sm">Our Journey</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mt-2">
                Milestones We're Proud Of
              </h2>
            </div>

            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-card rounded-lg p-4 border border-border/50"
                >
                  <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-foreground">{milestone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default AboutPage;
