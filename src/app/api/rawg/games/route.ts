import { NextResponse } from "next/server";
import { getRawgGamesWithSource, isRawgConfigured } from "@/lib/api/rawg";

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 1) return fallback;
  return Math.floor(parsed);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parsePositiveInt(searchParams.get("page"), 1);
    const pageSize = parsePositiveInt(searchParams.get("page_size"), 12);

    const result = await getRawgGamesWithSource({
      search: searchParams.get("search") ?? "",
      genres: searchParams.get("genres") ?? "",
      platforms: searchParams.get("platforms") ?? "",
      ordering: searchParams.get("ordering") ?? "-rating",
      page,
      page_size: pageSize,
    });

    return NextResponse.json({
      ...result.data,
      source: result.source,
      configured: isRawgConfigured(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "خطا در دریافت لیست بازی ها.",
      },
      { status: 500 }
    );
  }
}
