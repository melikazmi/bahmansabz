import { NextResponse } from "next/server";
import {
  getRawgGenresWithSource,
  getRawgPlatformsWithSource,
  isRawgConfigured,
} from "@/lib/api/rawg";

export async function GET() {
  try {
    const [genresResult, platformsResult] = await Promise.all([
      getRawgGenresWithSource(),
      getRawgPlatformsWithSource(),
    ]);

    const source =
      genresResult.source === "rawg" && platformsResult.source === "rawg"
        ? "rawg"
        : "fallback";

    return NextResponse.json({
      genres: genresResult.data,
      platforms: platformsResult.data,
      source,
      configured: isRawgConfigured(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "خطا در دریافت اطلاعات پایه بازی ها.",
      },
      { status: 500 }
    );
  }
}
