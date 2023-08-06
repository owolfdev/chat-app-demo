"use client";

import Image from "next/image";
import { Chat } from "@/components/chat";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

import { useUser } from "@/lib/UserContext";

export default function Home() {
  return (
    <section className="container flex flex-col items-center justify-center gap-6 pt-12 pb-8 px-5 sm:px-8 md:px-12 ">
      <div className="flex flex-col items-start gap-2 ">
        <div className="flex gap-2">
          <h1 className="text-center w-full font-extrabold leading-tight tracking-tight text-5xl sm:text-4xl md:text-5xl">
            Chat App
          </h1>
        </div>
      </div>
      <div className="w-[350px] sm:w-[500px]">
        <Chat />
      </div>
    </section>
  );
}
