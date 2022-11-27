import { SerialPort } from "serialport";

// const serialport = new SerialPort({ path: "/dev/ttyUSB0", baudRate: 115200 });

const getPaths = async () => {
  const pathArray = await SerialPort.list();
  const arr = pathArray.map((element) => {
    if (element.serialNumber !== undefined) {
      return element.path;
    }
  });

  const results = arr.filter((element) => {
    return element !== undefined;
  });
  return results;
};

const setDevice = async (path) => {
  try {
    if (!path) throw new Error("No path provided");
    return new Promise((resolve, reject) => {
      const serialport = new SerialPort({ path: path, baudRate: 115200 });
      resolve(serialport);
    }).catch((err) => {
      console.log(err);
    });
  } catch (error) {
    throw new Error(error);
  }
};

export { getPaths, setDevice };
