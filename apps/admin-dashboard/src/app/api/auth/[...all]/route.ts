import type { NextRequest } from "next/server";

const resolveAuthWorkerUrl = () => {
    return process.env.AUTH_WORKER_URL ?? "http://127.0.0.1:8788";
};

const proxyRequest = async (request: NextRequest, params: { readonly all?: readonly string[] }) => {
    const segments = params.all ?? [];
    const pathname = segments.join("/");
    const targetUrl = new URL(`/api/auth/${pathname}${request.nextUrl.search}`, resolveAuthWorkerUrl());
    const headers = new Headers(request.headers);
    const host = request.headers.get("host");

    if (host !== null) {
        headers.set("x-forwarded-host", host);
    }

    headers.set("x-forwarded-proto", request.nextUrl.protocol.replace(":", ""));

    const response = await fetch(targetUrl, {
        method: request.method,
        headers,
        body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    });

    return new Response(response.body, {
        status: response.status,
        headers: response.headers,
    });
};

export const GET = (request: NextRequest, context: { params: { all?: readonly string[] } }) =>
    proxyRequest(request, context.params);

export const POST = (request: NextRequest, context: { params: { all?: readonly string[] } }) =>
    proxyRequest(request, context.params);

export const PUT = (request: NextRequest, context: { params: { all?: readonly string[] } }) =>
    proxyRequest(request, context.params);

export const PATCH = (request: NextRequest, context: { params: { all?: readonly string[] } }) =>
    proxyRequest(request, context.params);

export const DELETE = (request: NextRequest, context: { params: { all?: readonly string[] } }) =>
    proxyRequest(request, context.params);