import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const q = url.searchParams.get('q')?.trim();

	if (!q) {
		return json([], { headers: { 'Cache-Control': 'no-store' } });
	}

	try {
		const response = await fetch(
			`https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}&type=list`,
			{
				headers: { 'User-Agent': 'ArcSearch/1.0' },
				signal: AbortSignal.timeout(3000)
			}
		);

		if (!response.ok) {
			return json([], { headers: { 'Cache-Control': 'no-store' } });
		}

		const payload = (await response.json()) as unknown;
		const suggestions =
			Array.isArray(payload) && Array.isArray(payload[1]) ? (payload[1] as string[]) : [];

		return json(suggestions, { headers: { 'Cache-Control': 'no-store' } });
	} catch {
		return json([], { headers: { 'Cache-Control': 'no-store' } });
	}
};
