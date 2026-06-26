import { getReviews } from "@/lib/data";
import { PageHeader } from "@/components/dashboard/ui";
import { ReviewsManager } from "@/components/dashboard/ReviewsManager";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await getReviews();
  return (
    <div>
      <PageHeader
        title="Reviews & Testimonials"
        subtitle="Approve, feature or remove feedback. Only approved reviews appear on your public site."
      />
      <ReviewsManager initial={reviews} />
    </div>
  );
}
