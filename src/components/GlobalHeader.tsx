"use client";

/**
 * GlobalHeader (Quest App)
 * --------------------------------------------------------------
 * • Fixed header aligned with the marketing site tone/layout
 * • Desktop (>= lg): Logo + inline nav + language switch + Connect/User
 * • Mobile  (< lg): Logo + hamburger → slide-in dropdown (animated)
 *
 * Changes in this revision:
 * - Always show 5 tabs: Quests / Profile / Gacha / Inventory / Ranking
 * - If NOT connected: clicking tabs other than Quests opens connect modal
 * - Use custom WalletPillButton (connect/disconnect + pill UI)
 * - Add active-tab glow (nav-active-glow.svg) under current tab
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

import { useUser } from "@/providers/user-provider";
import LanguageSwitch from "@/components/LanguageSwitch";

import {
  useConnectModal,
  useDisconnect,
  useActiveAccount,
  useActiveWallet,
} from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { client } from "@/lib/client";

import type { ThirdwebClient } from "thirdweb";
import type { Wallet } from "thirdweb/wallets";

// ------------------------------------------------------------------
// UI Tokens (colors, sizes)
// ------------------------------------------------------------------
const UI = {
  headerHeight: 87,
  maxWidth: 1000,
  shellBg: "#2B2B2B",
  text: {
    link: "#BBA98D",
    linkHover: "#D5B77A",
    ctaFg: "#1C1C1C",
  },
  ctaBg: "#D5B77A",
};

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

type Locale = "en" | "ja";

type NavLink = {
  label: string;
  href: string;
  exact?: boolean;
  protected?: boolean;
};

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

/** Determine active link styles */
function isActive(pathname: string, href: string, exact = false): boolean {
  return exact ? pathname === href : pathname.startsWith(href);
}

type WalletPillProps = {
  client: ThirdwebClient;
  wallets: Wallet[];
  label?: string;
};

