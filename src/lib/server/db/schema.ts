import { serial, uuid, timestamp, pgSchema } from 'drizzle-orm/pg-core';

export const schema = pgSchema('vanmelder');

export const reportsTable = schema.table('reports', {
	id: serial('id').primaryKey(),
	deviceUUID: uuid('device_uuid'),
	timestamp: timestamp('timestamp').notNull().defaultNow()
});

export type InsertReport = typeof reportsTable.$inferInsert;
export type SelectReport = typeof reportsTable.$inferSelect;
