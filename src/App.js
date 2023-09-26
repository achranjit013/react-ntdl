import { useState } from "react";
import "./App.css";

function App() {
  const [form, setForm] = useState({});
  const [taskList, setTaskList] = useState([]);
  const totalWeeklyHr = 24 * 7;
  const totalAllocatedHr = taskList.reduce((acc, item) => acc + +item.hr, 0);

  const handleOnChange = (e) => {
    // name - attribute of the form
    // value - value of the input field
    // both name & value are the properties of 'target'
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleOnSubmit = (e) => {
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

    const obj = {
      ...form,
      type: "entry",
      id: randomStr(),
    };

    setTaskList([...taskList, obj]);
  };

  const handleOnDelete = (id) => {
    if (window.confirm("Are you sure to delete?")) {
      // filter by id
      const filteredArr = taskList.filter((item) => item.id !== id);
      setTaskList(filteredArr);
    }
  };

  const switchTask = (id, type) => {
    const badItem = taskList.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          type,
        };
      }

      return item;
    });

    setTaskList(badItem);
  };

  const randomStr = () => {
    const charLength = 6;
    const str = "qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM";
    let id = "";

    for (let i = 0; i < charLength; i++) {
      const randNum = Math.round(Math.random() * (str.length - 1));
      id += str[randNum];
    }

    return id;
  };

  const entryList = taskList.filter((item) => item.type === "entry");
  const badList = taskList.filter((item) => item.type === "bad");

  return (
    <div className="wrapper">
      <div className="container">
        {/* <!-- heading --> */}
        <div className="row">
          <div className="col">
            <h1 className="text-center p-5">Not To Do List</h1>
          </div>
        </div>

        {/* <!-- form area --> */}
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

        {/* <!-- table area --> */}
        <div className="row mt-5 pt-2">
          {/* <!-- entry list --> */}
          <div className="col-md">
            <h3 className="text-center">Task Entry List</h3>
            <hr />

            {/* <!-- task list / entry list --> */}
            <table className="table table-striped table-hover border">
              <tbody id="entry">
                {entryList.map((item, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.task}</td>
                    <td>{item.hr}hr</td>
                    <td className="text-end">
                      <button
                        onClick={() => handleOnDelete(item.id)}
                        className="btn btn-danger m-1"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                      <button
                        onClick={() => switchTask(item.id, "bad")}
                        className="btn btn-success"
                      >
                        <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* <!-- total time allocated --> */}
            <div className="alert alert-info">
              Total hrs per week allocated ={" "}
              <span id="allHr">{totalAllocatedHr}</span> hr
            </div>
          </div>

          {/* <!-- bad list --> */}
          <div className="col-md">
            <h3 className="text-center">Bad List</h3>
            <hr />
            {/* <!--  --> */}
            <table className="table table-striped table-hover border">
              <tbody id="bad">
                {badList.map((item, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.task}</td>
                    <td>{item.hr}hr</td>
                    <td className="text-end g-2">
                      <button
                        onClick={() => switchTask(item.id, "entry")}
                        className="btn btn-warning m-1"
                      >
                        <i className="fa-solid fa-arrow-left"></i>
                      </button>
                      <button
                        onClick={() => handleOnDelete(item.id)}
                        className="btn btn-danger"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* <!-- bad time --> */}
            <div className="alert alert-info">
              You could have saved ={" "}
              <span id="badHr">
                {badList.reduce((acc, item) => acc + +item.hr, 0)}
              </span>{" "}
              hr
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
