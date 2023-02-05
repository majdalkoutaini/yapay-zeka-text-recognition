import classes from "./SimpleModal.module.css";

const SimpleModal = ({ children, active, closeModalHandler }) => {
  return (
    <div className={`${classes.modal} ${active ? classes.active : undefined}`}>
      <div className={classes.overlay} onClick={closeModalHandler}></div>
      {children}
    </div>
  );
};

export default SimpleModal;
