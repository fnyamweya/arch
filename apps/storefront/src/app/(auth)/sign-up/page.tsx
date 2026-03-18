import { SignUpView } from "@arch/ui-kit";

export default function StorefrontSignUpPage() {
    return (
        <SignUpView
            title="Create a customer account"
            description="Storefront accounts now use first-party Better Auth sessions with email, username, and federated login support."
            logoText="Storefront"
        />
    );
}