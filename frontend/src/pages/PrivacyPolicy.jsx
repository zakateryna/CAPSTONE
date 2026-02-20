export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-[12px] text-[#5D172E]">
      <h1 className="text-lg font-bold uppercase mb-6">
        Privacy Policy
      </h1>

      <p className="mb-4">
        Last update: {new Date().toLocaleDateString()}
      </p>

      <h2 className="font-bold mt-6 mb-2">1. Data Controller</h2>
      <p>
        The data controller is INDEX BY ZAKA, Italy.
        Contact: hello@indexbyzaka.it
      </p>

      <h2 className="font-bold mt-6 mb-2">2. Data Collected</h2>
      <p>
        We may collect personal data such as name, email address,
        billing information, shipping address (if applicable),
        and order details.
      </p>

      <h2 className="font-bold mt-6 mb-2">3. Payment Processing</h2>
      <p>
        Payments are securely processed via third-party providers
        (e.g., Stripe). We do not store credit card information
        on our servers.
      </p>

      <h2 className="font-bold mt-6 mb-2">4. Purpose of Processing</h2>
      <p>
        Data is processed to fulfill orders, provide customer support,
        comply with legal obligations, and improve user experience.
      </p>

      <h2 className="font-bold mt-6 mb-2">5. User Rights</h2>
      <p>
        In accordance with GDPR regulations, users have the right
        to access, modify, or request deletion of their personal data.
      </p>

      <h2 className="font-bold mt-6 mb-2">6. Data Retention</h2>
      <p>
        Personal data is retained only as long as necessary to
        fulfill contractual and legal obligations.
      </p>
    </div>
  );
}
