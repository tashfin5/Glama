import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Lumière Cosmetics',
  description: 'Terms of Service for Lumière Cosmetics',
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-cream min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl bg-white rounded-3xl shadow-sm p-8 md:p-16">
        <h1 className="text-3xl md:text-5xl font-serif font-medium text-gray-900 mb-8 tracking-wide">
          Terms of Service
        </h1>
        <div className="prose prose-gray max-w-none text-gray-600 font-light leading-relaxed tracking-wide space-y-6">
          <p>
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <h2 className="text-xl font-serif font-medium text-gray-900 mt-10">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Lumière Cosmetics website, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
          </p>

          <h2 className="text-xl font-serif font-medium text-gray-900 mt-10">2. Online Store Terms</h2>
          <p>
            By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
          </p>

          <h2 className="text-xl font-serif font-medium text-gray-900 mt-10">3. Products or Services</h2>
          <p>
            Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy. We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.
          </p>

          <h2 className="text-xl font-serif font-medium text-gray-900 mt-10">4. Modifications to the Service and Prices</h2>
          <p>
            Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.
          </p>

          <h2 className="text-xl font-serif font-medium text-gray-900 mt-10">5. Accuracy of Billing and Account Information</h2>
          <p>
            We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made. You agree to provide current, complete and accurate purchase and account information for all purchases made at our store.
          </p>

          <h2 className="text-xl font-serif font-medium text-gray-900 mt-10">6. Third-Party Links</h2>
          <p>
            Certain content, products and services available via our Service may include materials from third-parties. Third-party links on this site may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy and we do not warrant and will not have any liability or responsibility for any third-party materials or websites.
          </p>

          <h2 className="text-xl font-serif font-medium text-gray-900 mt-10">7. Disclaimer of Warranties; Limitation of Liability</h2>
          <p>
            We do not guarantee, represent or warrant that your use of our service will be uninterrupted, timely, secure or error-free. We do not warrant that the results that may be obtained from the use of the service will be accurate or reliable. In no case shall Lumière Cosmetics, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.
          </p>

          <h2 className="text-xl font-serif font-medium text-gray-900 mt-10">8. Changes to Terms of Service</h2>
          <p>
            You can review the most current version of the Terms of Service at any time at this page. We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes.
          </p>
          
          <h2 className="text-xl font-serif font-medium text-gray-900 mt-10">9. Contact Information</h2>
          <p>
            Questions about the Terms of Service should be sent to us at support@lumiere.com.
          </p>
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
