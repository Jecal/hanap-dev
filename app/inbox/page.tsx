"use client";
import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { supabase } from "@/utils/supabase";
import { useUser } from "@clerk/nextjs";

interface Job {
  id: string;
  title: string;
  author_id: string;
}

interface Connection {
  id: number;
  jobId: number;
  jobTitle: string;
  userId: string;
  userType: "applicant" | "author";
}

const UserDisplay = () => {
  const { user } = useUser();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      setConnections([]);
      setLoading(false);
      return;
    }

    fetchConnections();
  }, [user]);

  const fetchConnections = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // check if user is an applicant for any jobs
      const { data: applicantChats, error: applicantError } = await supabase
        .from("chats")
        .select("id, job_id, applicant_id")
        .eq("applicant_id", user.id);

      if (applicantError) throw applicantError;

      // check if user is an author of any jobs
      const { data: authorJobs, error: authorError } = await supabase
        .from("jobs")
        .select("id, title, author_id")
        .eq("author_id", user.id);

      if (authorError) throw authorError;

      let allConnections: Connection[] = [];

      // process connections where user is an applicant
      if (applicantChats && applicantChats.length > 0) {
        // get job details for all the chats where user is an applicant
        const jobIds = applicantChats.map((chat) => chat.job_id);
        const { data: jobsData, error: jobsError } = await supabase
          .from("jobs")
          .select("id, title, author_id")
          .in("id", jobIds);
        if (jobsError) throw jobsError;
        // create map of job_id to job details for easier lookup
        const jobsMap: Record<string, Job> = {};
        if (jobsData) {
          jobsData.forEach((job) => {
            jobsMap[job.id] = job;
          });
        }
        // create connections for each chat where user is an applicant
        const applicantConnections = applicantChats.map((chat) => ({
          id: chat.id,
          jobId: chat.job_id,
          jobTitle: jobsMap[chat.job_id]?.title || "Unknown Job",
          userId: jobsMap[chat.job_id]?.author_id || "Unknown Author",
          userType: "author" as const,
        }));
        allConnections = [...allConnections, ...applicantConnections];
      }
      // process connections where user is a job author
      if (authorJobs && authorJobs.length > 0) {
        // find all aplpicants for which the user was the author of the job
        for (const job of authorJobs) {
          const { data: jobApplicants, error: applicantsError } = await supabase
            .from("chats")
            .select("id, applicant_id, job_id")
            .eq("job_id", job.id);
          if (applicantsError) throw applicantsError;
          if (jobApplicants && jobApplicants.length > 0) {
            // create connection for each applicant
            const authorConnections = jobApplicants.map((applicant) => ({
              id: applicant.id,
              jobId: job.id,
              jobTitle: job.title,
              userId: applicant.applicant_id,
              userType: "applicant" as const,
            }));
            allConnections = [...allConnections, ...authorConnections];
          }
        }
      }

      setConnections(allConnections);
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setLoading(false);
    }
  };
  return { connections, loading };
};

export default function Inbox() {
  const { user } = useUser();
  const { connections, loading } = UserDisplay();
  const [selectedConnection, setSelectedConnection] =
    useState<Connection | null>(null);

  return (
    <main className="min-h-screen flex flex-col itemscenter">
      <Navbar currentPage="inbox" />
      <div className="flex md:flex-row flex-grow w-full max-w-5xl mx-auto px-4 gap-4 overflow-hidden py-8">
        <div className="w-full max-w-80 flex flex-col gap-4">
          <div className="flex flex-col border rounded-lg flex-grow overflow-auto">
            {/* map connections */}
            {loading ? (
              <p>loading connections</p>
            ) : connections.length > 0 ? (
              connections.map((connection) => (
                <div
                  key={connection.id}
                  className="p-4 border border-t-0 border-b-1 border-x-0 cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedConnection(connection)}
                >
                  <h3 className="font-medium">{connection.jobTitle}</h3>
                  <p className="text-sm text-gray-500">
                    {connection.userType === "applicant"
                      ? "Applicant"
                      : "Job Author"}
                  </p>
                  <p>{connection.userId}</p>
                </div>
              ))
            ) : (
              <p>You have no connections yet.</p>
            )}
          </div>
        </div>
        <div className="flex-grow flex items-start justify-center w-full">
          <div className="flex flex-col p-0 border rounded-lg w-full h-full overflow-auto">
            <div className="border border-t-0 border-b-1 border-x-0 p-3 text-sm text-gray-900">
              {selectedConnection?.jobTitle} | {selectedConnection?.userId}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
