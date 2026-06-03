import { NextRequest, NextResponse } from "next/server";
import {
  createItem,
  isCollectionName,
  isWritableCollection,
  listItems,
} from "@/lib/serverData";

type RouteContext = {
  params: Promise<{ collection: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { collection } = await context.params;

  if (!isCollectionName(collection)) {
    return NextResponse.json({ message: "Unknown collection." }, { status: 404 });
  }

  try {
    const rows = await listItems(collection, request.nextUrl.searchParams);
    return NextResponse.json(rows);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { collection } = await context.params;

  if (!isCollectionName(collection)) {
    return NextResponse.json({ message: "Unknown collection." }, { status: 404 });
  }

  if (!isWritableCollection(collection)) {
    return NextResponse.json({ message: "This collection is read-only." }, { status: 405 });
  }

  try {
    const data = await request.json();
    const created = await createItem(collection, data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}

function serverError(error: unknown) {
  const message = error instanceof Error ? error.message : "Server error.";
  return NextResponse.json({ message }, { status: 500 });
}
