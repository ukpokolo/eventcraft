import { NextRequest, NextResponse } from "next/server";
import {
  deleteItem,
  getItem,
  isCollectionName,
  isWritableCollection,
  updateItem,
} from "@/lib/serverData";

type RouteContext = {
  params: Promise<{ collection: string; id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const parsed = await parseContext(context);
  if (parsed instanceof NextResponse) {
    return parsed;
  }

  try {
    const item = await getItem(parsed.collection, parsed.id);
    if (!item) {
      return NextResponse.json({ message: "Item not found." }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const parsed = await parseContext(context);
  if (parsed instanceof NextResponse) {
    return parsed;
  }

  if (!isWritableCollection(parsed.collection)) {
    return NextResponse.json({ message: "This collection is read-only." }, { status: 405 });
  }

  try {
    const data = await request.json();
    const item = await updateItem(parsed.collection, parsed.id, data);
    if (!item) {
      return NextResponse.json({ message: "Item not found." }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const parsed = await parseContext(context);
  if (parsed instanceof NextResponse) {
    return parsed;
  }

  if (!isWritableCollection(parsed.collection)) {
    return NextResponse.json({ message: "This collection is read-only." }, { status: 405 });
  }

  try {
    const item = await deleteItem(parsed.collection, parsed.id);
    if (!item) {
      return NextResponse.json({ message: "Item not found." }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return serverError(error);
  }
}

async function parseContext(context: RouteContext) {
  const { collection, id } = await context.params;

  if (!isCollectionName(collection)) {
    return NextResponse.json({ message: "Unknown collection." }, { status: 404 });
  }

  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId < 1) {
    return NextResponse.json({ message: "Invalid item id." }, { status: 400 });
  }

  return { collection, id: numericId };
}

function serverError(error: unknown) {
  const message = error instanceof Error ? error.message : "Server error.";
  return NextResponse.json({ message }, { status: 500 });
}
