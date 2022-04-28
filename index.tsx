import * as React from "react";

export type MountyProps = {
  children(props: MountyState): JSX.Element;
  in: boolean;
  timeout?: number;
  shouldUnmount?: boolean;
  onEntering?: () => void;
  onEntered?: () => void;
  onExiting?: () => void;
  onExited?: () => void;
};

export type MountyState = {
  active: boolean;
  ready: boolean;
  entering: boolean;
  entered: boolean;
  exiting: boolean;
  exited: boolean;
};

export function Mounty({
  children,
  in: isIn,
  timeout,
  shouldUnmount,
  ...events
}: MountyProps) {
  const [state, setState] = React.useState<MountyState>({
    active: isIn,
    ready: isIn,
    entering: false,
    entered: isIn,
    exiting: false,
    exited: false
  });

  React.useEffect(() => {
    if (isIn && !state.active) {
      setState(prev => ({
        ...prev,
        active: true,
        entered: false,
        exited: false
      }));

      setTimeout(() => {
        setState(prev => ({
          ...prev,
          ready: true,
          entering: true,
        }));

        if (events.onEntering) events.onEntering();

        setTimeout(() => {
          setState(prev => ({
            ...prev,
            entering: false,
            entered: true,
          }));

          if (events.onEntered) events.onEntered();
        }, timeout);
      }, 50);
    } else if (!isIn && state.active) {
      setState(prev => ({
        ...prev,
        exiting: true,
        ready: false,
        entered: false,
      }));

      if (events.onExiting) events.onExiting();

      setTimeout(() => {
        setState(prev => ({
          ...prev,
          active: false,
          exiting: false,
          exited: true,
        }));

        if (events.onExited) events.onExited();
      }, timeout);
    }
  }, [isIn]);

  return !state.active && shouldUnmount ? null : children(state);
}
