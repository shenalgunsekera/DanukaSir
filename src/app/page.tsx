import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { Hero } from "@/components/site/Hero";
import { StatsSection } from "@/components/site/StatsSection";
import { AboutSection } from "@/components/site/AboutSection";
import { SuccessStories } from "@/components/site/SuccessStories";
import { Credentials } from "@/components/site/Credentials";
import { Milestones } from "@/components/site/Milestones";
import { ReviewsSection } from "@/components/site/ReviewsSection";
import { ContactSection } from "@/components/site/ContactSection";
import { getProfile, getPublicReviews } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profile, reviews] = await Promise.all([getProfile(), getPublicReviews()]);
  const { sections } = profile;

  return (
    <main className="relative isolate">
      <AnimatedBackground theme={profile.theme} />
      <ScrollProgress />
      <Navbar />
      <Hero profile={profile} />
      {sections.stats && <StatsSection stats={profile.stats} />}
      <AboutSection profile={profile} />
      {sections.successStories && <SuccessStories stories={profile.successStories} />}
      {sections.qualifications && <Credentials profile={profile} />}
      {sections.milestones && <Milestones milestones={profile.milestones} />}
      {sections.reviews && <ReviewsSection reviews={reviews} />}
      {sections.contact && <ContactSection profile={profile} />}
      <Footer profile={profile} />
    </main>
  );
}
