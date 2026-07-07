"use client";

import { motion } from "framer-motion";
import { Truck, Shield, RotateCcw } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Free delivery",
    sub: "Nairobi & Mombasa · 1–2 days",
  },
  {
    icon: Shield,
    title: "100% authentic",
    sub: "Every pair verified",
  },
  {
    icon: RotateCcw,
    title: "7-day returns",
    sub: "Hassle-free, no questions",
  },
];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-center justify-center gap-3 py-5 sm:py-6"
            >
              <f.icon className="h-5 w-5 text-foreground" />
              <div>
                <p className="text-sm font-medium leading-tight">{f.title}</p>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                  {f.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
