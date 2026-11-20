"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "Services", href: "/services" },
    { label: "Industries", href: "/industries" },
    { label: "Technologies", href: "/technologies" },
    { label: "Blogs", href: "/blogs" },
    { label: "Contact Us", href: "/contact-us" },
  ];

  const servicesLinks = [
    { label: "Website Development", href: "/services/website-development" },
    { label: "Mobile App Development", href: "/services/mobile-app-development" },
    { label: "SaaS Application Development", href: "/services/saas-application-development" },
  ];

  const socialLinks = [
    { icon: FaLinkedinIn, href: "https://www.linkedin.com/company/ak-it-solutions-group", label: "LinkedIn" },
  ];

  return (
    <footer className="relative overflow-hidden bg-[url('/images/footer_bg2.jpg')] bg-cover bg-center text-white border-t border-primary/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(54,146,203,0.20),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(255,255,255,0.07),transparent_26%)]" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/logos/akit_logo.png"
                alt="AK IT Solution Logo"
                width={140}
                height={45}
                className="object-contain"
              />
            </Link>
            <p className="text-slate-200/85 text-sm leading-relaxed max-w-sm">
              We design reliable software, cloud infrastructure, and digital platforms for growing enterprises.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:contact@akitsolutions.us"
                className="flex items-center text-slate-200/85 hover:text-cyan-200 transition-colors text-sm"
              >
                <Mail className="h-4 w-4 mr-3" />
                contact@akitsolutions.us
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-cyan-200 mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-200/80 hover:text-cyan-200 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-cyan-200 mb-5">
              Core Services
            </h3>
            <ul className="space-y-3">
              {servicesLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-200/80 hover:text-cyan-200 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-cyan-200 mb-5">
              Stay Connected
            </h3>
            <p className="text-slate-200/80 text-sm mb-6">
              Follow our team and read practical guidance for modern digital operations.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-12 w-12 rounded-lg bg-white/10 text-white hover:bg-primary hover:scale-110 hover:-translate-y-1 transition-all duration-200 border border-white/10"
                    aria-label={`Follow us on ${social.label}`}
                  >
                    <Icon className="h-8 w-8" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-slate-300/80">
          <p>
            &copy; {new Date().getFullYear()} AK IT Solution. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
