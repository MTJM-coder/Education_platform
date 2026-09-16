import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";
import { TrustBanner, HowItWorks, AudienceSection } from "../components/landing/InfoSections";
import { PaymentFlow, LearningPlatform } from "../components/landing/PaymentAndLearning";
import { Testimonials, TeacherCta, Footer } from "../components/landing/SocialProofAndFooter";

export default function LandingPage() {
  return (
    <div className="font-sans">
      <Header />
      <Hero />
      <TrustBanner />
      <HowItWorks />
      <AudienceSection />
      <PaymentFlow />
      <LearningPlatform />
      <Testimonials />
      <TeacherCta />
      <Footer />
    </div>
  );
}