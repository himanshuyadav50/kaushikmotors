import { Helmet } from 'react-helmet-async';
import PublicLayout from '@/components/layout/PublicLayout';
import { defaultSettings } from '@/data/sampleData';

const TermsPage = () => {
  const settings = defaultSettings;

  return (
    <PublicLayout>
      <Helmet>
        <title>Terms of Service | {settings.siteName}</title>
        <meta name="description" content={`Terms of Service for ${settings.siteName}. Read our terms and conditions for using our services.`} />
      </Helmet>

      <section className="bg-primary py-12 lg:py-16">
        <div className="container-custom">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-primary-foreground">
            Terms of Service
          </h1>
          <p className="text-primary-foreground/70 mt-2">Last updated: January 2026</p>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using this website, you accept and agree to be bound by the terms and
                  provisions of this agreement. If you do not agree to abide by these terms, please do
                  not use this website.
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Vehicle Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  While we strive to provide accurate and up-to-date information about our vehicles,
                  we cannot guarantee that all information is complete or error-free. Prices, specifications,
                  and availability are subject to change without notice. We recommend contacting us directly
                  to confirm details before making a purchase decision.
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Vehicle Condition</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All vehicles sold are pre-owned and sold "as-is" unless otherwise stated. While we conduct
                  thorough inspections, we recommend independent verification before purchase. Any warranties
                  or guarantees will be explicitly stated in the sale agreement.
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Enquiries & Communication</h2>
                <p className="text-muted-foreground leading-relaxed">
                  When you submit an enquiry through our website, you consent to receive communications
                  from us regarding your enquiry. We may contact you via phone, email, or WhatsApp to
                  respond to your request.
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {settings.siteName} shall not be liable for any direct, indirect, incidental, special,
                  or consequential damages that result from the use of, or the inability to use, this
                  website or any information provided on this website.
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These terms shall be governed by and construed in accordance with the laws of India.
                  Any disputes arising from these terms shall be subject to the exclusive jurisdiction
                  of the courts in Bangalore, Karnataka.
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For any questions regarding these Terms of Service, please contact us at{' '}
                  <a href={`mailto:${settings.email}`} className="text-accent hover:underline">
                    {settings.email}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default TermsPage;
