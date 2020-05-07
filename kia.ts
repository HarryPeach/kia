import { Spinner, dots } from "./spinners.ts";
import { overwriteLine, colorise, Color } from "./util.ts";

export interface Options {
	text: string;
	color: Color;
	spinner: Spinner;
}
type InputOptions = Partial<Options>;

export class Kia {
	private options: Options = {
		text: "Sample Loading",
		color: Color.White,
		spinner: dots,
	};

	private timeoutRef: any;
	private currentFrame: number = 0;
	private textEncoder = new TextEncoder();

	constructor(options: InputOptions) {
		this.setOptions(options);
	}

	public setOptions(options: InputOptions){
		Object.assign(this.options, options);
	}

	/**
	 * Starts the spinner
	 */
	async start() {
		this.timeoutRef = setInterval(async () => {
			this.currentFrame = (this.currentFrame + 1) % this.options.spinner.frames.length;
			await this.render();
		}, this.options.spinner.interval);
	}

	/**
	 * Stops the spinner and inserts a newline
	 */
	async stop() {
		clearInterval(this.timeoutRef);
		console.log("");
	}

	/**
	 * Renders each frame of the spinner
	 */
	private async render() {
		await overwriteLine(this.textEncoder, 
		`${colorise(this.options.color, this.options.spinner.frames[this.currentFrame])} ${this.options.text}`);
	}
}
