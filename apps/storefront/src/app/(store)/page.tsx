import { PageContainer } from "@arch/ui-kit";

export default function StorefrontStorePage() {
  return (
    <PageContainer pageTitle="Welcome" pageDescription="Browse our latest products.">
      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">Featured products coming soon.</p>
      </div>
    </PageContainer>
  );
}
