import { Spinner, SPINNERS } from "./spinners.ts";
import { overwriteLine, colorise, Color } from "./util.ts";
import {
	bold,
	green,
	red,
	yellow,
	blue,
} from "https://deno.land/std/fmt/colors.ts";

export interface Options {
	text: string;
	color: Color;
	spinner: Spinner;
	prefixText: string;
}
type InputOptions = Partial<Options>;

export class Kia {
	private options: Options = {
		text: "",
		color: "white",
		spinner: Deno.build.os === "windows" ? SPINNERS.windows : SPINNERS.dots,
		prefixText: "",
	};

	private timeoutRef: any;
	private spinning: boolean = false;
	private currentFrame: number = 0;
	private textEncoder = new TextEncoder();

	constructor(options: InputOptions | string) {
		this.set(options);
	}

	public async set(options: InputOptions | string) {
		if (typeof options === "string") {
			options = {
				text: options,
			};
		}
		Object.assign(this.options, options);
	}

	/**
	 * Starts the spinner
	 * @param text The text to display after the spinner
	 */
	async start(text?: string) {
		if (this.spinning) return;
		this.spinning = true;
		if (text) {
			await this.set(text);
		}
		this.timeoutRef = setInterval(async () => {
			this.currentFrame =
				(this.currentFrame + 1) % this.options.spinner.frames.length;
			await this.render();
		}, this.options.spinner.interval);
	}

	/**
	 * Stops the spinner and clears its line
	 */
	async stop() {
		clearInterval(this.timeoutRef);
		await overwriteLine(this.textEncoder, `\x1b[2K`);
	}

	/**
	 * Stops the spinner and leaves a message in its place
	 * @param text The message to show when stopped
	 * @param flair The icon to prepend the message
	 */
	async stopWithFlair(text: string = this.options.text, flair: string) {
		clearInterval(this.timeoutRef);
		await overwriteLine(this.textEncoder, `\x1b[2K ${flair} ${text}`);
		console.log();
		this.spinning = false;
	}

	/**
	 * Stops the spinner and leaves a success message.
	 *
	 * The function is a wrapper around ```stopWithFlair```.
	 * @param text The message to be shown when stopped
	 */
	async succeed(text: string = this.options.text) {
		await this.stopWithFlair(text, bold(green("√")));
	}

	/**
	 * Stops the spinner and leaves a failure message.
	 *
	 * The function is a wrapper around ```stopWithFlair```.
	 * @param text The message to be shown when stopped
	 */
	async fail(text: string = this.options.text) {
		await this.stopWithFlair(text, bold(red("X")));
	}

	/**
	 * Stops the spinner and leaves a warning message.
	 *
	 * The function is a wrapper around ```stopWithFlair```.
	 * @param text The message to be shown when stopped
	 */
	async warn(text: string = this.options.text) {
		await this.stopWithFlair(text, bold(yellow("!")));
	}

	/**
	 * Stops the spinner and leaves an information message.
	 *
	 * The function is a wrapper around ```stopWithFlair```.
	 * @param text The message to be shown when stopped
	 */
	async info(text: string = this.options.text) {
		await this.stopWithFlair(text, bold(blue("i")));
	}

	/**
	 * Returns whether the instance is currently spinning
	 */
	isSpinning(): boolean {
		return this.spinning;
	}

	/**
	 * Renders each frame of the spinner
	 */
	private async render() {
		await overwriteLine(
			this.textEncoder,
			`${this.options.prefixText} ${colorise(this.options.color)(
				this.options.spinner.frames[this.currentFrame]
			)} ${this.options.text}`
		);
	}
}
