import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { enquiriesAPI, settingsAPI } from '@/lib/api';
import { z } from 'zod';

const enquirySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  phone: z.string().trim().min(10, 'Valid phone number required').max(15),
  message: z.string().trim().min(1, 'Message is required').max(500),
});

interface EnquiryFormProps {
  vehicleId?: string;
  vehicleTitle?: string;
}

const EnquiryForm = ({ vehicleId, vehicleTitle }: EnquiryFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsAPI.get(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: vehicleTitle ? `Hi, I'm interested in the ${vehicleTitle}. Please share more details.` : '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createEnquiry = useMutation({
    mutationFn: (data: any) => enquiriesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast({
        title: 'Enquiry Submitted!',
        description: 'We will get back to you within 24 hours.',
      });
      setFormData({ name: '', phone: '', message: '' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit enquiry. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      enquirySchema.parse(formData);
      setIsSubmitting(true);
      
      await createEnquiry.mutateAsync({
        ...formData,
        vehicleId,
        vehicleTitle,
      });
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      vehicleTitle
        ? `Hi, I'm interested in the ${vehicleTitle}. Please share more details.`
        : 'Hi, I would like to enquire about your vehicles.'
    );
    window.open(`https://wa.me/${settings?.whatsapp || ''}?text=${message}`, '_blank');
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-lg border border-border/50 space-y-6">
      <div className="space-y-1">
        <h3 className="font-display text-xl font-semibold text-foreground">Send Enquiry</h3>
        <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="pl-10"
            />
          </div>
          {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="pl-10"
            />
          </div>
          {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <Textarea
            placeholder="Your Message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={4}
          />
          {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
        </div>

        <Button type="submit" variant="gold" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Submit Enquiry'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full gap-2 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
        onClick={handleWhatsApp}
      >
        <MessageSquare className="w-5 h-5" />
        Chat on WhatsApp
      </Button>
    </div>
  );
};

export default EnquiryForm;
