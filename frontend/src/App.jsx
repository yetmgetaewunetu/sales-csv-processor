import { CSVUploadForm } from "./components/CSVUploadForm";

const App = () => {
  return (
    <div className=" container flex flex-col items-center gap-7 pt-5 w-screen">
      <h1 className="text-2xl font-bold ">Mereb Challange: csv uploader</h1>
      <div className="w-3/4 bg-white md:w-2xl  shadow-sm shadow-black h-1/2 min-h-1/4 p-4 rounded-lg flex flex-col gap-5">
        <span>Choose your csv file</span>
        <CSVUploadForm />
      </div>
    </div>
  );
};

export default App;
