import axios from 'axios';
import { join } from 'path';
import { z } from 'zod';
import { collectZodErrors } from './util';

const BASE_URL = 'https://comicvine.gamespot.com/api/'; // Replace with actual API URL

export const ComicSchema = z.object({
    aliases: z.any(),
    api_detail_url: z.string(),
    cover_date: z.string().nullable(),
    date_added: z.string(),
    date_last_updated: z.string(),
    deck: z.any(),
    description: z.string().nullable(),
    has_staff_review: z.boolean(),
    id: z.number(),
    image: z.object({
        icon_url: z.string(),
        medium_url: z.string(),
        screen_url: z.string(),
        screen_large_url: z.string(),
        small_url: z.string(),
        super_url: z.string(),
        thumb_url: z.string(),
        tiny_url: z.string(),
        original_url: z.string(),
        image_tags: z.string()
    }),
    associated_images: z.array(
        z.object({
            original_url: z.string(),
            id: z.number(),
            caption: z.null(),
            image_tags: z.string()
        })
    ),
    issue_number: z.string(),
    name: z.string().nullable(),
    site_detail_url: z.string(),
    store_date: z.string().nullable(),
    volume: z.object({
        api_detail_url: z.string(),
        id: z.number(),
        name: z.string(),
        site_detail_url: z.string()
    }),
    resource_type: z.string()
})

export type Comic = z.infer<typeof ComicSchema>;

export class ComicApi {
    apiKey: string
    constructor(key: string) {
        this.apiKey = key
    }

    async request(path: string, params: Record<string, unknown>) {
        const response = await axios.get(join(BASE_URL, path), {
            params: { ...params, api_key: this.apiKey },
        });                
        return response.data;
    }

    async search(query: string): Promise<Comic[]> {
        try {
            const response = await this.request('/search/', {
                resources: 'issue',
                format: 'json',
                query
            })

            if (!response.results) {
                return []
            }

            const comics = ComicSchema.array().safeParse(response.results);
            if (!comics.success) {
                throw new Error(`Failed to parse comics from the API:\n${collectZodErrors(comics.error).join('\n')}`);
            }

            return comics.data;

        } catch (error) {
            console.error(`Error fetching data: ${(error as Error).message}`);
            return []
        }
    }
}
