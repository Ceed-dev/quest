"use client";

/**
 * GlobalHeader (Quest App)
 * ---------------------------------------------------------------------------
 * Desktop (>= lg): Logo | Inline Nav | Language Switch | Wallet (pill)
 * Mobile  (< lg):  Top bar (Logo + Lang + Hamburger)
 *                  When hamburger is open, a "Connect" bar appears directly
 *                  under the top bar. Bottom fixed 5-tab nav is always shown.
 *
 * Rules:
 * - Protected tabs (profile/gacha/inventory/ranking) require a connected user.
 *   If not connected, open the Thirdweb connect modal instead of navigating.
 * - Avoid nested interactive elements (e.g., <button><a/></button>).
 * - Accessiblity: aria-current for active nav, aria-expanded/controls for menu.
 * - z-index layers: header 50 / mobile connect bar 60 / bottom nav 40.
 *
 * SSR/CSR:
 * - Any browser API usage (matchMedia) is inside useEffect.
 * - All hooks are called unconditionally at the top of the component.
 * ---------------------------------------------------------------------------
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

import { useUser } from "@/providers/user-provider";
import LanguageSwitch from "@/components/LanguageSwitch";

import {
  useActiveAccount,
  useActiveWallet,
  useConnectModal,
  useDisconnect,
} from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { client } from "@/lib/client";

import type { ThirdwebClient } from "thirdweb";
import type { Wallet } from "thirdweb/wallets";

/* -----------------------------------------------------------------------------
 * UI Tokens
 * ---------------------------------------------------------------------------*/
const UI = {
  headerHeight: 87, // must match the top spacer below
  maxWidth: 1000,
  shellBg: "#2B2B2B",
  mobileBottomBarH: 56, // must match the bottom spacer height
} as const;

/* -----------------------------------------------------------------------------
 * Types / Utils
 * ---------------------------------------------------------------------------*/
type Locale = "en" | "ja";

type NavLink = {
  label: string;
  href: string;
  exact?: boolean;
  protected?: boolean;
};

function isActive(pathname: string, href: string, exact = false): boolean {
  return exact ? pathname === href : pathname.startsWith(href);
}

type WalletPillProps = {
  client: ThirdwebClient;
  wallets: Wallet[];
  label?: string;
};

/* -----------------------------------------------------------------------------
 * Subcomponents
 * ---------------------------------------------------------------------------*/
