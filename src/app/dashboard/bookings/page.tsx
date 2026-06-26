import { getBookings } from "@/lib/data";
import { PageHeader } from "@/components/dashboard/ui";
import { BookingsManager } from "@/components/dashboard/BookingsManager";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const bookings = await getBookings();
  const newCount = bookings.filter((b) => b.status === "new").length;
  return (
    <div>
      <PageHeader
        title="Consultation Requests"
        subtitle={
          newCount > 0
            ? `${newCount} new request${newCount === 1 ? "" : "s"} waiting for a reply`
            : "Booking requests from your homepage appear here"
        }
      />
      <BookingsManager initial={bookings} />
    </div>
  );
}
