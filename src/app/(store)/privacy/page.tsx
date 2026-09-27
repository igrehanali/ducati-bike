import type { Metadata } from "next"
import Link from "next/link"

import { PolicyLayout, PolicyTable, type PolicySection } from "@/components/content/policy-layout"
import { showroom } from "@/lib/experiences"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Vellora Moto UK collects, uses and protects your personal data under UK GDPR and the Data Protection Act 2018.",
}

const privacyEmail = "privacy@velloramoto.co.uk"

const sections: PolicySection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    content: (
      <>
        <p>
          Vellora Moto UK (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is an official Vellora dealer based at {showroom.address.join(", ")}. We are the controller of the personal
          data described in this policy and are registered with the Information Commissioner&apos;s Office (ICO).
        </p>
        <p>
          We process personal data in line with the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018 and the Privacy and Electronic
          Communications Regulations (PECR).
        </p>
      </>
    ),
  },
  {
    id: "data-we-collect",
    title: "Data we collect",
    content: (
      <>
        <p>Depending on how you use our website, showroom and workshop, we may collect:</p>
        <ul>
          <li>
            <strong>Identity & contact data</strong> — your name, email address, phone number, delivery and billing addresses.
          </li>
          <li>
            <strong>Order data</strong> — items purchased, order history, returns and gift card details.
          </li>
          <li>
            <strong>Payment data</strong> — handled by our PCI DSS-compliant payment providers. We only see the card type and last four digits.
          </li>
          <li>
            <strong>Vehicle data</strong> — model, registration and mileage when you book a service or MOT.
          </li>
          <li>
            <strong>Track day data</strong> — riding experience, emergency contact details and any information you choose to share about your fitness to ride.
          </li>
          <li>
            <strong>Technical data</strong> — IP address, browser, device and how you use our site, collected through cookies.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use your data",
    content: (
      <>
        <PolicyTable
          caption="Purposes and lawful bases for processing"
          columns={["Purpose", "Lawful basis"]}
          rows={[
            ["Processing and delivering your orders, returns and refunds", "Contract"],
            ["Booking and carrying out services, MOTs and track days", "Contract"],
            ["Keeping tax and accounting records", "Legal obligation"],
            ["Preventing fraud and keeping our site secure", "Legitimate interests"],
            ["Improving our website and product range", "Legitimate interests"],
            ["Sending marketing emails and offers", "Consent (you can withdraw at any time)"],
          ]}
        />
        <p>We never sell your personal data. We don&apos;t make decisions about you based solely on automated processing.</p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    content: (
      <>
        <p>We only share your data with trusted partners who help us run our business, under contracts that require them to keep it secure:</p>
        <ul>
          <li>Couriers and Royal Mail, to deliver and collect parcels</li>
          <li>Payment providers, to take payments and prevent fraud</li>
          <li>Vellora UK Ltd and Vellora Motor Holding S.p.A., for warranty registration and recalls</li>
          <li>Track day circuits and insurers, for event bookings</li>
          <li>Email, hosting and analytics providers</li>
        </ul>
        <p>
          Where a provider processes data outside the UK, we make sure appropriate safeguards are in place, such as the UK International Data Transfer Agreement or an
          adequacy decision.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    content: (
      <>
        <p>We use a small number of cookies and similar technologies:</p>
        <PolicyTable
          caption="Types of cookies"
          columns={["Type", "What it does", "Consent"]}
          rows={[
            ["Strictly necessary", "Keeps your bag, sign-in and checkout working", "Not required"],
            ["Preferences", "Remembers choices such as recently viewed items", "Required"],
            ["Analytics", "Helps us understand which pages are useful", "Required"],
            ["Marketing", "Measures our adverts and personalises offers", "Required"],
          ]}
        />
        <p>You can change your cookie choices at any time from the cookie settings link in the footer or in your browser settings.</p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    content: (
      <>
        <p>
          We keep order and service records for six years to meet HMRC requirements, and vehicle service history for the life of our dealership records so we can support
          warranty claims. Marketing preferences are kept until you unsubscribe. Account data is deleted 30 days after you ask us to close your account.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    content: (
      <>
        <p>Under UK GDPR you have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Ask us to correct inaccurate or incomplete data</li>
          <li>Ask us to delete your data, where we have no legal reason to keep it</li>
          <li>Restrict or object to how we use your data, including for direct marketing</li>
          <li>Receive your data in a portable format</li>
          <li>Withdraw consent at any time, where we rely on consent</li>
        </ul>
        <p>We&apos;ll respond to any request within one month. There&apos;s no charge in most cases.</p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact & complaints",
    content: (
      <>
        <p>
          To exercise your rights or ask a question about this policy, email <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a>, use our{" "}
          <Link href="/contact">contact form</Link>, or write to the Data Protection Lead, {showroom.address.join(", ")}.
        </p>
        <p>
          If you&apos;re unhappy with how we&apos;ve handled your data, you can complain to the Information Commissioner&apos;s Office at{" "}
          <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noreferrer">
            ico.org.uk
          </a>{" "}
          or on 0303 123 1113.
        </p>
      </>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <PolicyLayout
      title="Privacy policy"
      description="How we collect, use and protect your personal information — and the rights you have over it."
      crumb="Privacy Policy"
      updated="1 September 2026"
      sections={sections}
    />
  )
}
