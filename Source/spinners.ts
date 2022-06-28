export interface Spinner {
	interval: number;
	frames: string[];
}

export const Spinners = {
	windows: {
		interval: 80,
		frames: ["/", "-", "\\", "|"],
	},
	dots: {
		interval: 80,
		frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
	},
	arc: {
		interval: 100,
		frames: ["◜", "◠", "◝", "◞", "◡", "◟"],
	},
};
