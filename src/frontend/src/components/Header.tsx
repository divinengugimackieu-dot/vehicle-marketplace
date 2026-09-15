import { Link, useNavigate } from "@tanstack/react-router";
import { CarFront, Menu, Search, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Marketplace", to: "/marketplace" },
  { label: "Sell a vehicle", to: "/sell" },
] as const;

export function Header() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    void navigate({ to: "/marketplace", search: { q: query } });
    setMenuOpen(false);
  };

  return (
    <header
      data-ocid="header"
      className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md"
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-xl font-bold tracking-tight"
          data-ocid="header.logo"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CarFront className="size-5" />
          </span>
          <span>
            Motor<span className="text-primary">vault</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              search={{}}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              data-ocid={`header.nav.${link.to.replace("/", "")}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <form onSubmit={submitSearch} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search makes, models…"
              className="w-56 pl-9"
              data-ocid="header.search_input"
              aria-label="Search vehicles"
            />
          </form>
          <Button asChild size="sm" data-ocid="header.sell_button">
            <Link to="/sell" search={{}}>
              Sell
            </Link>
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          data-ocid="header.menu_toggle"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      <div
        className={cn(
          "border-t bg-background md:hidden",
          menuOpen ? "block" : "hidden",
        )}
      >
        <div className="container flex flex-col gap-2 py-4">
          <form onSubmit={submitSearch} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search makes, models…"
              className="pl-9"
              data-ocid="header.search_input.mobile"
              aria-label="Search vehicles"
            />
          </form>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              search={{}}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              data-ocid={`header.nav.mobile.${link.to.replace("/", "")}`}
            >
              {link.label}
            </Link>
          ))}
          <Button
            asChild
            className="mt-1"
            data-ocid="header.sell_button.mobile"
          >
            <Link to="/sell" search={{}} onClick={() => setMenuOpen(false)}>
              Sell a vehicle
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
