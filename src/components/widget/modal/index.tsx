import React from "react";
import { AiFillCloseCircle } from "react-icons/ai";

import "./Modal.scss";

const Modal: React.FC<any> = ({ setOpen, children }) => {
  return (
    <div className="darkBG">
      <div className="modal centered">
        <div className="modal-top">
          <AiFillCloseCircle
            className="modal-close"
            onClick={() => setOpen(false)}
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
