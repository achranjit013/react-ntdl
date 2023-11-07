import React from "react";

export const ServerMessage = ({ response }) => {
  return (
    response?.message && (
      <div
        className={
          response?.status === "success"
            ? "alert alert-success"
            : "alert alert-danger"
        }
      >
        {response?.message}
      </div>
    )
  );
};
