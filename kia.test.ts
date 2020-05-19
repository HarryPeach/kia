import Kia from "./mod.ts";
import { assertEquals } from "https://deno.land/std@0.51.0/testing/asserts.ts";

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
