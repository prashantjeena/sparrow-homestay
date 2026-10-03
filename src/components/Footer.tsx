import { Mail, MessageCircle, Phone } from "lucide-react";
import { site } from "@/data/site";
import { generalEnquiry, whatsappLink } from "@/lib/whatsapp";
import { Wordmark } from "./Logo";
import { FacebookIcon, InstagramIcon } from "./SocialIcons";

const explore = [
  { href: "#rooms", label: "Rooms" },
  { href: "#gallery", label: "Gallery" },
  { href: "#nearby", label: "Explore nearby" },
  { href: "#about", label: "Meet your host" },
  { href: "#faq", label: "FAQ" },
];

const stay = [
  { href: "#book", label: "Check availability" },
  { href: "#rooms", label: "Deodar Room" },
  { href: "#rooms", label: "Pine Room" },
  { href: "#rooms", label: "Garden Room" },
  { href: "#rooms", label: "The whole house" },
];

const linkClass = "text-cream/75 transition hover:text-lantern";

export default function Footer() {
  return (
    <footer className="mt-8">
      {/* Mountain edge, same forest colour as the footer body */}
      <svg
        aria-hidden
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="block h-10 w-full md:h-16"
        fill="var(--m5)"
      >
        <path d="M0 80V52L120 30 260 56 420 20 560 52 720 12 880 50 1040 24 1200 58 1320 36 1440 54V80z" />
      </svg>

      <div className="bg-[var(--m5)] text-cream">
        <div className="container-x grid grid-cols-2 gap-x-6 gap-y-10 pb-10 pt-6 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-x-10">
          <div className="col-span-2 lg:col-span-1">
            <Wordmark tone="light" className="h-24 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/75">{site.tagline}.</p>
            <p className="mt-2 text-sm text-cream/60">
              {site.location.place}, {site.location.region} · {site.location.altitude}
            </p>
          </div>

          <nav aria-label="Explore">
            <p className="text-xs uppercase tracking-[0.2em] text-lantern">Explore</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {explore.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={linkClass}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Stay">
            <p className="text-xs uppercase tracking-[0.2em] text-lantern">Stay</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {stay.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={linkClass}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 lg:col-span-1">
            <p className="text-xs uppercase tracking-[0.2em] text-lantern">Get in touch</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={whatsappLink(generalEnquiry)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 ${linkClass}`}
                >
                  <MessageCircle size={16} /> WhatsApp us
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                  className={`inline-flex items-center gap-2 ${linkClass}`}
                >
                  <Phone size={16} /> {site.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className={`inline-flex items-center gap-2 break-all ${linkClass}`}
                >
                  <Mail size={16} /> {site.contact.email}
                </a>
              </li>
            </ul>
            <div className="mt-5 flex gap-3">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-cream/25 text-cream transition hover:border-lantern hover:text-lantern"
              >
                <InstagramIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid h-10 w-10 place-items-center rounded-full border border-cream/25 text-cream transition hover:border-lantern hover:text-lantern"
              >
                <FacebookIcon className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/15">
          <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-cream/60 sm:flex-row">
            <p>
              © {new Date().getFullYear()} {site.name}. All rights reserved.
            </p>
            <a href="#top" className="transition hover:text-lantern">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
