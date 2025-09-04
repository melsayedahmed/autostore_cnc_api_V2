"use client";
import Image from "next/image";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Type } from "../lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useInfiniteTypes } from "@/hooks/useInfiniteTypes";

const InfiniteTypesList = dynamic(
  () =>
    import("../components/InfiniteTypesList").then((m) => m.InfiniteTypesList),
  { ssr: false }
);

// Animation Variants
const fadeSlideDown = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function HomePageClient() {
  const queryClient = useQueryClient();
  const {
    types,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteTypes();

  const handleSelect = () => {};
  console.log("Test")

  const renderTypeItem = (
    type: Type,
    index: number,
    children: React.ReactNode
  ) => (
    <motion.div
      key={type.id}
      variants={fadeSlideUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
    >
      <Link href={`/types/${type.id}`} prefetch>
        <div className="block h-full w-full">{children}</div>
      </Link>
    </motion.div>
  );

  return (
    <main className="min-h-screen pt-20 bg-gradient-to-b from-[#e5f1fc] to-[#f2f4ff] dark:bg-[radial-gradient(ellipse_at_center,_rgb(16,13,33)_0%,_#0b0a1a_100%)]">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-center mb-4 md:hidden  -mt-14 ">
          <Link href="/" className="block">
            <Image
              src="/images/nav.webp"
              alt="Logo"
              width={150}
              height={40}
              priority
            />
          </Link>
        </div>

        {/* العنوان */}
        <motion.h1
          variants={fadeSlideDown}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="text-3xl font-bold mb-8 text-black dark:text-white text-center md:text-left"
        >
          Browse Vehicle Parts
        </motion.h1>

        {/* InfiniteTypesList */}
        {!isLoading && !isError && (
          <div>
            <InfiniteTypesList
              types={types}
              onSelect={handleSelect}
              onLoadMore={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              renderItem={(type, children, index) =>
                renderTypeItem(type, index, children)
              }
            />
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center 
          bg-white dark:bg-gradient-to-b dark:from-[#4998a455] dark:to-[#4998a4] 
          border border-transparent rounded-2xl shadow-md 
          p-12 aspect-[4/3] animate-pulse"
              >
                {/* الصورة الوهمية */}
                <div className="w-full h-20 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>

                {/* النص الوهمي */}
                <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400 mb-4">
              Failed to load vehicle parts. Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