// === Custom wallet pill button (connect / disconnect) ===
function WalletPillButton({
  client,
  wallets,
  label = "Connect",
}: WalletPillProps) {
  const { connect } = useConnectModal();
  const { disconnect } = useDisconnect();
  const account = useActiveAccount();
  const wallet = useActiveWallet();

  const [menuOpen, setMenuOpen] = useState(false);

  const short = (addr?: string) =>
    addr ? `${addr.slice(0, 4)}…${addr.slice(-3)}` : label;

  const pill =
    "inline-flex items-center gap-3 rounded-md px-3.5 py-2.5 h-8 " +
    "bg-[#D5B77A] text-[#1C1C1C] font-semibold shadow-sm hover:opacity-90 transition";

  return (
    <div className="relative">
      <button
        className={pill}
        onClick={() => {
          if (!account) {
            connect?.({ client, wallets });
          } else {
            setMenuOpen((v) => !v);
          }
        }}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
      >
        <span className="inline-grid place-items-center h-7 w-7 rounded-full bg-[#F0CD75]/60 overflow-hidden">
          <span className="text-sm">🙂</span>
        </span>
        <span className="text-[16px] tracking-wide">
          {short(account?.address)}
        </span>
      </button>

      {account && wallet && menuOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 rounded-xl bg-[#2B2B2B] shadow-lg ring-1 ring-black/10"
        >
          <button
            className="w-full text-left px-4 py-2.5 text-[#F1E9D2] hover:bg-white/5 rounded-t-xl"
            onClick={() => {
              setMenuOpen(false);
            }}
          >
            View Profile
          </button>
          <button
            className="w-full text-left px-4 py-2.5 text-[#F1E9D2] hover:bg-white/5 rounded-b-xl"
            onClick={() => {
              disconnect(wallet);
              setMenuOpen(false);
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

// Motion variants for mobile dropdown
const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
};

export default function GlobalHeader() {
  const { user } = useUser();

  // i18n
  const tSidebar = useTranslations("sidebar");
  const locale = useLocale() as Locale;

  // routing
  const pathname = usePathname();
  const router = useRouter();
  const search = useSearchParams();

  const setAppLocale = useCallback(
    (next: Locale) => {
      const qs = search?.toString();
      const href = qs ? `${pathname}?${qs}` : pathname;
      router.replace(href, { locale: next });
    },
    [pathname, router, search],
  );

  // thirdweb wallets
  const wallets = useMemo(
    () => [
      inAppWallet({
        auth: { options: ["email", "google"] },
      }),
    ],
    [],
  );

  // connect modal (programmatic open for tab-guard)
  const { connect } = useConnectModal?.() ?? { connect: undefined };
  const hiddenConnectBtnRef = useRef<HTMLButtonElement | null>(null);

  const openConnectModal = useCallback(() => {
    if (connect) {
      connect({ client, wallets });
      return;
    }
    hiddenConnectBtnRef.current?.click();
  }, [connect, wallets]);

  // Always show 5 tabs. Only Quests is public; others are protected.
  const navLinks: NavLink[] = useMemo(
    () => [
      { label: tSidebar("quests"), href: "/", exact: true, protected: false },
      {
        label: tSidebar("profile"),
        href: "/profile",
        exact: true,
        protected: true,
      },
      {
        label: tSidebar("gacha"),
        href: "/gacha",
        exact: true,
        protected: true,
      },
      {
        label: tSidebar("inventory"),
        href: "/inventory",
        exact: true,
        protected: true,
      },
      { label: "Ranking", href: "/ranking", exact: true, protected: true },
    ],
    [tSidebar],
  );

  const makeNavHandler = useCallback(
    (link: NavLink) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!user && link.protected) {
        e.preventDefault();
        openConnectModal();
      }
    },
    [user, openConnectModal],
  );

  // mobile drawer state
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      const matches =
        "matches" in e ? e.matches : (e as MediaQueryList).matches;
      if (matches) setOpen(false);
    };
    handler(mql);
    mql.addEventListener("change", handler as (e: MediaQueryListEvent) => void);
    return () =>
      mql.removeEventListener(
        "change",
        handler as (e: MediaQueryListEvent) => void,
      );
  }, []);

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <>
      {/* Fixed header shell – centered container */}
      <header
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-5 py-[18.5px]"
        aria-label="Global header"
      >
        <div
          className="flex h-[50px] w-full items-center justify-between rounded-md px-4 lg:max-w-[1000px]"
          style={{ backgroundColor: UI.shellBg, maxWidth: UI.maxWidth }}
        >
          {/* Left: Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2"
            aria-label="Qube Quest (Home)"
          >
            <Image
              src="/logo-text.svg"
              alt="QUBE"
              width={150}
              height={150}
              priority
            />
          </Link>

          {/* Center: Desktop navigation (always 5 tabs) */}
          <nav
            className="hidden items-center gap-5 text-[16px] font-medium lg:flex"
            aria-label="Primary"
          >
            {navLinks.map((l) => {
              const active = isActive(pathname, l.href, l.exact);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={makeNavHandler(l)}
                  className={
                    active
                      ? [
                          "text-[#D5B77A]",
                          "relative", // for the glow anchor
                          // ↓ active glow using the provided SVG
                          "after:content-[''] after:absolute",
                          "after:left-[-8px] after:right-[-8px] after:-bottom-3 after:h-[18px]",
                          "after:bg-[url('/nav-active-glow.svg')] after:bg-no-repeat after:bg-center after:bg-[length:100%_100%]",
                        ].join(" ")
                      : "text-[#BBA98D] transition-colors duration-200 hover:text-[#D5B77A]"
                  }
                  aria-current={active ? "page" : undefined}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Lang switch + Wallet pill (desktop) */}
          <div className="hidden items-center gap-7 lg:flex">
            <LanguageSwitch
              locale={locale}
              onLocaleChange={setAppLocale}
              size="sm"
              className="h-6"
            />
            <WalletPillButton
              client={client}
              wallets={wallets}
              label={tSidebar("connect")}
            />
          </div>

          {/* Hidden fallback trigger (kept as-is) */}
          <button
            ref={hiddenConnectBtnRef}
            className="hidden"
            onClick={() => {}}
          >
            <WalletPillButton
              client={client}
              wallets={wallets}
              label={tSidebar("connect")}
            />
          </button>

          {/* Mobile: hamburger */}
          <button
            onClick={() => setOpen(true)}
            className="p-2 text-[#D5B77A] lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            id="mobile-menu"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={dropdownVariants}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-x-0 top-0 z-40 flex justify-center px-5 py-[18.5px] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
          >
            <div className="flex w-full flex-col rounded-md bg-[#2B2B2B] shadow-lg lg:max-w-[1000px]">
              {/* Top row: logo + close */}
              <div className="flex h-[60px] items-center justify-between px-4">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2"
                  aria-label="Qube Quest (Home)"
                >
                  <Image
                    src="/logo-text.svg"
                    alt="QUBE"
                    width={150}
                    height={150}
                  />
                </Link>
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="p-1 text-[#D5B77A]"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Nav links (always 5). Block protected when not connected. */}
              <nav
                className="flex flex-col gap-2 px-6 pb-4 text-[22px] font-medium"
                aria-label="Primary"
              >
                {navLinks.map((l) => {
                  const active = isActive(pathname, l.href, l.exact);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={(e) => {
                        if (!user && l.protected) {
                          e.preventDefault();
                          openConnectModal();
                        } else {
                          setOpen(false);
                        }
                      }}
                      className={
                        active
                          ? [
                              "text-[#D5B77A]",
                              "relative",
                              // 少し小さめのグロー（モバイル）
                              "after:content-[''] after:absolute",
                              "after:left-[-6px] after:right-[-6px] after:-bottom-1 after:h-[14px]",
                              "after:bg-[url('/nav-active-glow.svg')] after:bg-no-repeat after:bg-center after:bg-[length:100%_100%]",
                            ].join(" ")
                          : "text-[#BBA98D] transition-colors hover:text-[#D5B77A]"
                      }
                      aria-current={active ? "page" : undefined}
                    >
                      {l.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Language switch */}
              <div className="mb-4 px-6">
                <LanguageSwitch
                  locale={locale}
                  onLocaleChange={setAppLocale}
                  size="sm"
                  className="h-6"
                />
              </div>

              {/* Wallet pill (mobile) */}
              <div className="px-6 pb-6">
                <WalletPillButton
                  client={client}
                  wallets={wallets}
                  label={tSidebar("connect")}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to avoid content being overlapped by fixed header */}
      <div style={{ height: UI.headerHeight }} />
    </>
  );
}
