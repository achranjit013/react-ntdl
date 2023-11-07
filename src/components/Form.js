import React, { useState } from "react";
import { postData } from "../helper/axiosHelper";

export const Form = ({
  getTask,
  setResponse,
  totalAllocatedHr,
  setCheckEntry,
}) => {
  const initialState = {
    task: "",
    hr: "",
  };

  const [form, setForm] = useState(initialState);

  const totalWeeklyHr = 24 * 7;

  const handleOnChange = (e) => {
    setResponse({});

    // name - attribute of the form
    // value - value of the input field
    // both name & value are the properties of 'target'
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (totalAllocatedHr + +form.hr > totalWeeklyHr) {
      return alert(
        totalWeeklyHr - totalAllocatedHr === 0
          ? `Sorry, you are not allowed to add any  more task. You have already assigned to maximum weekly hours.`
          : `You are not allowed to add any task that takes more than ${
              totalWeeklyHr - totalAllocatedHr
            } hour.`
      );
    }

    const data = await postData(form);
    setResponse(data);
    setForm(initialState);
    getTask();
    setCheckEntry(false);
  };

  return (
    <form
      onSubmit={handleOnSubmit}
      className="row g-3 shadow-lg rounded bg-secondary"
    >
      <div className="col-md-7">
        <label htmlFor="taskName" className="visually-hidden">
          Task Name
        </label>
        <input
          type="text"
          className="form-control"
          id="taskName"
          name="task"
          value={form.task}
          placeholder="Task name"
          required
          onChange={handleOnChange}
        />
      </div>
      <div className="col-md-2">
        <label htmlFor="taskHr" className="visually-hidden">
          Task Hour
        </label>
        <input
          type="number"
          min="1"
          className="form-control"
          id="taskHr"
          name="hr"
          value={form.hr}
          placeholder="Hour"
          required
          onChange={handleOnChange}
        />
      </div>
      <div className="col-md-3">
        <div className="d-grid">
          <button type="submit" className="btn btn-primary mb-3">
            <i className="fa-solid fa-plus"></i> Add New task
          </button>
        </div>
      </div>
    </form>
  );
};
