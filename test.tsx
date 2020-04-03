import * as React from "react";
import { configure, mount } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

import { Mounty, MountyProps, MountyState } from "./index";

configure({ adapter: new Adapter() });

const wait = async (ms: number) => new Promise(r => setTimeout(r, ms));

function Base(props: Omit<MountyProps, "children">) {
  return (
    <Mounty {...props}>
      {(state: MountyState) => <div>{JSON.stringify(state)}</div>}
    </Mounty>
  );
}

test("default", async done => {
  const tree = mount(<Base in={false} />);

  expect(tree.text()).toEqual(
    JSON.stringify({
      active: false,
      ready: false,
      entering: false,
      entered: false,
      exiting: false,
      exited: false
    })
  );

  tree.setProps({ in: true });

  await wait(50);
  tree.update();

  expect(tree.text()).toEqual(
    JSON.stringify({
      active: true,
      ready: true,
      entering: false,
      entered: true,
      exiting: false,
      exited: false
    })
  );

  done();
});

test("unmounts", async done => {
  const tree = mount(<Base in={false} shouldUnmount={true} />);

  expect(tree.text()).toEqual("");

  tree.setProps({ in: true, shouldUnmount: true });

  await wait(50);
  tree.update();

  expect(tree.text()).toEqual(
    JSON.stringify({
      active: true,
      ready: true,
      entering: false,
      entered: true,
      exiting: false,
      exited: false
    })
  );

  tree.setProps({ in: false, shouldUnmount: true });

  await wait(50);
  tree.update();

  expect(tree.text()).toEqual("");

  done();
});

test("timeout", async done => {
  const tree = mount(<Base in={false} timeout={250} />);

  tree.setProps({ in: true });

  await wait(50);
  tree.update();

  expect(tree.text()).toEqual(
    JSON.stringify({
      active: true,
      ready: true,
      entering: true,
      entered: false,
      exiting: false,
      exited: false
    })
  );

  await wait(500);
  tree.update();

  expect(tree.text()).toEqual(
    JSON.stringify({
      active: true,
      ready: true,
      entering: false,
      entered: true,
      exiting: false,
      exited: false
    })
  );

  tree.setProps({ in: false });

  await wait(500);
  tree.update();

  expect(tree.text()).toEqual(
    JSON.stringify({
      active: false,
      ready: false,
      entering: false,
      entered: false,
      exiting: false,
      exited: true
    })
  );

  done();
});

test("hooks", async done => {
  const onEntering = jest.fn();
  const onEntered = jest.fn();
  const onExiting = jest.fn();
  const onExited = jest.fn();

  const tree = mount(
    <Base
      in={false}
      timeout={75}
      onEntering={onEntering}
      onEntered={onEntered}
      onExiting={onExiting}
      onExited={onExited}
    />
  );

  tree.setProps({ in: true });

  await wait(50);
  tree.update();

  expect(onEntering).toHaveBeenCalled();

  await wait(50);
  tree.update();

  expect(onEntered).toHaveBeenCalled();

  tree.setProps({ in: false });

  await wait(50);
  tree.update();

  expect(onExiting).toHaveBeenCalled();

  await wait(50);
  tree.update();

  expect(onExited).toHaveBeenCalled();

  done();
});
