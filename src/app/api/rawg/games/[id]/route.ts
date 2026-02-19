import { NextResponse } from "next/server";
import { getRawgGameByIdWithSource, isRawgConfigured } from "@/lib/api/rawg";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: Params) {
  const { id } = await context.params;
  const gameId = Number(id);

  if (Number.isNaN(gameId)) {
    return NextResponse.json({ message: "شناسه بازی معتبر نیست." }, { status: 400 });
  }

  const result = await getRawgGameByIdWithSource(gameId);
  const game = result.data;
  if (!game) {
    return NextResponse.json({ message: "بازی پیدا نشد." }, { status: 404 });
  }

  return NextResponse.json({
    ...game,
    source: result.source,
    configured: isRawgConfigured(),
  });
}
