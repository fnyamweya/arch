import { PageContainer } from "@arch/ui-kit";

export default function StorefrontCartPage() {
  return (
    <PageContainer pageTitle="Cart" pageDescription="Review your items.">
      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">Your cart is empty.</p>
      </div>
    </PageContainer>
  );
}
