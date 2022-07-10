# Kia

> Simple terminal spinners for Deno 🦕

`Version 0.4.1`

![](https://github.com/HarryPeach/kia/workflows/CI/badge.svg)

![weather.ts example](https://user-images.githubusercontent.com/4750998/81313185-710ac900-907f-11ea-9735-d623559d08f6.gif)

> Kia is based on, and has much of the features of,
> [ora](https://www.npmjs.com/package/ora). The project was also influenced by
> the work of: [cli-spinners](https://www.npmjs.com/package/cli-spinners), and
> [CLI Spinners for Deno](https://deno.land/x/cli_spinners/)

## Usage

```typescript
import Kia from 'https://deno.land/x/kia@0.4.1/mod.ts';

// Just a function to async sleep
function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const kia: any = new Kia('I will be back in about 3 seconds');
kia.start();
await sleep(3000); // or any other async action that'll take some time
kia.succeed('Action completed');
```

More thorough examples are available in the [examples folder](Examples)

## API

### kia()

### kia(text)

### kia(options)

Kia can be created with a string or the Options interface. A string is simply
mapped to `Options.text`

```typescript
const kia = new Kia('Hello');
// or
const kia = new Kia({
	text: 'Hello',
	color: 'Red',
});
```

#### options

You can pass any of the following options to the kia context:

##### text

Type: String

Default: ""

The text to display after the spinner

##### color

Type: [Color](Source/util.ts)

Default: "white"

The color for the spinner to be. Uses the color type in util.ts, which maps to
the Deno standard colors.

##### spinner

Type: [Spinner](Source/spinners.ts)

Default: Dependent on OS (See below)

The spinner that the Kia instance should use. There are spinners provided in
`spinners.ts` or you can provide it with an object like so:

```typescript
{
    interval: 80,
    frames: ["-", "|"]
}
```

On windows the spinner defaults to `windows`, while on other OSes it defaults to
`dots`.

Spinners can also be imported from anywhere as long as they follow this format.
See the `examples/externalSpinners.ts` example for more info.

##### indent

Type: number

Default: 0

The level of indentation of the spinner in spaces

##### cursor

Type: boolean

Default: false

Whether or not to display a cursor when the spinner is active

##### writer

Type: Deno.Writer

Default: Deno.stdout

The resource to output to. This can be anything that uses the Writer interface
including stdout, stderr, and files.

### Instance

#### .start(text?)

Starts the spinner. Optionally sets the text at the same time. Returns Kia
instance.

#### .stop()

Stops the spinner and clears the line. Returns Kia instance.

#### .set(text)

#### .set(options)

Allows you to change the spinners options. Returns Kia instance.

```typescript
const kia = new Kia('Hello');
kia.set({ text: 'Goodbye', color: 'Red' });
```

#### .succeed(text?)

#### .fail(text?)

#### .warn(text?)

#### .info(text?)

Stops the spinner, and returns a message with the current text or the provided
`text` as well as an icon indicating status. Wraps around `stopWithFlair()`.
Returns Kia instance.

#### .stopWithFlair(text, flair)

Stops the spinner, and returns a message with the current text or the provided
`text` as well as the preceding flair/icon. Returns Kia instance.

#### .stopAndPersist(options)

Stops the spinner and holds it in a static state. Returns the instance.

#### .renderNextFrame()

Renders the next frame of the spinner when it is stopped (i.e. can only be run
after .stopAndPersist()).

#### .getText()

Returns the current text of the spinner

#### .getFrame()

Returns the current spinner frame

### forPromise(action, text)

### forPromise(action, options)

```typescript
import { forPromise } from 'https://deno.land/x/kia@0.4.1/mod.ts';

forPromise(
	async () => {
		await yourAsyncAction();
	},
	{ text: name },
);
```

Starts a spinner for a promise. The spinner is stopped with `.succeed()` if the
promise fulfills or with `.fail()` if it rejects. Returns the spinner instance.

#### action

Type: Promise
