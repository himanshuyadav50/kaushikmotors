import { Helmet } from 'react-helmet-async';
import PublicLayout from '@/components/layout/PublicLayout';
import { defaultSettings } from '@/data/sampleData';

const PrivacyPage = () => {
  const settings = defaultSettings;

  return (
    <PublicLayout>
      <Helmet>
        <title>Privacy Policy | {settings.siteName}</title>
        <meta name="description" content={`Privacy Policy of ${settings.siteName}. Learn how we collect, use, and protect your personal information.`} />
      </Helmet>

      <section className="bg-primary py-12 lg:py-16">
        <div className="container-custom">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-primary-foreground">
            Privacy Policy
          </h1>
          <p className="text-primary-foreground/70 mt-2">Last updated: January 2024</p>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto prose prose-slate">
            <div className="space-y-8">
              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We collect information you provide directly to us, such as when you submit an enquiry,
                  contact us, or interact with our website. This may include your name, phone number,
                  email address, and any message you send us.
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
                <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                  <li>To respond to your enquiries and provide customer support</li>
                  <li>To send you information about vehicles you've shown interest in</li>
                  <li>To improve our website and services</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Information Sharing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to outside parties.
                  This does not include trusted third parties who assist us in operating our website or
                  servicing you, so long as those parties agree to keep this information confidential.
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate security measures to protect your personal information against
                  unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at{' '}
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

export default PrivacyPage;
