const ConfirmLeavePopup = ({ toggleLeaveConfirm }: any) => {
  return (
    <div className="confirm-leave-popup">
      <div className="confirm-leave">
        <p>Are you sure!</p>
        <div className="row">
          <button onClick={() => toggleLeaveConfirm(true)}>Yes</button>
          <button onClick={() => toggleLeaveConfirm(false)}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLeavePopup;
