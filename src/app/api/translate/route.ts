import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get("text");
  const langpair = req.nextUrl.searchParams.get("langpair") ?? "fr|en";

  if (!text || text.trim().length === 0) {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  // Limit input length to avoid abuse
  if (text.length > 500) {
    return NextResponse.json({ error: "Text too long" }, { status: 400 });
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langpair)}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      return NextResponse.json({ error: "Translation service unavailable" }, { status: 502 });
    }

    const data = await res.json();
    const translation: string | null = data.responseData?.translatedText ?? null;

    return NextResponse.json({ translation, langpair });
  } catch {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
