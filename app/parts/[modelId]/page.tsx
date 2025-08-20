"use client";
import React from "react";
import { PartsList } from "../../../components/PartsList";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeSlideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function PartsByModelIdPage({
  params,
}: {
  params: { modelId: string };
}) {
  const { modelId } = params;

  return (
    <main className="max-w-7xl mx-auto p-8 bg-gradient-to-b from-[#e5f1fc] to-[#f2f4ff] ">
      <Link
        href="/"
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-8">Parts</h1>

      <PartsList
        modelYearId={modelId}
        renderItem={(part, index, children) => (
          <motion.div
            key={part.id}
            variants={fadeSlideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            {children}
          </motion.div>
        )}
      />
    </main>
  );
}
