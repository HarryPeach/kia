# Kia

> Simple terminal spinners for Deno 🦕

![weather.ts example](https://user-images.githubusercontent.com/4750998/81313185-710ac900-907f-11ea-9735-d623559d08f6.gif)

> Based on [ora](https://www.npmjs.com/package/ora) with inspirations from [cli-spinners](https://www.npmjs.com/package/cli-spinners), and [CLI Spinners for Deno](https://deno.land/x/cli_spinners/)

## Usage

```typescript
import { Kia } from "./kia.ts";

const kia = new Kia("Hello");
await kia.start();
// Some async action that'll take some time
await kia.success("Action completed");
```

More thorough examples are available in the [examples folder](https://github.com/HarryPeach/kia/tree/master/examples)

## API

### kia(text)

### kia(options)

Kia can be created with a string or the Options interface. A string is simply mapped to `Options.text`

```typescript
const kia = new Kia("Hello");
// or
const kia = new Kia({
	text: "Hello",
	color: "Red",
});
```

#### options

You can pass any of the following options to the kia context:

##### text

Type: String

The text to display after the spinner

#### color

Type: [Color](https://github.com/HarryPeach/kia/blob/8fb27cbd0bb4ef08ad26124d4a6e4f2ba2dc0c5c/util.ts#L6)

The color for the spinner to be. Uses the color type in util.ts, which maps to the Deno standard colors.

#### spinner

Type: [Spinner](https://github.com/HarryPeach/kia/blob/8fb27cbd0bb4ef08ad26124d4a6e4f2ba2dc0c5c/spinners.ts#L1)

The spinner that the Kia instance should use. There are spinners provided in ```spinners.ts``` or you can provide it with an object like so: 
```typescript
    {
        interval: 80,
        frames: ["-", "|"]
    }
```

On windows the spinner defaults to ```windows```, while on other OSes it defaults to ```dots```.

### Instance
#### .start()
Starts the spinner.

#### .stop()
Stops the spinner and clears the line.

#### .set(options)
Allows you to change the spinners options.
```typescript
const kia = new Kia("Hello");
kia.set({text: "Goodbye", color: "Red"});
```

#### .succeed(text?)
#### .fail(text?)
#### .warn(text?)
#### .info(text?)
Stops the spinner, and returns a message with the current text or the provided ```text``` as well as an icon indicating status. Wraps around ```stopWithFlair()```

#### .stopWithFlair(text, flair)
Stops the spinner, and returns a message with the current text or the provided ```text``` as well as the preceding flair/icon.
