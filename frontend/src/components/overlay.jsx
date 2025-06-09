import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import { Download, ThumbsUp } from "lucide-react";

export function Overlay({ isOpen, onClose, link }) {
  console.log(link);
  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="relative z-50 rounded-md"
      >
        <div className="fixed inset-0 flex w-screen items-center rounded-md justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border rounded-lg bg-white p-12">
            <DialogTitle>
              <p className="text-green-600 font-bold text-xl text-center">
                Sales Data uploaded successfully!
              </p>
            </DialogTitle>
            <div className="w-20 h-20 flex items-center justify-center border-green-600 border-2 rounded-full border-dashed border mx-auto  my-6 ">
              <span>
                <ThumbsUp size={50} className="text-green-600 font-bold " />
              </span>
            </div>
            <div className="flex gap-4 justify-between">
              <button
                onClick={onClose}
                className="text-white bg-red-500 p-2 font-bold rounded-sm"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="text-white bg-blue-500 flex gap-2 justify-center p-2 font-bold rounded-sm"
              >
                <Download size={25} className="text-white" />
                Download CSV
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
