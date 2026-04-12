"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouterWithLoader } from "@/lib/utilui";

export default function NewToReddit() {
  const {push} = useRouterWithLoader()

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
      <div className="relative w-full h-64">
        <Image
          src="https://redditinc.com/hs-fs/hubfs/Reddit%20Inc/Graphics/Headers/Desktop/RedditInc_Header_Homepage.png"
          alt="Reddit banner"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 448px"
        />
      </div>
      <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
        <h2 className="text-lg font-semibold"> New to Redit? </h2>
        <p className="text-sm text-muted-foreground max-w-xs">
            Discover and join more subreddits to make your home feed better.
        </p>

        <Button onClick={() =>push("r/all")} className="rounded-full px-5">
          Get Started
        </Button>
      </CardContent>
    </Card>
  );
}