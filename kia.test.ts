import Kia from "./mod.ts";
import { assertThrowsAsync } from "https://deno.land/std@0.51.0/testing/asserts.ts";
import { expect } from "https://deno.land/x/expect/mod.ts";

async function setupTestFile(): Promise<[Deno.File, string]> {
	const fileLocation = await Deno.makeTempFile({
		prefix: "kia.test.",
	});
	return [
		await Deno.open(fileLocation, {
			read: true,
			write: true,
			create: true,
		}),
		fileLocation,
	];
}

async function cleanupTestFile(file: Deno.File, fileName: string) {
	file.close();
	Deno.remove(fileName);
}

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

Deno.test("spinner isSpinning when running", async () => {
	const kia = new Kia("");
	await kia.start().then(() => {
		expect(kia.isSpinning()).toEqual(true);
	});
	await kia.stop();
});

Deno.test("spinner !isSpinning when not running", async () => {
	const kia = await new Kia("").start();
	await kia?.stop().then(() => {
		expect(kia.isSpinning()).toEqual(false);
	});
});

Deno.test("stopAndPersist stops the spinner output", async () => {
	const [testFile, testFileName] = await setupTestFile();

	const kia = await new Kia({
		text: "",
		resource: testFile,
	}).start();
	await kia?.stopAndPersist();

	// Wait and check that there are no extra prints
	const sizeAfterStop = (await Deno.stat(testFileName)).size;
	await sleep(1000);
	expect(kia?.isSpinning()).toEqual(false);
	expect(sizeAfterStop).toEqual((await Deno.stat(testFileName)).size);

	await cleanupTestFile(testFile, testFileName);
});

Deno.test("renderNextFrame() advances the spinner", async () => {
	const [testFile, testFileName] = await setupTestFile();

	const kia = await new Kia({
		text: "",
		resource: testFile,
	}).start();
	await kia?.stopAndPersist();

	const sizeAfterStop = (await Deno.stat(testFileName)).size;
	await kia?.renderNextFrame();

	// Check that the frame is advancing
	const sizeAfterNextStop = (await Deno.stat(testFileName)).size;
	expect(sizeAfterStop).toBeLessThan(sizeAfterNextStop);

	// Check that each frame is only advancing once
	await kia?.renderNextFrame();
	expect(sizeAfterNextStop - sizeAfterStop).toEqual(
		(await Deno.stat(testFileName)).size - sizeAfterNextStop
	);

	await cleanupTestFile(testFile, testFileName);
});

Deno.test(
	"check renderNextFrame can't be called if spinner is running",
	async () => {
		const kia = await new Kia("").start();
		await assertThrowsAsync(async () => {
			await kia?.renderNextFrame();
		}, Error);
		await kia?.stop();
	}
);

Deno.test("set() changes the kia options", async () => {
	const [testFile, testFileName] = await setupTestFile();
	const SEARCH_KEY = "XXX";

	const kia = await new Kia({
		text: "sample",
		resource: testFile,
	}).start();

	// Change the text to the search key and then check if it has actually changed
	await kia?.stopAndPersist();
	await kia?.set({ text: SEARCH_KEY });
	await kia?.renderNextFrame();

	expect(
		new TextDecoder()
			.decode(await Deno.readFile(testFileName))
			.includes(SEARCH_KEY)
	).toBe(true);

	await cleanupTestFile(testFile, testFileName);
});
