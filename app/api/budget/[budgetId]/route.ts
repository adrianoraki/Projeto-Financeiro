
import { NextRequest, NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{ budgetId: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
    const { budgetId } = await context.params;
    console.log(`Updating budget: ${budgetId}`);
    return NextResponse.json({ message: `Budget ${budgetId} updated (mock)` });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
    const { budgetId } = await context.params;
    console.log(`Deleting budget: ${budgetId}`);
    return NextResponse.json({ message: `Budget ${budgetId} deleted (mock)` });
}
