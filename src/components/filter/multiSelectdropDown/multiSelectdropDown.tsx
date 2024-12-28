import React from "react";
import { CheckPicker } from "rsuite";
import "./multiSelectdropDown.scss";

interface AppMultiSelectDropDownProps {
  data: any[]; // Update this with the actual shape of your data if possible
  placeholder?: string;
  onChangeHandler?: (value: any, event: React.SyntheticEvent) => void;
  isOpen?: boolean;
  onCloseHandler?: () => void;
  onCleanHandler?: (event: React.SyntheticEvent) => void;
  onOpenHandler?: () => void;
  label?: React.ReactNode;
}

const AppMultiSelectDropDown: React.FC<AppMultiSelectDropDownProps> = ({
  label,
  onChangeHandler,
  data,
  isOpen,
  placeholder,
  onCloseHandler,
  onCleanHandler,
  onOpenHandler,
  ...props
}) => (
  <div className="multiselect-dropdown-wrapper">
    <div className="dropdown-label">
      <span>{label}</span>
    </div>
    <div className={`${isOpen ? "is-dropdown-open" : ""} check-picker-wrap`}>
      <CheckPicker
        block
        placeholder={placeholder}
        onChange={onChangeHandler}
        // onChange={(e) => console.log(e, " eee")}
        size="lg"
        // onOpen={onOpenHandler}
        onClose={onCloseHandler}
        // onClean={onCleanHandler}
        data={data}
        // searchable={false}
        style={{ width: 224, height: "auto" }} // Fixed dimensions
        {...props}
      />
    </div>
  </div>
);

export default AppMultiSelectDropDown;
