import * as React from "react";

type Props = {
  children: (props: State) => React.ReactElement;
  in: boolean;
  timeout: number;
  onEntering: () => void;
  onEntered: () => void;
  onExiting: () => void;
  onExited: () => void;
};

type State = {
  mounted: boolean;
  active: boolean;
  entering: boolean;
  entered: boolean;
  exiting: boolean;
  exited: boolean;
};

export default class Mounty extends React.Component<Props, State> {
  defaultProps = {
    active: false,
    timeout: 500
  };

  state = {
    mounted: this.props.in,
    active: false,
    entering: false,
    entered: false,
    exiting: false,
    exited: false
  };

  componentDidMount() {
    if (this.state.mounted) this.enter();
  }

  componentDidUpdate() {
    const { mounted, active, entering, exiting } = this.state;
    const { in: isIn } = this.props;

    if (entering || exiting) return;

    if (!isIn && active && mounted) {
      this.exit();
    } else if (isIn && !active && !mounted) {
      this.enter();
    }
  }

  enter() {
    const { timeout, onEntering, onEntered } = this.props;

    this.setState(
      {
        mounted: true,
        entered: false
      },
      () => {
        setTimeout(() => {
          this.setState(
            {
              active: true,
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
        active: false,
        exiting: true,
        exited: false
      },
      () => {
        onExiting && onExiting();

        setTimeout(() => {
          this.setState(
            {
              mounted: false,
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
    const { mounted } = this.state;
    return mounted && this.props.children(this.state);
  }
}
