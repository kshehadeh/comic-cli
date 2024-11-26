import { Command } from 'commander';
import { ComicApi } from './api.ts';
import { console as ansieConsole } from 'ansie';
import { encode } from 'he'
import TurndownService from 'turndown';

const program = new Command();
const turndown = new TurndownService();

program
    .name('comics')
    .description('CLI to search a comic book database')
    .version('1.0.0');

program
    .command('search <query>')
    .description('Search for comics by keyword')
    .action(async (query) => {
        console.log(`Searching for comics with keyword: ${query}`);

        try {
            const api = new ComicApi(process.env.COMICVINE_API_KEY || '');
            const results = await api.search(query);

            if (results.length === 0) {
                console.log('No results found.');
            } else {
                results
                    .filter(c => !!c.name)
                    .forEach((comic) => {
                        console.log((`${comic.volume.name} / ${encode((comic.name || comic.volume.name))} #${comic.issue_number}`));
                    });
            }
        } catch (error) {
            ansieConsole.error(`🛑 ${(error as Error).message}`);
        }
    });

program.parse(process.argv);