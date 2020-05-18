import Kia from "./mod.ts";
import { assertEquals } from "https://deno.land/std@0.51.0/testing/asserts.ts";

Deno.test("Spinner Ends", async () => {
	const kia = await new Kia({
		text: "",
	}).start();
	await kia?.stop().then(() => {
		assertEquals(kia.isSpinning(), false);
	});
});
