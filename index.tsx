import * as React from "react";

export type MountyProps = {
  children: (props: MountyState) => React.ReactNode | React.ReactNode[];
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

export class Mounty extends React.Component<MountyProps, MountyState> {
  static defaultProps = {
    ready: false,
    timeout: 0,
    shouldUnmount: false,
  };

  state = {
    active: this.props.in,
    ready: false,
    entering: false,
    entered: false,
    exiting: false,
    exited: false
  };

  componentDidMount() {
    if (this.state.active) this.enter();
  }

  componentDidUpdate() {
    const { active, ready, entering, exiting } = this.state;
    const { in: isIn } = this.props;

    if (entering || exiting) return;

    if (!isIn && ready && active) {
      this.exit();
    } else if (isIn && !ready && !active) {
      this.enter();
    }
  }

  enter() {
    const { timeout, onEntering, onEntered } = this.props;

    this.setState(
      {
        active: true,
        entered: false,
        exited: false,
      },
      () => {
        setTimeout(() => {
          this.setState(
            {
              ready: true,
              entering: true
            },
            () => {
              onEntering && onEntering();

              setTimeout(() => {
                this.setState(
                  {
                    entering: false,
                    entered: true
                  },
                  () => {
                    onEntered && onEntered();
                  }
                );
              }, timeout);
            }
          );
        }, 10);
      }
    );
  }

  exit() {
    const { timeout, onExiting, onExited } = this.props;

    this.setState(
      {
        ready: false,
        exiting: true,
        exited: false,
        entered: false,
      },
      () => {
        onExiting && onExiting();

        setTimeout(() => {
          this.setState(
            {
              active: false,
              exiting: false,
              exited: true
            },
            () => {
              onExited && onExited();
            }
          );
        }, timeout);
      }
    );
  }

  render() {
    const { active } = this.state;
    const { shouldUnmount } = this.props;
    return !active && shouldUnmount ? null : this.props.children(this.state);
  }
}
