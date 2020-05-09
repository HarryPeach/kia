import { Spinner, Spinners } from "./spinners.ts";
import {
	writeLine,
	colorise,
	Color,
	clearLine,
	showCursor,
	hideCursor,
} from "./util.ts";
import { Colors } from "./deps.ts";

export interface Options {
	text: string;
	color: Color;
	spinner: Spinner;
	prefixText: string;
	indent: number;
	cursor: boolean;
}
type InputOptions = Partial<Options>;

export default class Kia {
	private options: Options = {
		text: "",
		color: "white",
		spinner: Deno.build.os === "windows" ? Spinners.windows : Spinners.dots,
		prefixText: "",
		indent: 0,
		cursor: false,
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
		return this;
	}

	/**
	 * Starts the spinner
	 * @param text The text to display after the spinner
	 */
	async start(text?: string) {
		if (this.spinning) return;
		this.spinning = true;

		if (text) await this.set(text);

		if (!this.options.cursor) await hideCursor(this.textEncoder);

		this.timeoutRef = setInterval(async () => {
			this.currentFrame =
				(this.currentFrame + 1) % this.options.spinner.frames.length;
			await this.render();
		}, this.options.spinner.interval);
		return this;
	}

	/**
	 * Stops the spinner and clears its line
	 */
	async stop() {
		clearInterval(this.timeoutRef);
		await clearLine(this.textEncoder);
		if (!this.options.cursor) await showCursor(this.textEncoder);
		return this;
	}

	/**
	 * Stops the spinner and leaves a message in its place
	 * @param text The message to show when stopped
	 * @param flair The icon to prepend the message
	 */
	async stopWithFlair(text: string = this.options.text, flair: string) {
		await this.stop();
		await writeLine(
			this.textEncoder,
			`${flair} ${text}`,
			this.options.indent
		);
		this.spinning = false;
		return this;
	}

	/**
	 * Stops the spinner and leaves a success message.
	 *
	 * The function is a wrapper around ```stopWithFlair```.
	 * @param text The message to be shown when stopped
	 */
	async succeed(text: string = this.options.text) {
		return await this.stopWithFlair(text, Colors.bold(Colors.green("√")));
	}

	/**
	 * Stops the spinner and leaves a failure message.
	 *
	 * The function is a wrapper around ```stopWithFlair```.
	 * @param text The message to be shown when stopped
	 */
	async fail(text: string = this.options.text) {
		return await this.stopWithFlair(text, Colors.bold(Colors.red("X")));
	}

	/**
	 * Stops the spinner and leaves a warning message.
	 *
	 * The function is a wrapper around ```stopWithFlair```.
	 * @param text The message to be shown when stopped
	 */
	async warn(text: string = this.options.text) {
		return await this.stopWithFlair(text, Colors.bold(Colors.yellow("!")));
	}

	/**
	 * Stops the spinner and leaves an information message.
	 *
	 * The function is a wrapper around ```stopWithFlair```.
	 * @param text The message to be shown when stopped
	 */
	async info(text: string = this.options.text) {
		return await this.stopWithFlair(text, Colors.bold(Colors.blue("i")));
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
		await writeLine(
			this.textEncoder,
			`${this.options.prefixText}${colorise(this.options.color)(
				this.options.spinner.frames[this.currentFrame]
			)} ${this.options.text}`,
			this.options.indent
		);
	}
}

/**
 * Starts a spinner for a promise
 */
export const forPromise = (action: Function, options: InputOptions) => {
	const kia = new Kia(options);
	kia.start();

	(async () => {
		try {
			await action();
			kia.succeed();
		} catch (_) {
			kia.fail();
		}
	})();

	return kia;
};
