import Kia from "./mod.ts";
import {
	assertEquals,
	assertThrowsAsync,
} from "https://deno.land/std@0.51.0/testing/asserts.ts";

Deno.test("Spinner isSpinning when running", async () => {
	const kia = new Kia("");
	await kia.start().then(() => {
		assertEquals(kia.isSpinning(), true);
	});
	await kia.stop();
});

Deno.test("Spinner !isSpinning when not running", async () => {
	const kia = await new Kia("").start();
	await kia?.stop().then(() => {
		assertEquals(kia.isSpinning(), false);
	});
});

Deno.test(
	"Check renderNextFrame can't be called if spinner is running",
	async () => {
		const kia = await new Kia("").start();
		await assertThrowsAsync(async () => {
			await kia?.renderNextFrame();
		}, Error);
		await kia?.stop();
	}
);
