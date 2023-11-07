import React from "react";

export const BadList = ({
  badList,
  handleOnCheckedAll,
  handleOnChecked,
  switchTask,
  idsToDelete,
  checkBad,
}) => {
  return (
    <div className="col-md">
      <h3 className="text-center">Bad List</h3>
      <hr />
      {/* <!-- bad list --> */}
      {badList.length > 0 && (
        <input
          type="checkbox"
          className="form-check-input"
          value="bad"
          onChange={handleOnCheckedAll}
          checked={checkBad}
        />
      )}

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
                  onClick={() => switchTask({ _id: item._id, type: "entry" })}
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
  );
};
