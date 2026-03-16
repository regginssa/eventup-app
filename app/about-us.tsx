import { Tabs } from "@/components";
import { SimpleContainer } from "@/components/organisms/layout";
import { TDropdownItem } from "@/types";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

const privacyPolicyText = `
Privacy Policy
EventWorld Mobile Application

Effective Date: March 15, 2026
Last Updated: March 15, 2026

1. Who we are – Data Controller

The controller of your personal data is:

Charlie Unicorn AI sp. z o.o.
KRS: 0001191369
NIP: 4990709230
REGON: 542576074
Registered office: [insert full registered office address]
Email: team@charlieunicornai.eu

(referred to as “we”, “us”, “EventWorld”, or “the Company”).

2. What personal data do we collect?

Depending on how you use the EventWorld app, we may collect and process the following categories of data:

Account and registration data
• email address
• phone number (optional)
• username
• password (hashed)
• name (if provided)

Profile data
• profile picture
• bio
• preferred event categories
• favorite locations
• language

Location data
• precise or approximate geolocation (if you enable location services to show nearby events)

Device and technical data
• device model
• operating system (iOS/Android)
• app version
• IP address
• advertising identifiers (IDFA/AAID)
• browser information

Usage and event data
• search queries
• saved or bookmarked events
• purchased tickets
• browsing activity within the app

Payment and transaction data
• cryptocurrency wallet address (when paying with crypto)
• transaction amount
• currency (BabyU, Charlie tokens, or other cryptocurrencies)
• public blockchain transaction details (TXID, timestamp)

Card, Apple Pay, or Google Pay payments are processed by PCI DSS compliant payment providers such as Stripe. We do not store full card details.

Premium / organizer data
• event title
• event description
• event date
• venue location
• ticket price
• available spots
• event images
• attendee data (when you sell tickets as a premium organizer)

Communication data
• in-app messages
• support tickets
• reviews
• feedback

3. Why and on what legal basis do we process your data?

We process your personal data based on one or more of the following legal grounds:

• Performance of a contract – to provide the EventWorld services you request (account creation, ticket purchases, event bookings)
• Consent – when you allow optional features such as location services or marketing communications
• Legal obligations – such as tax, accounting, or anti-money-laundering requirements
• Legitimate interests – including improving our services, preventing fraud, and reducing intermediary fees for crypto payments

4. Cryptocurrency payments & BabyU / Charlie tokens

Cryptocurrency payments are processed directly on the blockchain.

We do not store or have access to your private keys or seed phrases.

Wallet addresses and transaction histories are publicly visible on the blockchain by design and cannot be modified or deleted.

Crypto payments and related discounts may be processed based on our legitimate interest in reducing intermediary payment fees.

5. Who do we share your data with?

We may share your data with:

• Cloud and infrastructure providers (such as AWS or equivalent services)
• Payment processors (such as Stripe or crypto gateways)
• Booking or travel partners (hotel APIs, flight aggregators)
• Analytics providers (such as Firebase or AppsFlyer, usually using aggregated or pseudonymized data)
• Public authorities when required by law
• A new entity in case of merger, acquisition, or asset sale

6. International data transfers

Some service providers may be located outside the European Economic Area (EEA).

In such cases we rely on appropriate safeguards including:

• Standard Contractual Clauses (SCCs)
• Adequacy decisions by the European Commission
• Other GDPR-approved transfer mechanisms

7. How long do we keep your data?

Active account data
• stored for the duration of account use and up to 90 days after deletion

Transaction and payment records
• stored for 5–10 years to comply with tax, accounting, and AML obligations

Analytics data
• stored up to 26 months depending on analytics provider settings

After account deletion we anonymize or erase personal data unless legal obligations require retention.

8. Your rights under GDPR

You have the right to:

• Access your personal data
• Rectify inaccurate data
• Erase your data ("right to be forgotten") – subject to blockchain limitations
• Restrict processing
• Data portability
• Object to processing
• Withdraw consent where applicable
• Lodge a complaint with the supervisory authority

In Poland the supervisory authority is:

President of the Personal Data Protection Office (UODO)
https://www.uodo.gov.pl

To exercise your rights contact us at:
team@charlieunicornai.eu

9. Security

We implement industry-standard security measures including:

• TLS 1.3 encryption in transit
• password hashing
• optional two-factor authentication (2FA)
• regular security audits

However, blockchain transactions are public and irreversible by nature.

10. Children

The EventWorld app is not intended for individuals under the age of 16.

We do not knowingly collect personal data from individuals under 16. If such data is discovered it will be deleted.

11. Changes to this Privacy Policy

We may update this Privacy Policy from time to time.

If material changes occur we will notify users via in-app notification or email.

12. Contact

If you have any questions regarding this Privacy Policy please contact:

team@charlieunicornai.eu

Charlie Unicorn AI sp. z o.o.
KRS 0001191369
NIP 4990709230
REGON 542576074
`;

