import { Spinner, windows } from "./spinners.ts";
import { clearLine } from "./util.ts";

export interface Options {
	text: string;
	color: string;
	spinner: Spinner;
}

type InputOptions = Partial<Options>;

export class Kia {
	public options: Options = {
		text: "Sample Loading",
		color: "red",
		spinner: windows,
	};

	private timeoutRef: any;
	private currentFrame: number = 0;

	constructor(options: InputOptions) {
		Object.assign(this.options, options);
	}

	async start() {
		this.timeoutRef = setInterval(async () => {
			this.currentFrame = (this.currentFrame + 1) % this.options.spinner.frames.length;
			await this.render();
		}, 100);
	}

	async stop() {
		clearInterval(this.timeoutRef);
	}

	async render() {
		clearLine(new TextEncoder(), 
		`${this.options.spinner.frames[this.currentFrame]} ${this.options.text}`);
		// console.log(this.options.spinner.frames[this.currentFrame]);
	}
}
