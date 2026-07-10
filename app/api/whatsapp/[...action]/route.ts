import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;

async function proxy(req: Request, { params }: { params: Promise<{ action: string[] }> | { action: string[] } }) {
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
        return NextResponse.json({ error: "Server Configuration Error: Evolution API missing" }, { status: 500 });
    }

    const resolvedParams = await params;

    // 1. Auth check
    const supabaseServer = await createClient();
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check plan
    const adminClient = createAdminClient();
    const { data: roleData } = await adminClient
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
        
    const { data: planData } = await adminClient
        .from('clients_balances')
        .select('plan_name')
        .eq('user_id', user.id)
        .single();
        
    if (roleData?.role !== 'admin' && planData?.plan_name !== 'ultimate') {
        return NextResponse.json({ error: "Forbidden: Ultimate Plan Required" }, { status: 403 });
    }

    // 2. Build URL
    const actionPath = resolvedParams.action.join('/');
    const targetUrl = new URL(`${EVOLUTION_API_URL}/${actionPath}`);
    
    // Copy query params
    const incomingUrl = new URL(req.url);
    incomingUrl.searchParams.forEach((value, key) => {
        targetUrl.searchParams.append(key, value);
    });

    // 3. Prepare headers
    const headers = new Headers();
    headers.set('apikey', EVOLUTION_API_KEY!);
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
        const evolutionRes = await fetch(targetUrl.toString(), {
            method: req.method,
            headers: headers,
            body: body || undefined,
        });

        // Pass response back to client
        const contentType = evolutionRes.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const jsonBody = await evolutionRes.json();
            return NextResponse.json(jsonBody, { status: evolutionRes.status });
        } else {
            const textBody = await evolutionRes.text();
            return new NextResponse(textBody, { 
                status: evolutionRes.status,
                headers: { 'Content-Type': contentType || 'text/plain' }
            });
        }
    } catch (err: any) {
        console.error("Evolution Proxy Error:", err);
        return NextResponse.json({ error: "Proxy connection failed", details: err?.message }, { status: 502 });
    }
}

export { proxy as GET, proxy as POST, proxy as DELETE, proxy as PUT, proxy as PATCH };
