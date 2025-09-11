import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const { tag, secret } = await req.json();

	// security: require a secret token
	if (secret !== process.env.REVALIDATE_SECRET) {
		return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
	}

	if (!tag) {
		return NextResponse.json({ error: 'Tag is required' }, { status: 400 });
	}

	try {
		// revalidate the given tag
		revalidateTag(tag);
		return NextResponse.json({ revalidated: true, tag });
	} catch (err) {
		return NextResponse.json({ error: 'Failed to revalidate', details: String(err) }, { status: 500 });
	}
}
