import { NextResponse } from "next/server";
import { getAllToys } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const toys = getAllToys();
  const toy = toys[Math.floor(Math.random() * toys.length)];

  return NextResponse.json({
    slug: toy.slug,
    name: toy.name,
    displayName: toy.displayName,
    trademark: toy.trademark,
    firstYear: toy.firstYear,
    photo: toy.photos[0],
  });
}
