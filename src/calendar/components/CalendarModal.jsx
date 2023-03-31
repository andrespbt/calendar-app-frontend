import { useEffect, useMemo, useState } from 'react';
import { addHours, differenceInSeconds } from 'date-fns';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useUiStore } from '../../hooks/useUiStore';
import { useCalendarStore } from '../../hooks';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

export const CalendarModal = () => {
  const { isDateModalOpen, closeDateModal } = useUiStore();
  const { activeEvent, startSavingEvent } = useCalendarStore();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({
    title: '',
    note: '',
    start: new Date(),
    end: addHours(new Date(), 2),
  });

  const titleClass = useMemo(() => {
    if (!formSubmitted) return '';

    return formValues.title.length > 0 ? '' : 'is-invalid';
  }, [formValues.title, formSubmitted]);

  useEffect(() => {
    if (activeEvent !== null) setFormValues({ ...activeEvent });
  }, [activeEvent]);

  const onDateChange = (e, changing) => {
    setFormValues({
      ...formValues,
      [changing]: e,
    });
  };

  const onInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  const onCloseModal = () => {
    closeDateModal();
  };

  const onSubmit = async e => {
    e.preventDefault();
    setFormSubmitted(true);

    const difference = differenceInSeconds(formValues.end, formValues.start);

    if (isNaN(difference) || difference < 0) {
      Swal.fire('Incorrect dates', 'Check dates', 'error');
      return;
    }

    if (formValues.title.length === 0) {
      return;
    }

    await startSavingEvent(formValues);
    closeDateModal();
    setFormSubmitted(false);
  };

  return (
    <Modal
      isOpen={isDateModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={200}
    >
      <h1> New event </h1>
      <hr />
      <form
        className="container"
        onSubmit={onSubmit}
      >
        <div className="form-group mb-2">
          <label>Start date and time</label>
          <DatePicker
            selected={formValues.start}
            onChange={e => onDateChange(e, 'start')}
            className="form-control"
            dateFormat="Pp"
            showTimeSelect="true"
          />
        </div>

        <div className="form-group mb-2">
          <label>End date and time</label>
          <DatePicker
            minDate={formValues.start}
            selected={formValues.end}
            onChange={e => onDateChange(e, 'end')}
            className="form-control"
            dateFormat="Pp"
            showTimeSelect="true"
          />
        </div>

        <hr />
        <div className="form-group mb-2">
          <label>Title and note</label>
          <input
            type="text"
            className={`form-control ${titleClass}`}
            placeholder="Event title"
            name="title"
            autoComplete="off"
            value={formValues.title}
            onChange={onInputChange}
          />
          <small
            id="emailHelp"
            className="form-text text-muted"
          >
            A short description
          </small>
        </div>

        <div className="form-group mb-2">
          <textarea
            type="text"
            className="form-control"
            placeholder="Note"
            rows="5"
            name="note"
            value={formValues.note}
            onChange={onInputChange}
          ></textarea>
          <small
            id="emailHelp"
            className="form-text text-muted"
          >
            Additional information
          </small>
        </div>

        <button
          type="submit"
          className="btn btn-outline-primary btn-block"
        >
          <i className="far fa-save"></i>
          <span> Save</span>
        </button>
      </form>
    </Modal>
  );
};
