import { Spinner, Spinners } from './spinners.ts';
import {
	clearLine,
	Color,
	colorise,
	hideCursor,
	showCursor,
	writeLine,
} from './util.ts';
import { Colors } from './deps.ts';

export interface Options {
	text: string;
	color: Color;
	spinner: Spinner;
	prefixText: string;
	indent: number;
	cursor: boolean;
	writer: Deno.WriterSync;
}
type InputOptions = Partial<Options>;

export default class Kia {
	private options: Options = {
		text: '',
		color: 'white',
		spinner: Deno.build.os === 'windows' ? Spinners.windows : Spinners.dots,
		prefixText: '',
		indent: 0,
		cursor: false,
		writer: Deno.stdout,
	};

	// deno-lint-ignore no-explicit-any
	private timeoutRef: any;
	private spinning = false;
	private currentFrame = 0;
	private textEncoder = new TextEncoder();

	constructor(options?: InputOptions | string) {
		if (!options) return;
		if (typeof options === 'string') {
			options = {
				text: options,
			};
		}
		Object.assign(this.options, options);
		this.render();
	}

	public set(options: InputOptions | string) {
		if (typeof options === 'string') {
			options = {
				text: options,
			};
		}
		Object.assign(this.options, options);
		this.render();
		return this;
	}

	/**
	 * Starts the spinner
	 * @param text The text to display after the spinner
	 */
	start(text?: string) {
		if (this.spinning) {
			this.stop();
		}

		this.spinning = true;

		if (text) this.set(text);

		if (!this.options.cursor) {
			hideCursor(this.options.writer, this.textEncoder);
		}

		this.timeoutRef = setInterval(() => {
			this.currentFrame = (this.currentFrame + 1) %
				this.options.spinner.frames.length;
			this.render();
		}, this.options.spinner.interval);
		return this;
	}

	/**
	 * Stops the spinner and holds it in a static state. Returns the instance.
	 * @param options The options to apply after stopping the spinner
	 */
	stopAndPersist(options?: InputOptions) {
		clearInterval(this.timeoutRef);
		this.spinning = false;
		if (options) this.set(options);
		return this;
	}

	/**
	 * Renders the next frame of the spinner when it is stopped.
	 */
	renderNextFrame() {
		if (this.spinning) {
			throw new Error(
				'You cannot manually render frames when the spinner is running, run stopAndPersist() first.',
			);
		}
		this.currentFrame = (this.currentFrame + 1) %
			this.options.spinner.frames.length;
		this.render();
		return this;
	}

	/**
	 * Stops the spinner and clears its line
	 */
	stop() {
		clearInterval(this.timeoutRef);
		clearLine(this.options.writer, this.textEncoder);
		if (!this.options.cursor) {
			showCursor(this.options.writer, this.textEncoder);
		}
		this.spinning = false;
		return this;
	}

	/**
	 * Stops the spinner and leaves a message in its place
	 * @param text The message to show when stopped
	 * @param flair The icon to prepend the message
	 */
	stopWithFlair(text: string = this.options.text, flair: string) {
		this.stop();
		writeLine(
			this.options.writer,
			this.textEncoder,
			`${flair} ${text}\n`,
			this.options.indent,
		);
		return this;
	}

	/**
	 * Stops the spinner and leaves a success message.
	 *
	 * The function is a wrapper around ```stopWithFlair```.
	 * @param text The message to be shown when stopped
	 */
	succeed(text: string = this.options.text) {
		return this.stopWithFlair(
			text,
			Colors.bold(
				Colors.green(
					Deno.build.os === 'windows' ? String.fromCharCode(30) : '√',
				),
			),
		);
	}

	/**
	 * Stops the spinner and leaves a failure message.
	 *
	 * The function is a wrapper around ```stopWithFlair```.
	 * @param text The message to be shown when stopped
	 */
	fail(text: string = this.options.text) {
		return this.stopWithFlair(text, Colors.bold(Colors.red('X')));
	}

	/**
	 * Stops the spinner and leaves a warning message.
	 *
	 * The function is a wrapper around ```stopWithFlair```.
	 * @param text The message to be shown when stopped
	 */
	warn(text: string = this.options.text) {
		return this.stopWithFlair(text, Colors.bold(Colors.yellow('!')));
	}

	/**
	 * Stops the spinner and leaves an information message.
	 *
	 * The function is a wrapper around ```stopWithFlair```.
	 * @param text The message to be shown when stopped
	 */
	info(text: string = this.options.text) {
		return this.stopWithFlair(text, Colors.bold(Colors.blue('i')));
	}

	/**
	 * Returns whether the instance is currently spinning
	 */
	isSpinning(): boolean {
		return this.spinning;
	}

	/**
	 * Returns the current spinner frame
	 */
	getFrame(): string {
		return this.options.spinner.frames[this.currentFrame];
	}

	/**
	 * Gets the current text
	 */
	getText(): string {
		return this.options.text;
	}

	/**
	 * Renders each frame of the spinner
	 */
	private render() {
		const colorFunc = colorise(this.options.color);
		writeLine(
			this.options.writer,
			this.textEncoder,
			`${this.options.prefixText}${
				colorFunc(
					this.options.spinner.frames[this.currentFrame],
				)
			} ${this.options.text}`,
			this.options.indent,
		);
	}
}

/**
 * Starts a spinner for a promise
 */
// deno-lint-ignore ban-types
export const forPromise = async (action: Function, options: InputOptions) => {
	const kia = new Kia(options).start();

	await (async () => {
		try {
			await action();
			kia.succeed();
		} catch (_) {
			kia.fail();
		}
	})();

	return kia;
};
