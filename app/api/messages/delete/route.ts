import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const instance = searchParams.get('instance');
        const number = searchParams.get('number');
        const messageId = searchParams.get('messageId');

        if (!instance || !number || !messageId) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
        const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || 'B6D711FCDE4D4FD59365441DB0B6C075';

        const res = await fetch(`${EVOLUTION_API_URL}/chat/deleteMessageForEveryone/${instance}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'apikey': EVOLUTION_API_KEY
            },
            body: JSON.stringify({
                number,
                messageId
            })
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error("Evolution API delete error:", errorData);
            return NextResponse.json({ error: "Failed to delete message from WhatsApp" }, { status: res.status });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete message proxy error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
