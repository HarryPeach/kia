import Kia from "./mod.ts";
import { assertThrowsAsync } from "https://deno.land/std@0.51.0/testing/asserts.ts";
import { expect } from "https://deno.land/x/expect/mod.ts";
class TestWriter implements Deno.Writer {
	buffer: string[] = [];
	write(p: Uint8Array): Promise<number> {
		this.buffer.push(new TextDecoder().decode(p));
		return Promise.resolve(p.length);
	}
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
	// TODO: Rewrite this with TestWriter
	const testWriter = new TestWriter();

	const kia = await new Kia({
		text: "",
		writer: testWriter,
	}).start();
	await kia?.stopAndPersist();

	// Wait and check that there are no extra prints
	const sizeAfterStop = testWriter.buffer.length;
	await sleep(1000);
	expect(kia?.isSpinning()).toEqual(false);
	expect(sizeAfterStop).toEqual(testWriter.buffer.length);
});

Deno.test("renderNextFrame() advances the spinner", async () => {
	const testWriter = new TestWriter();
	const kia = await new Kia({
		text: "",
		writer: testWriter,
	}).start();
	await kia?.stopAndPersist();

	const sizeAfterStop = testWriter.buffer.length;
	await kia?.renderNextFrame();

	// Check that the frame is advancing
	const sizeAfterNextStop = testWriter.buffer.length;
	expect(sizeAfterStop).toBeLessThan(sizeAfterNextStop);

	// Check that each frame is only advancing once
	await kia?.renderNextFrame();
	expect(sizeAfterNextStop - sizeAfterStop).toEqual(
		testWriter.buffer.length - sizeAfterNextStop
	);
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
	const testWriter = new TestWriter();
	const SEARCH_KEY = "XXX";

	const kia = await new Kia({
		text: "sample",
		writer: testWriter,
	}).start();

	// Change the text to the search key and then check if it has actually changed
	await kia?.stopAndPersist();
	await kia?.set({ text: SEARCH_KEY });
	await kia?.renderNextFrame();

	expect(testWriter.buffer[1].includes(SEARCH_KEY)).toBe(true);
});
