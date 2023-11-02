import React, { useState } from "react";
import { AiOutlineRedo, AiOutlineCamera } from "react-icons/ai";
import Modal from "../widget/modal";
import html2canvas from "html2canvas";

import { Face } from "../../types";
import { hideAllBombs } from "../../utils/index";
import "./Footer.scss";

const Footer: React.FC<any> = ({ face, setFace, cells, setCells, setLive }) => {
  const [open, setOpen] = useState(false); // to open modal
  const [image, setImage] = useState(""); // image url

  // converting minecraft game container to image url using canavs
  const captureScreenShot = () => {
    const element: HTMLElement = document.querySelector(".App") as HTMLElement;
    html2canvas(element).then((canvas: HTMLCanvasElement) => {
      const url = canvas.toDataURL();
      setImage(url);
    });
    setOpen(true);
  };

  // modal content
  const ModalContent: React.FC = () => {
    return (
      <>
        <div className="header">
          <h4>Your Image is Ready!!!</h4>
        </div>
        <div className="image-container">
          <img src={image} alt="screenshot" className="screenshot-image" />
        </div>
      </>
    );
  };

  return (
    <>
      <div>
        <AiOutlineRedo
          className={face !== Face.lostface ? "disable-redo" : "Redo"}
          onClick={() => {
            // when clicked hide all bombs
            if (face === Face.lostface) {
              const newCells = hideAllBombs(cells);
              setCells(newCells);
              setFace(Face.smile);
              setLive(true);
            }
          }}
        />
        <AiOutlineCamera
          className="Screenshot"
          onClick={() => captureScreenShot()}
        />
      </div>
      {open && (
        <Modal setOpen={setOpen}>
          <ModalContent />
        </Modal>
      )}
    </>
  );
};

export default Footer;
