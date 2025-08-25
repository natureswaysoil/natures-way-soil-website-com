import { env } from 'process';

export type LandingContent = {
	heroTitle: string;
	mission: string;
	heroImage: string;
	promise: string[];
	why: string[];
	videoUrl: string;
};

const defaultContent: LandingContent = {
	heroTitle: 'From Our Farm to Your Garden',
	mission:
		"At Nature’s Way Soil, our mission is simple: to bring life back to the soil, naturally. We’re a family-run farm that saw firsthand the damage years of synthetic fertilizers had done to the land. Instead of following the same path, we set out to restore the earth the way nature intended—through biology, not chemistry.",
	heroImage: '/logo.png',
	promise: [
		' Safe & Natural – Every product we make is safe for children, pets, and pollinators.',
		' Microbe-Rich Formulas – We use beneficial microbes, worm castings, biochar, and natural extracts to restore soil health.',
		' Sustainable Farming – From duckweed to compost teas, our ingredients are chosen to recycle nutrients and heal the land.',
		' Results You Can See – Greener lawns, healthier pastures, stronger roots, and thriving gardens—without synthetic chemicals.',
	],
	why: [
		"Soil isn’t just dirt—it’s a living ecosystem. By nurturing the microbes and natural processes in the ground, we create healthier plants, stronger food systems, and a cleaner environment for future generations.",
		"Every bottle and bag of Nature’s Way Soil® carries this commitment: to restore the balance between people, plants, and the planet.",
	],
	videoUrl: 'https://www.youtube.com/embed/VIDEO_ID',
};

export async function getLandingContent(): Promise<LandingContent> {
	const space = env.CONTENTFUL_SPACE_ID;
	const token = env.CONTENTFUL_ACCESS_TOKEN;
	const entryId = env.CONTENTFUL_ENTRY_ID;
	if (!space || !token || !entryId) {
		return defaultContent;
	}
	try {
		const res = await fetch(
			`https://cdn.contentful.com/spaces/${space}/environments/master/entries/${entryId}?access_token=${token}`
		);
		if (!res.ok) throw new Error('Failed to fetch');
		const data = await res.json();
		const fields = data.fields || {};
		return {
			heroTitle: fields.heroTitle || defaultContent.heroTitle,
			mission: fields.mission || defaultContent.mission,
			heroImage: fields.heroImageUrl || defaultContent.heroImage,
			promise: fields.promise || defaultContent.promise,
			why: fields.why || defaultContent.why,
			videoUrl: fields.videoUrl || defaultContent.videoUrl,
		};
	} catch (err) {
		console.warn('CMS fetch failed', err);
		return defaultContent;
	}
}
