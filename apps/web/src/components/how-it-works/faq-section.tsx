import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQS = [
  {
    id: 'faq-1',
    question: 'How are providers verified on HirePro?',
    answer:
      'Every provider submits their CNIC, a recent photograph, and any relevant trade certificates. Our team manually reviews each application and runs a background check before granting access to the platform. Approved providers display a verified badge on their profile.',
  },
  {
    id: 'faq-2',
    question: 'How does the escrow payment system work?',
    answer:
      'When you confirm a booking, your payment is held securely in escrow — it is not sent to the provider yet. Once you confirm the job is complete, the funds are released automatically. If something goes wrong, you can raise a dispute and our team will mediate.',
  },
  {
    id: 'faq-3',
    question: 'Can I cancel or reschedule a booking?',
    answer:
      'Yes. You can cancel or reschedule any upcoming booking free of charge up to 2 hours before the scheduled time. Cancellations within 2 hours may incur a small fee to compensate the provider for travel time.',
  },
  {
    id: 'faq-4',
    question: 'What happens if I am not satisfied with the work?',
    answer:
      'Our Happiness Pledge covers every completed booking. If you are not satisfied, contact our support team within 24 hours. We will arrange a free re-do with the same provider or a different one. If the issue cannot be resolved, we will issue a full refund.',
  },
  {
    id: 'faq-5',
    question: 'Which cities are currently supported?',
    answer:
      'HirePro is currently available in Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, and Peshawar. We are expanding to more cities soon — enter your city on the homepage to join the waitlist.',
  },
  {
    id: 'faq-6',
    question: 'What payment methods are accepted?',
    answer:
      'We accept JazzCash, EasyPaisa, debit and credit cards (Visa, Mastercard), and cash on completion for select services. All digital payments are processed securely through our payment partner.',
  },
  {
    id: 'faq-7',
    question: 'How do I become a service provider on HirePro?',
    answer:
      'Click "Become a Provider" in the navigation, fill in your professional details and service area, upload your CNIC and any certifications, and submit your application. Our team will review it within 48 hours and notify you by SMS and email.',
  },
  {
    id: 'faq-8',
    question: 'Is there a fee for providers to join the platform?',
    answer:
      'Joining HirePro is completely free. We only charge a small platform commission on completed jobs — meaning you only pay when you earn. The commission rate depends on your tier (Bronze, Silver, Gold), with higher tiers enjoying lower rates.',
  },
];

export function FaqSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              FAQ
            </span>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              Common questions
            </h2>
            <p className="mt-2 text-muted-foreground">
              Everything you need to know about using HirePro.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:no-underline hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
