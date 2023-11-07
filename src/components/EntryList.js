import React from "react";

export const EntryList = ({
  entryList,
  handleOnCheckedAll,
  handleOnChecked,
  switchTask,
  idsToDelete,
  totalAllocatedHr,
  checkEntry,
}) => {
  return (
    <div className="col-md">
      <h3 className="text-center">Task Entry List</h3>
      <hr />

      {/* <!-- task list / entry list --> */}
      {entryList.length > 0 && (
        <input
          type="checkbox"
          className="form-check-input"
          value="entry"
          onChange={handleOnCheckedAll}
          checked={checkEntry}
        />
      )}
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
                  onClick={() => switchTask({ _id: item._id, type: "bad" })}
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
  );
};
