import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import PublicLayout from '@/components/layout/PublicLayout';
import { enquiriesAPI, settingsAPI } from '@/lib/api';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Valid email required').max(255),
  phone: z.string().trim().min(10, 'Valid phone required').max(15),
  message: z.string().trim().min(1, 'Message is required').max(1000),
});

const ContactPage = () => {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsAPI.get(),
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createEnquiryMutation = useMutation({
    mutationFn: (data: any) => enquiriesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast({
        title: 'Message Sent!',
        description: 'Thank you for reaching out. We will get back to you soon.',
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      contactSchema.parse(formData);
      createEnquiryMutation.mutate(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hi, I would like to know more about your vehicles.');
    window.open(`https://wa.me/${settings?.whatsapp || ''}?text=${message}`, '_blank');
  };

  const contactInfo = [
    { icon: MapPin, label: 'Address', value: settings?.address || '' },
    { icon: Phone, label: 'Phone', value: settings?.phone || '', href: `tel:${settings?.phone || ''}` },
    { icon: Mail, label: 'Email', value: settings?.email || '', href: `mailto:${settings?.email || ''}` },
    { icon: Clock, label: 'Hours', value: 'Mon - Sat: 10AM - 7PM, Sunday: Closed' },
  ];

  return (
    <PublicLayout>
      <Helmet>
        <title>Contact Us | {settings?.siteName || 'Car Dealership'}</title>
        <meta name="description" content={`Get in touch with ${settings?.siteName || 'Car Dealership'}. Visit our showroom or reach out via phone, email, or WhatsApp.`} />
      </Helmet>

      {/* Hero */}
      <section className="bg-primary py-16 lg:py-20">
        <div className="container-custom">
          <div className="max-w-2xl">
            <span className="text-accent font-medium tracking-wide uppercase text-sm">Contact Us</span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-primary-foreground mt-2">
              Let's Connect
            </h1>
            <p className="text-primary-foreground/80 text-lg mt-4">
              Have questions about a vehicle or want to schedule a visit? We're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-foreground hover:text-accent transition-colors">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-foreground">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-green-500 text-green-600 hover:bg-green-50"
                onClick={handleWhatsApp}
              >
                <MessageSquare className="w-5 h-5" />
                Chat on WhatsApp
              </Button>

              {/* Map Placeholder */}
              <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12120.832106806096!2d77.32394170570636!3d28.385889612801773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cdcf58cc32d7f%3A0x5f14c5e44840e27b!2sSector%2013%2C%20Faridabad%2C%20Haryana!5e1!3m2!1sen!2sin!4v1767881037603!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Showroom Location"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card rounded-xl p-8 shadow-lg border border-border/50">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <Input
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                  <Input
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <Textarea
                    placeholder="Tell us how we can help..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                  {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
                </div>

                <Button type="submit" variant="gold" size="lg" className="w-full" disabled={createEnquiryMutation.isPending}>
                  {createEnquiryMutation.isPending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default ContactPage;
