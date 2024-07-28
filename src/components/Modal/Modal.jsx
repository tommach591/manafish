import "./Modal.css";

function Modal({ children, isOpen, onClose, title }) {
  if (!isOpen) return null;

  return (
    <div className="ModalOverlay">
      <div
        className="ModalContent"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="ModalHeader">
          <h2>{title}</h2>
        </div>
        <div className="ModalBody">{children}</div>
        <div className="ModalFooter">
          <button className="ModalCloseButton" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
