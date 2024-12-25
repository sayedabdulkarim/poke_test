import React, { forwardRef } from "react";
import { Whisper, Popover, WhisperInstance } from "rsuite";

interface DefaultPopoverProps {
  content: React.ReactNode;
  className?: string;
}

// eslint-disable-next-line react/display-name
const DefaultPopover = forwardRef<WhisperInstance, DefaultPopoverProps>(
  ({ content, className, ...props }, ref) => {
    return (
      <Popover {...props} className={className} arrow={false}>
        <p>{content}</p>
      </Popover>
    );
  }
);

interface AppTooltipProps {
  placement?: "top" | "bottom" | "left" | "right"; // Define placements as union types
  data: React.ReactNode;
  className?: string;
  name: string;
  tooltipClass?: string;
}

const AppTooltip: React.FC<AppTooltipProps> = ({
  placement = "top", // Default placement
  data,
  className,
  name,
  tooltipClass,
}) => (
  <Whisper
    trigger="click"
    placement={placement}
    controlId={`control-id-${placement}`}
    speaker={<DefaultPopover content={data} className={tooltipClass} />}
  >
    <div className={className}>{name}</div>
  </Whisper>
);

export default AppTooltip;
