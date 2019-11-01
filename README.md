# mounty
A tiny React mount/unmount transition manager with a familiar API. **~500bytes
gzipped.**

### Install
```
npm i mounty --save
```

# Usage
```javascript
import Mounty from 'mounty';

render(() => {
  const [ active, setActive ] = React.useState(false);

  return (
    <>
      <button ref={target} onClick={() => setActive(!active)}>
        Click to Pin
      </button>

      <Mounty in={active} timeout={400}>
        {({ mounted, active, entering, entered, exiting, exited }) => {
          <div styled={{
            opacity: active ? 1 : 0,
            transition: 'opacity 400ms',
          }}>
            I'm automatically mounted & unmounted, and I fade in and out while
            doing it!
          </div>
        }}
      </Mounty>
    </>
  );
}, document.getElementById('root'))
```

### License
MIT License © [Eric Bailey](https://estrattonbailey.com)
