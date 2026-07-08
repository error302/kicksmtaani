"use client";

import { motion } from "framer-motion";
import { Truck, Shield, RotateCcw } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";

interface Props {
  settings: SiteSettings;
}

const ICONS = [Truck, Shield, RotateCcw];

export function TrustBar({ settings: s }: Props) {
  const features = [
    { title: s.trust1Title, sub: s.trust1Sub },
    { title: s.trust2Title, sub: s.trust2Sub },
    { title: s.trust3Title, sub: s.trust3Sub },
  ];

  return (
    <section className="border-y border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {features.map((f, i) => {
            const Icon = ICONS[i] || Truck;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-center justify-center gap-3 py-5 sm:py-6"
              >
                <Icon className="h-5 w-5 text-foreground" />
                <div>
                  <p className="text-sm font-medium leading-tight">{f.title}</p>
                  <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                    {f.sub}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
