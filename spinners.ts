export interface Spinner {
    interval: number;
    frames: string[];
}

export const windows: Spinner = {
    interval: 80,
    frames: ["/", "-", "\\", "|"]
}

export const dots: Spinner = {
    interval: 80,
    frames: [
        "⠋",
        "⠙",
        "⠹",
        "⠸",
        "⠼",
        "⠴",
        "⠦",
        "⠧",
        "⠇",
        "⠏"
    ]
}
