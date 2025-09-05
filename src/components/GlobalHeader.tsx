"use client";

/**
 * GlobalHeader (Quest App)
 * --------------------------------------------------------------
 * • Desktop (>= lg): Logo + inline nav + language switch + Connect/User
 * • Mobile  (< lg):
 *    - Top fixed bar: [Logo] [LanguageSwitch] [Hamburger]
 *    - When hamburger open: a slim bar appears just **under** the top bar
 *      with a full-width Connect button (address shown when connected)
 *    - Bottom fixed bar: 5 tabs (Quests / Profile / Gacha / Inventory / Ranking)
 *
 * - If NOT connected: clicking protected tabs opens connect modal
 * - Use custom WalletPillButton for desktop
 * - Active-tab glow (nav-active-glow.svg)
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
// UI Tokens
// ------------------------------------------------------------------
const UI = {
  headerHeight: 87, // fixed header height (Spacer と連動)
  maxWidth: 1000,
  shellBg: "#2B2B2B",
  text: {
    link: "#BBA98D",
    linkHover: "#D5B77A",
    ctaFg: "#1C1C1C",
  },
  ctaBg: "#D5B77A",
  mobileBottomBarH: 56, // 下部固定ナビの高さ
};

type Locale = "en" | "ja";

type NavLink = {
  label: string;
  href: string;
  exact?: boolean;
  protected?: boolean;
};

// Helpers
function isActive(pathname: string, href: string, exact = false): boolean {
  return exact ? pathname === href : pathname.startsWith(href);
}

type WalletPillProps = {
  client: ThirdwebClient;
  wallets: Wallet[];
  label?: string;
};

// === Desktop 用：wallet pill ===
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
            onClick={() => setMenuOpen(false)}
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

// === Mobile 用：フル幅 Connect ボタン（接続後はアドレス表示 & 簡易メニュー） ===
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
          if (!account) {
            connect?.({ client, wallets });
          } else {
            setMenuOpen((v) => !v);
          }
        }}
        className="w-full h-11 rounded-md bg-[#D5B77A] text-[#1C1C1C] font-semibold shadow-sm hover:opacity-90"
      >
        {short(account?.address)}
      </button>

      {/* 接続時のみ簡易メニュー（Disconnect） */}
      {account && wallet && menuOpen && (
        <div
          role="menu"
          className="absolute left-0 right-0 mt-2 rounded-xl bg-[#2B2B2B] shadow-lg ring-1 ring-black/10"
        >
          <button
            className="w-full text-left px-4 py-2.5 text-[#F1E9D2] hover:bg-white/5 rounded-t-xl"
            onClick={() => setMenuOpen(false)}
          >
            Close
          </button>
          <button
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

// 小さなフェード用（モバイル Connect バー）
const barVariants = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

export default function GlobalHeader() {
  const { user } = useUser();
  const activeAccount = useActiveAccount(); // ← 親でも監視して key に使う

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
      {
        label: tSidebar("ranking"),
        href: "/ranking",
        exact: true,
        protected: true,
      },
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

  // mobile state
  const [open, setOpen] = useState(false); // ハンバーガー：開閉トグル

  // lg 以上で自動的に閉じる
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
      {/* ===== Top fixed header (both desktop & mobile) ===== */}
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

          {/* ===== Right side ===== */}
          {/* Desktop: lang + wallet */}
          <div className="hidden items-center gap-7 lg:flex">
            <LanguageSwitch
              locale={locale}
              onLocaleChange={setAppLocale}
              size="sm"
              className="h-6"
            />
            <WalletPillButton
              key={activeAccount?.address ?? "disconnected-desktop"} // ← 接続状態で再マウント
              client={client}
              wallets={wallets}
              label={tSidebar("connect")}
            />
          </div>

          {/* Mobile: lang + hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <LanguageSwitch
              locale={locale}
              onLocaleChange={setAppLocale}
              size="sm"
              className="h-6"
            />
            <button
              onClick={() => setOpen((v) => !v)} // ← 再押下で閉じる
              className="p-2 text-[#D5B77A]"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-connect-bar"
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* Hidden fallback trigger（保持） */}
          <button
            ref={hiddenConnectBtnRef}
            className="hidden"
            onClick={() => { }}
          >
            <WalletPillButton
              key={activeAccount?.address ?? "disconnected-mobile"}
              client={client}
              wallets={wallets}
              label={tSidebar("connect")}
            />
          </button>
        </div>
      </header>

      {/* ===== Mobile: header 下に“Connect バー”を出す（上部バーにピタッと接続） ===== */}
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
            className="fixed inset-x-0 z-40 lg:hidden"
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

      {/* ===== Mobile: bottom fixed nav (5 tabs) ===== */}
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

      {/* ===== Spacers ===== */}
      {/* Top spacer to push content below the fixed header */}
      <div style={{ height: UI.headerHeight }} />
      {/* Bottom spacer for the mobile bottom nav (desktopは不要) */}
      <div
        className="lg:hidden"
        style={{
          height: `calc(${UI.mobileBottomBarH}px + env(safe-area-inset-bottom))`,
        }}
      />
    </>
  );
}
