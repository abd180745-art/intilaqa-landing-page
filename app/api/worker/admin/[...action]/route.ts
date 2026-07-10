import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

const WORKER_BASE_URL = process.env.NEXT_PUBLIC_INTILAQA_ENGINE_URL ?? "https://intilaqa-engine.abo200004.workers.dev";
const WORKER_ADMIN_API_KEY = process.env.WORKER_ADMIN_API_KEY;

async function proxy(req: Request, { params }: { params: Promise<{ action: string[] }> | { action: string[] } }) {
    if (!WORKER_ADMIN_API_KEY) {
        return NextResponse.json({ error: "Server Configuration Error: Worker Admin API Key missing" }, { status: 500 });
    }

    const resolvedParams = await params;

    // 1. Auth check: Ensure the user is logged in
    const supabaseServer = await createClient();
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Role check: Ensure the user is an admin
    const adminClient = createAdminClient();
    const { data: roleData } = await adminClient
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
        
    if (roleData?.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden: Admin Access Required" }, { status: 403 });
    }

    // 3. Build URL
    const actionPath = resolvedParams.action.join('/');
    const targetUrl = new URL(`${WORKER_BASE_URL}/api/admin/${actionPath}`);
    
    // Copy query params
    const incomingUrl = new URL(req.url);
    incomingUrl.searchParams.forEach((value, key) => {
        targetUrl.searchParams.append(key, value);
    });

    // 4. Prepare headers
    const headers = new Headers();
    // Inject the secure Admin Key!
    headers.set('X-Admin-Key', WORKER_ADMIN_API_KEY);
    headers.set('Content-Type', 'application/json');

    // Handle body if it's not GET or HEAD
    let body = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        try {
            body = await req.text();
        } catch (e) {
            // Ignore body read error
        }
    }

    try {
        const workerRes = await fetch(targetUrl.toString(), {
            method: req.method,
            headers: headers,
            body: body || undefined,
        });

        const contentType = workerRes.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const jsonBody = await workerRes.json();
            return NextResponse.json(jsonBody, { status: workerRes.status });
        } else {
            const textBody = await workerRes.text();
            return new NextResponse(textBody, { 
                status: workerRes.status,
                headers: { 'Content-Type': contentType || 'text/plain' }
            });
        }
    } catch (err: any) {
        console.error("Worker Proxy Error:", err);
        return NextResponse.json({ error: "Proxy connection failed", details: err?.message }, { status: 502 });
    }
}

export { proxy as GET, proxy as POST, proxy as DELETE, proxy as PUT, proxy as PATCH };