const termsOfServiceText = `
Terms of Service
EventWorld Mobile Application

Effective Date: March 15, 2026
Last Updated: March 15, 2026

1. Introduction

Welcome to EventWorld.

These Terms of Service ("Terms") govern your use of the EventWorld mobile application and related services provided by Charlie Unicorn AI sp. z o.o.

By creating an account or using the EventWorld application, you agree to these Terms. If you do not agree to these Terms, you must not use the application.

2. Company Information

EventWorld is operated by:

Charlie Unicorn AI sp. z o.o.
KRS: 0001191369
NIP: 4990709230
REGON: 542576074
Email: team@charlieunicornai.eu

3. Eligibility

To use EventWorld you must:

• be at least 16 years old
• have the legal capacity to enter into binding agreements
• comply with all applicable laws and regulations

The application is not intended for individuals under 16 years of age.

4. User Accounts

To access certain features of the app, you may be required to create an account.

You agree to:

• provide accurate and complete information
• keep your login credentials secure
• notify us immediately of any unauthorized use of your account

You are responsible for all activity that occurs under your account.

We reserve the right to suspend or terminate accounts that violate these Terms.

5. Event Listings and Organizers

EventWorld allows users and organizers to create, promote, and sell tickets for events.

If you are an event organizer, you agree that:

• you are responsible for the accuracy of event information
• you have the right to organize and promote the event
• ticket prices and availability are under your responsibility
• you comply with local laws regarding events and ticket sales

EventWorld acts as a platform and does not organize or host events directly unless explicitly stated.

6. Ticket Purchases

Users may purchase event tickets through the application.

By purchasing a ticket you agree that:

• ticket availability is determined by the organizer
• refunds and cancellations may depend on the organizer's policy
• EventWorld may process payments through third-party providers

EventWorld is not responsible for event cancellations, schedule changes, or organizer disputes.

7. Payments

Payments in the app may be processed through:

• credit or debit cards
• Apple Pay
• Google Pay
• cryptocurrency payments

Payment processing may be handled by third-party providers such as Stripe or cryptocurrency gateways.

EventWorld does not store full card details.

Transaction fees or service charges may apply and will be displayed before payment confirmation.

8. Cryptocurrency Payments

EventWorld may allow payments using cryptocurrencies including BabyU, Charlie tokens, or other supported digital assets.

By using cryptocurrency payments you acknowledge that:

• blockchain transactions are irreversible
• transaction details are publicly visible on the blockchain
• EventWorld does not store private keys or wallet recovery phrases

Users are solely responsible for verifying wallet addresses and transaction details before confirming payment.

9. Prohibited Use

You agree not to:

• violate any laws or regulations
• upload fraudulent or misleading event information
• impersonate another person or organization
• interfere with the security or operation of the application
• attempt unauthorized access to systems or data
• distribute spam, malware, or harmful content

Violation of these rules may result in account suspension or termination.

10. Intellectual Property

All content and technology related to the EventWorld platform, including:

• software
• branding
• logos
• designs
• platform infrastructure

are the property of Charlie Unicorn AI sp. z o.o. or its licensors.

Users may not copy, reproduce, distribute, or modify any part of the platform without permission.

11. User Content

Users may submit content such as:

• event descriptions
• images
• messages
• reviews

By submitting content you grant EventWorld a non-exclusive, worldwide license to display and distribute that content within the platform.

You are responsible for ensuring that your content does not violate any laws or third-party rights.

12. Limitation of Liability

To the maximum extent permitted by law, EventWorld shall not be liable for:

• event cancellations or delays
• disputes between users and organizers
• loss resulting from cryptocurrency transactions
• indirect, incidental, or consequential damages

The platform is provided on an "as is" and "as available" basis.

13. Service Availability

We strive to keep the EventWorld application available and secure.

However, we do not guarantee uninterrupted service and may temporarily suspend the platform for maintenance, updates, or security reasons.

14. Account Suspension or Termination

We reserve the right to suspend or terminate accounts that:

• violate these Terms
• engage in fraudulent activity
• misuse the platform
• harm other users or the service

Users may also delete their accounts at any time through the app settings.

15. Changes to the Terms

We may update these Terms from time to time.

If significant changes occur, we will notify users through the application or by email.

Continued use of the platform after changes indicates acceptance of the updated Terms.

16. Governing Law

These Terms are governed by the laws of Poland.

Any disputes arising from these Terms shall be subject to the jurisdiction of the competent courts in Poland.

17. Contact

If you have questions about these Terms, please contact:

team@charlieunicornai.eu

Charlie Unicorn AI sp. z o.o.
KRS 0001191369
NIP 4990709230
REGON 542576074
`;

const AboutUs = () => {
  const [selectedTab, setSelectedTab] = useState<TDropdownItem>({
    label: "Privacy Policy",
    value: "privacy_policy",
  });

  return (
    <SimpleContainer title="About Us">
      <View className="flex-1 bg-white rounded-3xl p-6 gap-6">
        <Tabs
          tabs={[
            { label: "Privacy Policy", value: "privacy_policy" },
            { label: "Terms of Service", value: "terms_of_service" },
          ]}
          tabClassName="flex-1"
          selectedTab={selectedTab}
          onSelct={setSelectedTab}
        />

        <ScrollView className="flex-1">
          <Text className="text-gray-700 font-poppins-medium text-base leading-6">
            {selectedTab.value === "privacy_policy"
              ? privacyPolicyText
              : termsOfServiceText}
          </Text>
        </ScrollView>
      </View>
    </SimpleContainer>
  );
};

export default AboutUs;
