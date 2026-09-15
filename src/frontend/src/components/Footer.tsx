import { Link } from "@tanstack/react-router";
import { CarFront, Mail, MapPin, Phone } from "lucide-react";

const marketplaceLinks = [
  { label: "All vehicles", to: "/marketplace" },
  { label: "Sell a vehicle", to: "/sell" },
] as const;

const companyLinks = [
  { label: "About Motorvault", to: "/" },
  { label: "Featured inventory", to: "/marketplace" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-ocid="footer" className="border-t bg-muted/40">
      <div className="container grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CarFront className="size-5" />
            </span>
            <span>
              Motor<span className="text-primary">vault</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            A premium automotive marketplace connecting buyers with a curated
            inventory of quality vehicles. Find your next drive with confidence.
          </p>
        </div>

        <nav aria-label="Marketplace">
          <h3 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
            Marketplace
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            {marketplaceLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  search={{}}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  data-ocid={`footer.link.${link.to.replace("/", "")}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <h3 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
            Company
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            {companyLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  search={{}}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  data-ocid={`footer.link.${link.label.toLowerCase().replace(/\s+/g, "_")}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" />
              <span>1 Showroom Drive, Austin, TX</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" />
              <span>(512) 555-0142</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" />
              <span>hello@motorvault.example</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {year}. Motorvault. All rights reserved.</p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
            data-ocid="footer.attribution"
          >
            © {year}. Built with love using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
