const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
const fallbackHost = vercelHost ?? "localhost:3000";
const fallbackProtocol = fallbackHost.includes("localhost") ? "http" : "https";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? `${fallbackProtocol}://${fallbackHost}`).replace(/\/$/, "");
