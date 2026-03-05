
import { NextRequest, NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{ goalId: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
    const { goalId } = await context.params;
    console.log(`Fetching goal: ${goalId}`);
    return NextResponse.json({ message: `Goal ${goalId} fetched (mock)` });
}

export async function PUT(request: NextRequest, context: RouteContext) {
    const { goalId } = await context.params;
    console.log(`Updating goal: ${goalId}`);
    return NextResponse.json({ message: `Goal ${goalId} updated (mock)` });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
    const { goalId } = await context.params;
    console.log(`Deleting goal: ${goalId}`);
    return NextResponse.json({ message: `Goal ${goalId} deleted (mock)` });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
    const { goalId } = await context.params;
    console.log(`Patching goal: ${goalId}`);
    return NextResponse.json({ message: `Goal ${goalId} patched (mock)` });
}
