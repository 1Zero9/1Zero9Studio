import { ReactNode } from 'react';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function HolidayPageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('ha-page', className)}>{children}</div>;
}

export function HolidayHero({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('ha-hero', className)}>
      <div className="ha-orb-1" />
      <div className="ha-orb-2" />
      <div className="ha-orb-3" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function HolidayPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('ha-panel', className)}>{children}</div>;
}

export function HolidayPrimaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={cn('ha-btn-primary', className)}>
      {children}
    </button>
  );
}

export function HolidaySecondaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={cn('ha-btn-secondary', className)}>
      {children}
    </button>
  );
}
