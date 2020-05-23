import Kia, { forPromise } from "./mod.ts";
import {
	assertThrowsAsync,
	assertThrows,
} from "https://deno.land/std@0.51.0/testing/asserts.ts";
import { expect } from "https://deno.land/x/expect/mod.ts";
class TestWriter implements Deno.WriterSync {
	buffer: string[] = [];
	writeSync(p: Uint8Array): number {
		this.buffer.push(new TextDecoder().decode(p));
		return p.length;
	}
}

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

Deno.test("spinner isSpinning when running", () => {
	const kia = new Kia();
	kia.start();
	expect(kia.isSpinning()).toEqual(true);
	kia.stop();
});

Deno.test("spinner !isSpinning when not running", () => {
	const kia = new Kia().start();
	kia.stop();
	expect(kia.isSpinning()).toEqual(false);
});

Deno.test("stopAndPersist stops the spinner output", async () => {
	const testWriter = new TestWriter();
	const kia = new Kia({ text: "", writer: testWriter }).start();
	kia?.stopAndPersist();

	// Wait and check that there are no extra prints
	const sizeAfterStop = testWriter.buffer.length;
	await sleep(1000);
	expect(kia?.isSpinning()).toEqual(false);
	expect(sizeAfterStop).toEqual(testWriter.buffer.length);
});

Deno.test("renderNextFrame() advances the spinner", () => {
	const testWriter = new TestWriter();
	const kia = new Kia({
		text: "",
		writer: testWriter,
	}).start();
	kia.stopAndPersist();

	const sizeAfterStop = testWriter.buffer.length;
	kia.renderNextFrame();

	// Check that the frame is advancing
	const sizeAfterNextStop = testWriter.buffer.length;
	expect(sizeAfterStop).toBeLessThan(sizeAfterNextStop);

	// Check that each frame is only advancing once
	kia.renderNextFrame();
	expect(sizeAfterNextStop - sizeAfterStop).toEqual(
		testWriter.buffer.length - sizeAfterNextStop
	);
});

Deno.test("check renderNextFrame can't be called if spinner is running", () => {
	const kia = new Kia().start();
	assertThrows(() => {
		kia.renderNextFrame();
	}, Error);
	kia.stop();
});

Deno.test("set() changes the kia options", () => {
	const testWriter = new TestWriter();
	const SEARCH_KEY = "XXX";

	const kia = new Kia({
		text: "sample",
		writer: testWriter,
	}).start();

	// Change the text to the search key and then check if it has actually changed
	kia.stopAndPersist();
	kia.set({ text: SEARCH_KEY });
	kia.renderNextFrame();

	let inArray = false;
	testWriter.buffer.forEach((item) => {
		if (item.includes(SEARCH_KEY)) {
			inArray = true;
		}
	});

	expect(inArray).toBe(true);
});

// Deno.test("forPromise succeed", () => {
// 	const testWriter = new TestWriter();
// 	forPromise(() => {}, { writer: testWriter });

// 	console.error(testWriter.buffer[testWriter.buffer.length]);
// 	Deno.writeTextFileSync("out.txt", testWriter.buffer.join());
// 	expect(testWriter.buffer[testWriter.buffer.length - 1].includes("√")).toBe(
// 		true
// 	);
// });