/** Desktop-only wallet connect pill. Toggles a small menu when connected. */
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
        type="button"
        className={pill}
        onClick={() => {
          if (!account) connect?.({ client, wallets });
          else setMenuOpen((v) => !v);
        }}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
      >
        <span className="text-[16px] tracking-wide">
          {short(account?.address)}
        </span>
      </button>

      {account && wallet && menuOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 rounded-xl bg-[#2B2B2B] shadow-lg ring-1 ring-black/10 z-[70]"
        >
          <button
            type="button"
            className="w-full text-left px-4 py-2.5 text-[#F1E9D2] hover:bg-white/5 rounded-t-xl"
            onClick={() => setMenuOpen(false)}
          >
            View Profile
          </button>
          <button
            type="button"
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

/** Mobile-only full-width connect button. Shows a small menu when connected. */
function MobileConnectButton({
  client,
  wallets,
  label,
}: {
  client: ThirdwebClient;
  wallets: Wallet[];
  label: string;
}) {
  const { connect } = useConnectModal();
  const { disconnect } = useDisconnect();
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const [menuOpen, setMenuOpen] = useState(false);

  const short = (addr?: string) =>
    addr ? `${addr.slice(0, 4)}…${addr.slice(-3)}` : label;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          if (!account) connect?.({ client, wallets });
          else setMenuOpen((v) => !v);
        }}
        className="w-full h-11 rounded-md bg-[#D5B77A] text-[#1C1C1C] font-semibold shadow-sm hover:opacity-90"
      >
        {short(account?.address)}
      </button>

      {account && wallet && menuOpen && (
        <div
          role="menu"
          className="absolute left-0 right-0 mt-2 rounded-xl bg-[#2B2B2B] shadow-lg ring-1 ring-black/10 z-[70]"
        >
          <button
            type="button"
            className="w-full text-left px-4 py-2.5 text-[#F1E9D2] hover:bg-white/5 rounded-t-xl"
            onClick={() => setMenuOpen(false)}
          >
            Close
          </button>
          <button
            type="button"
            className="w-full text-left px-4 py-2.5 text-[#F1E9D2] hover:bg-white/5 rounded-b-xl"
            onClick={() => disconnect(wallet)}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * Animations
 * ---------------------------------------------------------------------------*/
const barVariants = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

/* -----------------------------------------------------------------------------
 * Component
 * ---------------------------------------------------------------------------*/
export default function GlobalHeader() {
  // Hooks must be called unconditionally and at the top:
  const { user } = useUser();
  const activeAccount = useActiveAccount();

  // i18n
  const tSidebar = useTranslations("sidebar");
  const locale = useLocale() as Locale;

  // routing
  const pathname = usePathname();
  const router = useRouter();
  const search = useSearchParams();

  // Change app locale while preserving current path & query string.
  const setAppLocale = useCallback(
    (next: Locale) => {
      document.cookie = `NEXT_LOCALE=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
      const qs = search?.toString();
      const href = qs ? `${pathname}?${qs}` : pathname;
      router.replace(href, { locale: next });
    },
    [pathname, router, search],
  );

  // Thirdweb wallet options (memoized)
  const wallets = useMemo(
    () => [
      inAppWallet({
        auth: { options: ["email", "google"] },
      }),
    ],
    [],
  );

  // Connect modal
  const { connect } = useConnectModal();

  // Primary nav links; only "quests" is public
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
      {
        label: tSidebar("ranking"),
        href: "/ranking",
        exact: true,
        protected: true,
      },
    ],
    [tSidebar],
  );

  // When a protected link is clicked without a user, open the connect modal.
  const openConnectModal = useCallback(() => {
    connect?.({ client, wallets });
  }, [connect, wallets]);

  const makeNavHandler = useCallback(
    (link: NavLink) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!user && link.protected) {
        e.preventDefault();
        openConnectModal();
      }
    },
    [user, openConnectModal],
  );

  // Mobile hamburger state
  const [open, setOpen] = useState(false);

  // Auto-close mobile menu when viewport becomes >= lg (CSR only).
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

  /* ---------------------------------------------------------------------------
   * Render
   * -------------------------------------------------------------------------*/
  return (
    <>
      {/* ===== Top fixed header (desktop & mobile) ===== */}
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

          {/* ===== Desktop center nav ===== */}
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
                        "relative",
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

          {/* ===== Desktop right side ===== */}
          <div className="hidden items-center gap-7 lg:flex">
            <LanguageSwitch
              locale={locale}
              onLocaleChange={setAppLocale}
              size="sm"
              className="h-6"
            />
            <WalletPillButton
              key={activeAccount?.address ?? "disconnected-desktop"} // re-mount on connect state change
              client={client}
              wallets={wallets}
              label={tSidebar("connect")}
            />
          </div>

          {/* ===== Mobile: language switch + hamburger ===== */}
          <div className="flex items-center gap-3 lg:hidden">
            <LanguageSwitch
              locale={locale}
              onLocaleChange={setAppLocale}
              size="sm"
              className="h-6"
            />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="p-2 text-[#D5B77A]"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-connect-bar"
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* ===== Mobile: Connect bar under the top header ===== */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-connect-bar"
            id="mobile-connect-bar"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={barVariants}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-x-0 z-[60] lg:hidden"
            style={{ top: UI.headerHeight - 1 }}
          >
            <div className="mx-5 rounded-b-md rounded-t-none bg-[#2B2B2B] px-4 pb-3 pt-2 shadow-lg">
              <MobileConnectButton
                client={client}
                wallets={wallets}
                label={tSidebar("connect")}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Mobile: bottom fixed 5-tab navigation ===== */}
      <nav
        aria-label="Bottom navigation"
        className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div
          className="mx-5 mb-3 flex h-[56px] items-center justify-between rounded-md px-4"
          style={{ backgroundColor: UI.shellBg }}
        >
          {navLinks.map((l) => {
            const active = isActive(pathname, l.href, l.exact);
            return (
              <Link
                key={`bottom-${l.href}`}
                href={l.href}
                onClick={makeNavHandler(l)}
                className={
                  active
                    ? [
                      "text-[#D5B77A] text-[14px] font-medium relative",
                      "after:content-[''] after:absolute",
                      "after:left-[-6px] after:right-[-6px] after:-top-2 after:h-[14px]",
                      "after:bg-[url('/nav-active-glow.svg')] after:bg-no-repeat after:bg-center after:bg-[length:100%_100%]",
                    ].join(" ")
                    : "text-[#BBA98D] text-[14px] font-medium hover:text-[#D5B77A] transition-colors"
                }
                aria-current={active ? "page" : undefined}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ===== Spacers (reserve space for fixed bars) ===== */}
      <div style={{ height: UI.headerHeight }} />
      <div
        className="lg:hidden"
        style={{
          height: `calc(${UI.mobileBottomBarH}px + env(safe-area-inset-bottom))`,
        }}
      />
    </>
  );
}
