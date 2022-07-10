import Kia, { Spinners } from '../mod.ts';

// Just a function to async sleep
function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Create a spinner instance
const kia = new Kia({
	text: 'Loading sun',
	color: 'cyan',
	indent: 2,
	spinner: Spinners.dots,
});

// Start the spinner
kia.start();
await sleep(2000);

// Change the spinner options
kia.set({ text: 'Loading some more' });
await sleep(1000);
// Finish spinning successfully
kia.succeed('Loaded sun');

kia.start('Loading clouds');
await sleep(2000);
// Finish spinning with a warning
kia.warn('Some clouds loaded');

kia.start('Getting the temperature');
await sleep(2000);
// Finish spinning with an info message
kia.info('Nice and warm!');

kia.start('Loading rain');
await sleep(2000);
// Finish spinning with a failure message
kia.fail('Rain could not be loaded!');
// Since success, fail, warn, and info are all wrappers around stopWithFlair: you could also do this manually like so:
// import {bold, red} from "https://deno.land/std/fmt/colors.ts";
// await kia.stopWithFlair(bold(red("X")), "Rain could not be loaded");
