import Kia, { forPromise, Spinners } from "./mod.ts";
import { assertThrows, expect } from "./deps.ts";

class TestWriter implements Deno.WriterSync {
	buffer: number[] = [];
	writeSync(p: Uint8Array): number {
		p.forEach((pi) => {
			this.buffer.push(pi);
		});
		return p.length;
	}
}

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

Deno.test("spinner isSpinning when running", () => {
	const kia = new Kia({ writer: new TestWriter() });
	kia.start();
	expect(kia.isSpinning()).toEqual(true);
	kia.stop();
});

Deno.test("spinner !isSpinning when not running", () => {
	const kia = new Kia({ writer: new TestWriter() }).start();
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
		testWriter.buffer.length - sizeAfterNextStop,
	);
});

Deno.test("check renderNextFrame can't be called if spinner is running", () => {
	const kia = new Kia({ writer: new TestWriter() }).start();
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

	expect(
		new TextDecoder()
			.decode(Uint8Array.from(testWriter.buffer))
			.includes(SEARCH_KEY),
	).toBe(true);
});

Deno.test({
	name: "forPromise succeed (Not Windows)",
	ignore: Deno.build.os === "windows",
	fn: async () => {
		const testWriter = new TestWriter();
		await forPromise(() => {}, { writer: testWriter });
		expect(
			new TextDecoder().decode(Uint8Array.from(testWriter.buffer)).includes(
				"√",
			),
		).toBe(true);
	},
});

Deno.test({
	name: "forPromise succeed (Windows)",
	ignore: Deno.build.os !== "windows",
	fn: async () => {
		const testWriter = new TestWriter();
		await forPromise(() => {}, { writer: testWriter });
		expect(
			new TextDecoder()
				.decode(Uint8Array.from(testWriter.buffer))
				.includes(String.fromCharCode(30)),
		).toBe(true);
	},
});

Deno.test("forPromise fail", async () => {
	const testWriter = new TestWriter();
	await forPromise(
		() => {
			throw new Error();
		},
		{ writer: testWriter },
	);

	expect(
		new TextDecoder().decode(Uint8Array.from(testWriter.buffer)).includes("X"),
	).toBe(true);
});

Deno.test("hidden cursor is returned", () => {
	const testWriter = new TestWriter();
	const kia = new Kia({ writer: testWriter }).start();
	kia.stop();
	expect(
		new TextDecoder()
			.decode(Uint8Array.from(testWriter.buffer))
			.includes("\x1b[?25h"),
	).toBe(true);
});

Deno.test("getFrame gets the correct frame", () => {
	const testWriter = new TestWriter();
	const kia = new Kia({ writer: testWriter, spinner: Spinners.windows });
	expect(kia.getFrame()).toBe("/");
});

Deno.test("getText gets the correct text", () => {
	const TEST_TEXT = "This is sample text";
	const testWriter = new TestWriter();
	const kia = new Kia({ writer: testWriter, text: TEST_TEXT });
	expect(kia.getText()).toEqual(TEST_TEXT);
});
