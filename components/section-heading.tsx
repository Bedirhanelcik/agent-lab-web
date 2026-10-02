import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
      <h2 className="display text-3xl text-fg sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}
