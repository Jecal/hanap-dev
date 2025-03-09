"use client";
import React from "react";
import { useState, useEffect, useRef, type ChangeEvent } from "react";

// built components
import Navbar from "../components/navbar";

// external components
import { supabase } from "@/utils/supabase";
import { Bookmark, ExternalLink, X } from "lucide-react";
import { v4 as idgen } from "uuid";

// type clerk shi
import { useAuth, useOrganization, useUser } from "@clerk/nextjs";
import Image from "next/image";

// learn what an interface does dood
interface Job {
  id: number;
  title: string;
  company: string;
  pay: number;
  min_age: number;
  logo_url: string;
  user_id: string;
}

// modal form stufffff
const PostingForm = ({
  closeModal,
  refreshJobs,
  userId,
}: {
  closeModal: () => void;
  refreshJobs: () => void;
  userId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    pay: 0,
    min_age: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "pay" || id === "min_age") {
      setFormData({
        ...formData,
        [id]: value === "" ? 0 : parseInt(value),
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const logoUrl =
        "https://riurrnlnfnpdkeiagtxf.supabase.co/storage/v1/object/public/logos/placeholder-logo.png";

      const { error } = await supabase.from("jobs").insert([
        {
          title: formData.title,
          company: formData.company,
          pay: formData.pay,
          min_age: formData.min_age,
          logo_url: logoUrl,
          user_id: userId,
        },
      ]);

      if (error) throw error;

      refreshJobs();
      closeModal();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "error occured when posting gg"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-lg max-w-lg w-full m-4 p-4"
      >
        <div className="mt-2">
          <label htmlFor="title" className="block text-md text-gray-700">
            Job Title
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            required
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="my-4">
          <label htmlFor="company" className="block text-md text-gray-700">
            Company Name
          </label>
          <input
            id="company"
            type="text"
            value={formData.company}
            required
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="my-4 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="pay" className="block text-md text-gray-700">
              Hourly Wage
            </label>
            <input
              id="pay"
              type="number"
              value={formData.pay || ""}
              required
              min="5"
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === ".") {
                  e.preventDefault();
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="min_age" className="block text-md text-gray-700">
              Minimum Age
            </label>
            <input
              id="min_age"
              type="number"
              value={formData.min_age || ""}
              required
              min="0"
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === ".") {
                  e.preventDefault();
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="w-full flex flex-row justify-end">
          <button
            type="submit"
            disabled={loading}
            className="p-2 mt-4 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </>
  );
};

// delete postinggggggg
// Add this component definition above the default function (outside of Jobs)
const DeleteButton = ({
  job,
  onDelete,
}: {
  job: Job;
  onDelete: () => void;
}) => {
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      try {
        const { error } = await supabase.from("jobs").delete().eq("id", job.id);

        if (error) throw error;

        // Call the onDelete callback to refresh jobs
        onDelete();
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete job posting");
      }
    }
  };

  return (
    <div className="md:col-span-2 mt-2">
      <button
        onClick={handleDelete}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors"
      >
        Delete Job Posting
      </button>
    </div>
  );
};

export default function Jobs() {
  // loading state based stuff (use this for later for loading screen stuff I THINK?)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // modal settings and i need an open and close cus we got seperate buttons BRUH
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // supabase job fetching + display
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  async function fetchJobs() {
    try {
      const { data, error } = await supabase.from("jobs").select("*");
      if (error) throw error;
      setJobs(data as Job[]);
      if (data.length > 0) setSelectedJob(data[0]);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  // clerk auth stuff to test
  // 9:17 PM 2/11/25 - THESE TWO LINES ACTUALLY WORK LOL; WE CAN CHECK STATUS VIA THIS; MAKE SURE TO ADD THE ROLE IN PUBLIC METADATA OF THE USER!!!
  // 9:22 PM 2/12/25 - role is now added automatically when a new user signs up BOOM
  const { user } = useUser();
  const hasCompRole = user?.publicMetadata?.role === "comp";
  const isAuthor = user?.id === selectedJob?.user_id;

  return (
    <main className="min-h-screen flex flex-col itemscenter">
      <Navbar currentPage="jobs" />
      <div className="flex md:flex-row pt-8 w-full max-w-5xl mx-auto px-4 gap-8">
        {/* left sidebar */}
        <div className="w-full max-w-80 flex flex-col gap-4">
          {hasCompRole && (
            <>
              <button
                onClick={openModal}
                className="bg-emerald-100 hover:bg-emerald-200 border border-emerald-200 hover:border-emerald-300 text-emerald-600 hover:text-emerald-700 rounded-lg p-4 transition-colors itemscenter "
              >
                Create a posting
              </button>
            </>
          )}
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedJob?.id === job.id
                  ? "border-gray-400 bg-gray-100"
                  : "hover:border-gray-400"
              }`}
              onClick={() => setSelectedJob(job)}
            >
              <Image
                src={job.logo_url}
                width={48}
                height={48}
                alt="company logo"
                className="rounded-md"
              />
              <div className="flex flex-col">
                <h3 className="font-medium text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.company}</p>
              </div>
            </div>
          ))}
        </div>

        {/* main nav */}
        {selectedJob && (
          <div className="flex-grow flex items-start justify-center w-full">
            <div className="w-full max-w-2xl bg-white rounded-lg">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-row gap-4 items-start">
                    <Image
                      width={60}
                      height={60}
                      className="rounded-lg shrink-0 object-cover"
                      src={selectedJob.logo_url}
                      alt="company logo"
                    />
                    <div className="flex flex-col">
                      <h1 className="text-2xl font-bold">
                        {selectedJob.title}
                      </h1>
                      <h2 className="text-lg text-gray-600">
                        {selectedJob.company}
                      </h2>
                    </div>
                  </div>
                  {/* <button className="text-gray-400 hover:text-gray-600"><Bookmark size={30} /></button> */}
                </div>
                {/* Details Section */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Details</h3>
                  {/* Original Posting Link */}
                  <a
                    href="#"
                    className="block w-full bg-[#FFF3BF] text-black px-4 py-3 rounded-lg mb-4 hover:bg-[#FFE69C] transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span>read original opsting here</span>
                      <span className="text-gray-400">
                        <ExternalLink size={24} />
                      </span>
                    </div>
                  </a>
                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-center">
                      <span className="text-center font-medium">
                        ${selectedJob.pay}/hr
                      </span>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-center">
                      <span className="text-center font-medium">
                        {selectedJob.min_age}+
                      </span>
                    </div>
                  </div>
                  {isAuthor && (
                    <DeleteButton
                      job={selectedJob}
                      onDelete={() => {
                        fetchJobs();
                        setSelectedJob(null);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* modals */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-15 flex items-center justify-center z-50">
            <div className="relative max-w-xl">
              <button
                onClick={closeModal}
                className="absolute -top-4 -right-4 z-10"
              >
                <X size={30} className="bg-red-400 rounded-lg p-2 text-white" />
              </button>
              <PostingForm
                closeModal={closeModal}
                refreshJobs={fetchJobs}
                userId={user?.id || ""}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
