import { env } from '$env/dynamic/private';
import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { format } from 'date-fns';
import * as z from 'zod';
import sanitize from 'sanitize-filename';

if (!env.FILE_DROP_KEY) throw new Error('FILE_DROP_KEY is not set');

export const t = initTRPC.context<Context>().create();

// const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg']; // 'image/jpeg', 'image/png', 'image/webp'

export const router = t.router({
	greeting: t.procedure.query(async () => {
		return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`;
	}),
	uploadReport: t.procedure
		.input(
			z.object({
				dataUrl: z.string().refine(async (dataUrl) => {
					const type = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
					// const size = Buffer.from(dataUrl.split(',')[1], 'base64');

					// const base64Response = await fetch(dataUrl);
					// const blob = await base64Response.blob();
					// const file = new File([blob], 'file');
					// console.log('file', file.type);
					return ACCEPTED_IMAGE_TYPES.includes(type);
				}, 'Only .jpg, formats are supported.'),
				date: z.string().pipe(z.coerce.date()),
				address: z.string().nonempty()
			})
		)
		.mutation(async ({ input }) => {
			const base64Response = await fetch(input.dataUrl);
			const blob = await base64Response.blob();

			const file = new File([blob], 'file');
			const filename = sanitize(
				`${format(input.date, 'yyyy-MM-dd_HH-mm-ss')}_${input.address}.jpg`
			);

			const response = await fetch(`https://cloud.rote.tools/public.php/webdav/${filename}`, {
				method: 'PUT',
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
					Authorization: `Basic ${btoa(env.FILE_DROP_KEY + ':')}`
				},
				body: file
			});
			console.log('response', response);
			return response;
		})
});

export type Router = typeof router;
