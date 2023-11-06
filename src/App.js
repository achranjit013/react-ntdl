import { useEffect, useState } from "react";
import "./App.css";
import {
  deleteData,
  getData,
  postData,
  updateData,
} from "./helper/axiosHelper";

function App() {
  const initialState = {
    task: "",
    hr: "",
  };

  const [form, setForm] = useState(initialState);
  const [taskList, setTaskList] = useState([]);
  const [response, setResponse] = useState({});
  const [idsToDelete, setIdsToDelete] = useState([]);
  const [displayDelete, setDisplayDelete] = useState(false);

  const totalWeeklyHr = 24 * 7;
  const totalAllocatedHr = taskList.reduce((acc, item) => acc + +item.hr, 0);

  useEffect(() => {
    getTask();
  }, []);

  const getTask = async () => {
    const data = await getData();
    data.status === "success" && setTaskList(data.taskList);
  };

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

    // const obj = {
    //   ...form,
    //   type: "entry",
    //   id: randomStr(),
    // };

    // setTaskList([...taskList, obj]);
    // insted of doing setTaskList first, we now need to send data to db
    const data = await postData(form);
    setResponse(data);
    setForm(initialState);
    getTask();
  };

  const handleOnDelete = async (ids) => {
    if (window.confirm("Are you sure to delete?")) {
      // calling api to delete data
      const response = await deleteData({ ids: ids });
      setResponse(response);
      // filter by id
      // const filteredArr = taskList.filter((item) => item.id !== id);
      // setTaskList(filteredArr);

      // fetching api to display data
      response?.status === "success" && getTask() && setIdsToDelete([]);
    }
  };

  // collect ids of selected tasks
  const handleOnChecked = (e) => {
    const { checked, value } = e.target;

    // takeout from idsToDelete
    const tempArr = idsToDelete.filter((item) => item !== value);

    if (checked) {
      // push in
      tempArr.push(value);
    }

    if (tempArr.length > 0) {
      setDisplayDelete(true);
    } else {
      setDisplayDelete(false);
    }

    setIdsToDelete(tempArr);
  };

  const switchTask = async (obj) => {
    // send update to server
    const response = await updateData(obj);
    setResponse(response);

    // if success, fetch all data
    response?.status === "success" && getTask();

    // const badItem = taskList.map((item) => {
    //   if (item.id === id) {
    //     return {
    //       ...item,
    //       type,
    //     };
    //   }

    //   return item;
    // });

    // setTaskList(badItem);
  };

  // const randomStr = () => {
  //   const charLength = 6;
  //   const str = "qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM";
  //   let id = "";

  //   for (let i = 0; i < charLength; i++) {
  //     const randNum = Math.round(Math.random() * (str.length - 1));
  //     id += str[randNum];
  //   }

  //   return id;
  // };

  const entryList = taskList.filter((item) => item.type === "entry");
  const badList = taskList.filter((item) => item.type === "bad");

  const handleOnCheckedAll = (e) => {
    const { checked, value } = e.target;

    if (checked) {
      // push in to entry / bad list

      if (value === "entry") {
        const entryIds = entryList.map((item) => item._id);
        setIdsToDelete([...idsToDelete, ...entryIds]);
      } else if (value === "bad") {
        const badIds = badList.map((item) => item._id);
        setIdsToDelete([...idsToDelete, ...badIds]);
      }
      setDisplayDelete(true);
    } else {
      // pop out from entry / bad list
      if (value === "entry") {
        const entryIds = entryList.map((item) => item._id);
        const newIdsToDelete = idsToDelete.filter(
          (item) => !entryIds.includes(item)
        );
        setIdsToDelete(newIdsToDelete);
      } else if (value === "bad") {
        const badIds = badList.map((item) => item._id);
        const newIdsToDelete = idsToDelete.filter(
          (item) => !badIds.includes(item)
        );
        setIdsToDelete(newIdsToDelete);
      }
      setDisplayDelete(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="container">
        {/* <!-- heading --> */}
        <div className="row">
          <div className="col">
            <h1 className="text-center p-5">Not To Do List</h1>
          </div>
        </div>

        {/* show the server message */}
        {response?.message && (
          <div
            className={
              response?.status === "success"
                ? "alert alert-success"
                : "alert alert-danger"
            }
          >
            {response?.message}
          </div>
        )}

        <br />

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

        {/* <!-- table area --> */}
        <div className="row mt-5 pt-2">
          {/* <!-- entry list --> */}
          <div className="col-md">
            <h3 className="text-center">Task Entry List</h3>
            <hr />

            {/* <!-- task list / entry list --> */}
            <input
              type="checkbox"
              className="form-check-input"
              value="entry"
              onChange={handleOnCheckedAll}
            />
            <table className="table table-striped table-hover border">
              <tbody id="entry">
                {entryList.map((item, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        value={item._id}
                        onChange={handleOnChecked}
                        checked={idsToDelete.includes(item._id)}
                      />
                    </td>
                    <td>{item.task}</td>
                    <td>{item.hr}hr</td>
                    <td className="text-end">
                      <button
                        onClick={() =>
                          switchTask({ _id: item._id, type: "bad" })
                        }
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
            <input
              type="checkbox"
              className="form-check-input"
              value="bad"
              onChange={handleOnCheckedAll}
            />
            <table className="table table-striped table-hover border">
              <tbody id="bad">
                {badList.map((item, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        value={item._id}
                        onChange={handleOnChecked}
                        checked={idsToDelete.includes(item._id)}
                      />
                    </td>
                    <td>{item.task}</td>
                    <td>{item.hr}hr</td>
                    <td className="text-end g-2">
                      <button
                        onClick={() =>
                          switchTask({ _id: item._id, type: "entry" })
                        }
                        className="btn btn-warning m-1"
                      >
                        <i className="fa-solid fa-arrow-left"></i>
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

          {displayDelete && (
            <button
              onClick={() => handleOnDelete(idsToDelete)}
              className="btn btn-danger m-1"
            >
              <i className="fa-solid fa-trash"></i> You are about to delete{" "}
              {idsToDelete.length} tasks.
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
