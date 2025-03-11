"use client";
import Navbar from "../components/navbar";

export default function Inbox() {
  return (
    <main className="min-h-screen flex flex-col itemscenter">
      <Navbar currentPage="inbox" />
      <div className="flex md:flex-row flex-grow w-full max-w-5xl mx-auto px-4 gap-4 overflow-hidden py-8">
        <div className="w-full max-w-80 flex flex-col gap-4">
          <div className="flex flex-col gap-6 p-4 border rounded-lg flex-grow overflow-auto">
            {/* replace users with the actual code which maps all the users which have applied to the job of the associated person by pulling from the database*/}
            {/* User 1 */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg"></div>
              <div>
                <h3 className="font-medium text-base">User</h3>
                <p className="text-sm text-gray-600">
                  Applied for (position) ...
                </p>
              </div>
            </div>
            {/* User 1 */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg"></div>
              <div>
                <h3 className="font-medium text-base">User</h3>
                <p className="text-sm text-gray-600">
                  Applied for (position) ...
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-grow flex items-start justify-center w-full">
          <div className="flex p-4 border rounded-lg w-full h-full overflow-auto">
            here goes the messages between you and the person
          </div>
        </div>
      </div>
    </main>
  );
}
