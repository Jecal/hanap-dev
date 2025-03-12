"use client";
import Navbar from "../components/navbar";
import { supabase } from "@/utils/supabase";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

interface Connection {
  chatId: string;
  connectionId: string;
}

const UserDisplay = () => {
  const { user } = useUser();
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    if (!user) {
      setConnections([]);
      return;
    }

    const fetchConnections = async () => {
      try {
        const { data, error } = await supabase
          .from("chats")
          .select("*")
          .or(`applicant_id.eq.${user.id},poster_id.eq.${user.id}`);

        if (error) throw error;

        const userConnections = data.map((chat) => {
          const otherUser =
            chat.applicant_id === user.id ? chat.poster_id : chat.applicant_id;

          return {
            chatId: chat.id,
            connectionId: otherUser,
          };
        });

        setConnections(userConnections);
      } catch (err) {
        console.error("Error finding connections:", err);
        alert("failed to fetch connections");
      }
    };
    fetchConnections();
  }, [user]);

  return { connections };
};

export default function Inbox() {
  const { connections } = UserDisplay();
  const { user } = useUser();

  return (
    <main className="min-h-screen flex flex-col itemscenter">
      <Navbar currentPage="inbox" />
      <div className="flex md:flex-row flex-grow w-full max-w-5xl mx-auto px-4 gap-4 overflow-hidden py-8">
        <div className="w-full max-w-80 flex flex-col gap-4">
          <div className="flex flex-col gap-6 p-4 border rounded-lg flex-grow overflow-auto">
            {/* map connections */}
            {connections.map((connection) => (
              <div key={connection.chatId} className="flex items-start gap-3">
                <div className="w-12 h-12 bg-indigo-600 rounded-lg"></div>
                <div>
                  <h3 className="font-medium text-base">get job data</h3>
                  <p className="text-sm text-gray-600">{user!.id}</p>
                  <p className="text-sm text-gray-600">
                    {connection.connectionId}
                  </p>
                </div>
              </div>
            ))}
            {/* replace users with the actual code which maps all the users which have applied to the job of the associated person by pulling from the database*/}
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
