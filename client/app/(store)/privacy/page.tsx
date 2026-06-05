import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Lumière Cosmetics',
  description: 'Privacy Policy for Lumière Cosmetics',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-cream min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl bg-white rounded-3xl shadow-sm p-8 md:p-16">
        <h1 className="text-3xl md:text-5xl font-serif font-medium text-gray-900 mb-8 tracking-wide">
          Privacy Policy
        </h1>
        <div className="prose prose-gray max-w-none text-gray-600 font-light leading-relaxed tracking-wide space-y-6">
          <p>
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <h2 className="text-xl font-serif font-medium text-gray-900 mt-10">1. Information We Collect</h2>
          <p>
            At Lumière Cosmetics, we are committed to protecting your privacy and ensuring you have a positive experience on our website. We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This may include your name, email address, phone number, shipping and billing addresses, and payment information.
          </p>

          <h2 className="text-xl font-serif font-medium text-gray-900 mt-10">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to fulfill your orders, provide customer support, and improve our services. Specifically, we use your information to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Process and deliver your purchases</li>
            <li>Send you order confirmations and tracking updates</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Send you marketing communications (if you have opted in)</li>
            <li>Detect and prevent fraud</li>
          </ul>

          <h2 className="text-xl font-serif font-medium text-gray-900 mt-10">3. Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential (e.g., shipping carriers, payment processors).
          </p>

          <h2 className="text-xl font-serif font-medium text-gray-900 mt-10">4. Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website (such as maintaining items in your shopping cart).
          </p>

          <h2 className="text-xl font-serif font-medium text-gray-900 mt-10">5. Data Security</h2>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. All supplied sensitive/credit information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Payment gateway providers database only to be accessible by those authorized with special access rights to such systems.
          </p>

          <h2 className="text-xl font-serif font-medium text-gray-900 mt-10">6. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, update, or delete your data. If you wish to exercise any of these rights, please contact us using the information below.
          </p>

          <h2 className="text-xl font-serif font-medium text-gray-900 mt-10">7. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2 className="text-xl font-serif font-medium text-gray-900 mt-10">8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>By email: support@lumiere.com</li>
            <li>By phone: +880 1941 682148</li>
          </ul>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link href="/" className="text-primary hover:text-gray-900 font-bold uppercase tracking-widest text-xs transition-colors">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
