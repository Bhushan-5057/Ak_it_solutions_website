import { Metadata } from "next";
import ServiceDetailLayout from "@/components/services/ServiceDetailLayout";
import FAQSection, { FAQItem } from "@/components/common/FAQSection";

export const metadata: Metadata = {
  title: "Cyber Security Service",
  description: "Enterprise cyber security auditing, threat detection, and mitigation strategies.",
};

const service = {
  id: "s4",
  slug: "cyber-security",
  title: "Cyber Security",
  description: "SOC monitoring, threat detection, audits, and managed protection to defend your digital assets.",
  iconName: "Shield",
  benefits: [
    "Comprehensive penetration testing and vulnerability assessment",
    "Firewall, IAM, endpoint, email, and cloud security hardening",
    "SOC monitoring, SIEM visibility, and incident response support",
    "Compliance and risk reviews for GDPR, SOC 2, HIPAA, and internal policies",
  ],
  details: "Your data, systems, and reputation need active protection. We help reduce risk through vulnerability assessment, penetration testing, SOC monitoring, SIEM implementation, endpoint protection, firewall reviews, cloud security hardening, and clear incident response planning.",
};

const faqs: FAQItem[] = [
  {
    id: "cyber-security-1",
    question: "What cyber security services do you provide?",
    answer: "We provide security audits, vulnerability assessments, penetration testing, access control implementation, cloud security, and infrastructure protection services.",
  },
  {
    id: "cyber-security-2",
    question: "How do you identify security vulnerabilities?",
    answer: "We use automated scanning tools, manual testing methods, penetration testing, code reviews, and infrastructure analysis to identify potential risks.",
  },
  {
    id: "cyber-security-3",
    question: "Can you secure cloud infrastructure and web applications?",
    answer: "Yes. We secure cloud environments, APIs, databases, servers, and web applications using encryption, firewalls, monitoring systems, and access management.",
  },
  {
    id: "cyber-security-4",
    question: "Do you help businesses prevent cyber attacks?",
    answer: "Yes. We implement proactive security strategies including threat monitoring, incident prevention, secure authentication, employee guidance, and system hardening.",
  },
  {
    id: "cyber-security-5",
    question: "Do you provide ongoing cyber security monitoring and support?",
    answer: "Yes. We provide continuous monitoring, security updates, incident response support, vulnerability patching, and long-term protection strategies.",
  },
];

export default function CyberSecurityPage() {
  return (
    <>
      <ServiceDetailLayout
        service={service}
        heading="Securing applications, networks, and cloud infrastructure"
        imageSrc="/images/cybersecurity.jpg"
        imageAlt="Cyber security monitoring and digital protection interface"
        imageSide="left"
        summary="Our security work combines assessment, hardening, monitoring, and practical remediation guidance so teams can reduce risk without slowing down delivery."
        deliverables={[
          "Vulnerability assessment",
          "Cloud and IAM hardening",
          "Security report and roadmap",
          "Incident response guidance",
        ]}
      />
      <FAQSection
        items={faqs}
        subtitle="Cyber Security FAQ"
        title="Questions About Our Service" />
    </>
  );
}
