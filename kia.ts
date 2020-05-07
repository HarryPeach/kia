import { Spinner, dots, windows } from "./spinners.ts";
import { overwriteLine, colorise, Color } from "./util.ts";
import {bold, green, red, yellow, blue} from "https://deno.land/std/fmt/colors.ts";

export interface Options {
	text: string;
	color: Color;
	spinner: Spinner;
}
type InputOptions = Partial<Options>;

export class Kia {
	private options: Options = {
		text: "",
		color: "white",
		spinner: Deno.build.os === "windows" ? windows : dots,
	};

	private timeoutRef: any;
	private isRunning: boolean = false;
	private currentFrame: number = 0;
	private textEncoder = new TextEncoder();

	constructor(options: InputOptions) {
		this.setOptions(options);
		console.log();
	}

	public setOptions(options: InputOptions) {
		Object.assign(this.options, options);
	}

	/**
	 * Starts the spinner
	 */
	async start() {
		if(this.isRunning)
			return;
		this.isRunning = true;
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
		await overwriteLine(this.textEncoder, `\x1b[2K ${flair} ${text}`)
		console.log();
		this.isRunning = false;
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
		await this.stopWithFlair(text, bold(red("X")))
	}

	/**
	 * Stops the spinner and leaves a warning message.
	 * 
	 * The function is a wrapper around ```stopWithFlair```.
	 * @param text The message to be shown when stopped
	 */
	async warn(text: string = this.options.text){
		await this.stopWithFlair(text, bold(yellow("!")))
	}
	
	/**
	 * Stops the spinner and leaves an information message.
	 * 
	 * The function is a wrapper around ```stopWithFlair```.
	 * @param text The message to be shown when stopped
	 */
	async info(text: string = this.options.text){
		await this.stopWithFlair(text, bold(blue("i")))
	}

	/**
	 * Renders each frame of the spinner
	 */
	private async render() {
		await overwriteLine(
			this.textEncoder,
			`${colorise(this.options.color)(
				this.options.spinner.frames[this.currentFrame]
			)} ${this.options.text}`
		);
	}
}
