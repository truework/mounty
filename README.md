# mounty ![npm](https://img.shields.io/npm/v/mounty) [![](https://badgen.net/bundlephobia/minzip/mounty)](https://bundlephobia.com/result?p=mounty)

A tiny React transition manager with mount/unmount support and a familiar API.

### Install

```
npm i mounty --save
```

# Usage

The code below is [demoed here](https://codesandbox.io/s/mounty-demo-4zgwp).

```javascript
import { Mounty } from "mounty";

function App() {
  const [active, setActive] = React.useState(false);

  return (
    <>
      <button onClick={() => setActive(!active)}>Click to Pin</button>

      <Mounty in={active} timeout={400} shouldUnmount={true}>
        {({ active, ready, entering, entered, exiting, exited }) => {
          return (
            <div
              style={{
                opacity: ready ? 1 : 0,
                transition: "opacity 400ms",
              }}
            >
              I'm automatically mounted & unmounted, and I fade in and out while
              doing it!
            </div>
          );
        }}
      </Mounty>
    </>
  );
}

render(<App />, document.getElementById("root"));
```

### License

MIT License © [Truework](https://www.truework.com)
