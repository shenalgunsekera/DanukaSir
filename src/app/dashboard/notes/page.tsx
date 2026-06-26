import { getNotes, getPurchases } from "@/lib/data";
import { PageHeader } from "@/components/dashboard/ui";
import { NotesManager } from "@/components/dashboard/NotesManager";

export const dynamic = "force-dynamic";

export default async function DashboardNotesPage() {
  const [notes, purchases] = await Promise.all([getNotes(), getPurchases()]);
  const pending = purchases.filter((p) => p.status === "pending").length;
  return (
    <div>
      <PageHeader
        title="Notes & Materials"
        subtitle={
          pending > 0
            ? `${pending} payment slip${pending === 1 ? "" : "s"} awaiting verification`
            : "Upload study materials and verify student payments"
        }
      />
      <NotesManager initialNotes={notes} initialPurchases={purchases} />
    </div>
  );
}
