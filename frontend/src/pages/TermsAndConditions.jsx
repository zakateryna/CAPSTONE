export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-[12px] text-[#5D172E]">
      <h1 className="text-lg font-bold uppercase mb-6">
        Terms and Conditions
      </h1>

      <p className="mb-4">
        Last update: {new Date().toLocaleDateString()}
      </p>

      <h2 className="font-bold mt-6 mb-2">1. General</h2>
      <p>
        These terms govern the purchase and use of products
        available on INDEX BY ZAKA.
      </p>

      <h2 className="font-bold mt-6 mb-2">2. Products</h2>
      <p>
        Products may include digital downloads and/or physical prints.
        Colors and appearance may vary slightly depending on screen settings.
      </p>

      <h2 className="font-bold mt-6 mb-2">3. Pricing</h2>
      <p>
        All prices are displayed in EUR and may be subject
        to change without notice.
      </p>

      <h2 className="font-bold mt-6 mb-2">4. Payments</h2>
      <p>
        Payments are processed securely via third-party providers.
      </p>

      <h2 className="font-bold mt-6 mb-2">5. Refund Policy</h2>
      <p>
        Digital products are non-refundable once downloaded.
        For physical items, customers may request assistance
        within 14 days of delivery.
      </p>

      <h2 className="font-bold mt-6 mb-2">6. Intellectual Property</h2>
      <p>
        All images and materials remain the intellectual property
        of INDEX BY ZAKA and may not be reproduced without permission.
      </p>
    </div>
  );
}
