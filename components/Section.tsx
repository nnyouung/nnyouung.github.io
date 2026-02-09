"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  viewportAmount?: number;
  delay?: number;
  enableMotion?: boolean;
  viewportOnce?: boolean;
};

export default function Section({
  id,
  className,
  children,
  viewportAmount = 0.2,
  delay = 0,
  enableMotion = true,
  viewportOnce = false,
}: SectionProps) {
  if (!enableMotion) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      viewport={{ once: viewportOnce, amount: viewportAmount }}
    >
      {children}
    </motion.section>
  );
}
