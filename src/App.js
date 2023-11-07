import { useEffect, useState } from "react";
import "./App.css";
import { deleteData, getData, updateData } from "./helper/axiosHelper";
import { Form } from "./components/Form";
import { NTDLHeader } from "./components/NTDLHeader";
import { ServerMessage } from "./components/ServerMessage";
import { EntryList } from "./components/EntryList";
import { BadList } from "./components/BadList";

function App() {
  const [taskList, setTaskList] = useState([]);
  const [idsToDelete, setIdsToDelete] = useState([]);
  const [displayDelete, setDisplayDelete] = useState(false);
  const [response, setResponse] = useState({});
  const [checkEntry, setCheckEntry] = useState(false);
  const [checkBad, setCheckBad] = useState(false);

  useEffect(() => {
    getTask();
  }, []);

  const getTask = async () => {
    const data = await getData();
    data.status === "success" && setTaskList(data.taskList);
  };

  const totalAllocatedHr = taskList.reduce((acc, item) => acc + +item.hr, 0);

  const handleOnDelete = async (ids) => {
    if (window.confirm(`Are you sure to delete ${ids.length} tasks ?`)) {
      // calling api to delete data
      const response = await deleteData({ ids: ids });
      setResponse(response);

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

    const matchingEntryList = entryList.filter((item) =>
      tempArr.includes(item._id)
    );
    const matchingBadList = badList.filter((item) =>
      tempArr.includes(item._id)
    );

    if (matchingEntryList.length === entryList.length) {
      setCheckEntry(true);
    } else {
      setCheckEntry(false);
    }

    if (matchingBadList.length === badList.length) {
      setCheckBad(true);
    } else {
      setCheckBad(false);
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

    var newTaskList = taskList.map((el) =>
      el._id == obj._id ? { ...el, type: obj.type } : el
    );

    const newEntryList = newTaskList.filter((item) => item.type === "entry");
    const newBadList = newTaskList.filter((item) => item.type === "bad");

    const matchingEntryList = newEntryList.filter((item) =>
      idsToDelete.includes(item._id)
    );
    const matchingBadList = newBadList.filter((item) =>
      idsToDelete.includes(item._id)
    );

    if (matchingEntryList.length === newEntryList.length) {
      setCheckEntry(true);
    } else {
      setCheckEntry(false);
    }

    if (matchingBadList.length === newBadList.length) {
      setCheckBad(true);
    } else {
      setCheckBad(false);
    }
  };

  const entryList = taskList.filter((item) => item.type === "entry");
  const badList = taskList.filter((item) => item.type === "bad");

  const handleOnCheckedAll = (e) => {
    const { checked, value } = e.target;

    if (checked) {
      if (value === "entry") {
        // push in to entry list
        const entryIds = entryList.map((item) => item._id);
        setIdsToDelete([...idsToDelete, ...entryIds]);
        setCheckEntry(true);
      } else if (value === "bad") {
        // push in to bad list
        const badIds = badList.map((item) => item._id);
        setIdsToDelete([...idsToDelete, ...badIds]);
        setCheckBad(true);
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
        setCheckEntry(false);
      } else if (value === "bad") {
        const badIds = badList.map((item) => item._id);
        const newIdsToDelete = idsToDelete.filter(
          (item) => !badIds.includes(item)
        );
        setIdsToDelete(newIdsToDelete);
        setCheckBad(false);
      }
      setDisplayDelete(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="container">
        {/* <!-- heading --> */}
        <NTDLHeader />

        {/* show the server message */}
        <ServerMessage response={response} />

        <br />

        {/* <!-- form area --> */}
        <Form
          getTask={getTask}
          setResponse={setResponse}
          totalAllocatedHr={totalAllocatedHr}
          setCheckEntry={setCheckEntry}
        />

        {/* <!-- table area --> */}
        <div className="row mt-5 pt-2">
          {/* <!-- entry list --> */}
          <EntryList
            entryList={entryList}
            handleOnCheckedAll={handleOnCheckedAll}
            handleOnChecked={handleOnChecked}
            switchTask={switchTask}
            idsToDelete={idsToDelete}
            totalAllocatedHr={totalAllocatedHr}
            checkEntry={checkEntry}
          />

          {/* <!-- bad list --> */}
          <BadList
            badList={badList}
            handleOnCheckedAll={handleOnCheckedAll}
            handleOnChecked={handleOnChecked}
            switchTask={switchTask}
            idsToDelete={idsToDelete}
            checkBad={checkBad}
          />

          {/* display the delete btn when checked  */}
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
