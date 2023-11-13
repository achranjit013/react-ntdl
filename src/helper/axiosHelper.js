import axios from "axios";

const apiEp =
  process.env.NODE_ENV === "production"
    ? "/api/v1/task"
    : "http://localhost:8000/api/v1/task";

// create
export const postData = async (obj) => {
  try {
    const { data } = await axios.post(apiEp, obj);
    return data;
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
};

// read
export const getData = async () => {
  try {
    const { data } = await axios.get(apiEp);
    return data;
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
};

// update
export const updateData = async (obj) => {
  try {
    const { data } = await axios.patch(apiEp, obj);
    return data;
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
};

// delete
export const deleteData = async (_id) => {
  try {
    const { data } = await axios.delete(apiEp, { data: _id });
    return data;
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
};
