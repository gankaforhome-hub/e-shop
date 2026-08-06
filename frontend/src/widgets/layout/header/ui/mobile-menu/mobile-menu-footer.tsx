'use client';

import { Globe, Heart, User } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/shared/lib/utils';

interface MobileMenuQuickActionsProps {
  className?: string;
  currentLang?: string;
  wishlistCount?: number;
  isLangActive?: boolean; // 👈 додано стан для підсвітки рамкою
  onActionClick?: () => void;
  onLanguageClick?: () => void;
}

export function MobileMenuQuickActions({
  className,
  currentLang = 'EN',
  wishlistCount = 0,
  isLangActive = false,
  onActionClick,
  onLanguageClick,
}: MobileMenuQuickActionsProps) {
  return (
    <div
      className={cn(
        'border-border/60 grid grid-cols-3 items-center justify-between border-t p-2 text-xs font-medium',
        className,
      )}
    >
      {/* 1. WISHLIST */}
      <Link
        href="/wishlist"
        onClick={onActionClick}
        aria-label="Wishlist"
        className="text-foreground/70 hover:text-foreground flex items-center justify-center gap-2 py-2.5 transition-colors"
      >
        <div className="relative flex items-center justify-center">
          <Heart className="size-4 stroke-[1.5]" />
          {wishlistCount > 0 && (
            <span className="bg-primary text-primary-foreground absolute -right-1.5 -top-1.5 flex size-3.5 items-center justify-center rounded-full text-[9px] font-bold">
              {wishlistCount > 9 ? '9+' : wishlistCount}
            </span>
          )}
        </div>
        <span>Wishlist</span>
      </Link>

      {/* 2. ACCOUNT */}
      <Link
        href="/account"
        onClick={onActionClick}
        aria-label="Account"
        className="text-foreground/70 hover:text-foreground border-border/40 flex items-center justify-center gap-2 border-l py-2.5 transition-colors"
      >
        <User className="size-4 stroke-[1.5]" />
        <span>Account</span>
      </Link>

      {/* 3. LANGUAGE SWITCHER */}
      <div className="flex items-center justify-center pl-1">
        <button
          type="button"
          onClick={onLanguageClick}
          aria-label="Select Language"
          className={cn(
            'flex w-full items-center justify-center gap-1.5 rounded-md py-2 transition-all',
            isLangActive
              ? 'border-foreground text-foreground shadow-xs border-2 font-semibold'
              : 'text-foreground/70 hover:text-foreground border border-transparent',
          )}
        >
          <Globe className="size-4 stroke-[1.5]" />
          <span className="uppercase">{currentLang}</span>
        </button>
      </div>
    </div>
  );
}
