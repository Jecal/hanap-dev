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
}

// const ModalHandler = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // form input handling
//   const [title, setTitle] = useState("");
//   const [company, setCompany] = useState("");
//   const [pay, setPay] = useState(0);
//   const [age, setAge] = useState(0);
//   // const [logoUrl, setLogoUrl] = useState("");
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

//   const PreviewComponent = () => {
//     const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
//       try {
//         const file = event.target.files?.[0];
//         setError(null);
//         if (file) {
//           if (allowedTypes.includes(file.type)) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//               setPreviewUrl(reader.result as string);
//             };
//             reader.readAsDataURL(file);
//           } else {
//             setError("Please upload a JPG or PNG file.");
//             setPreviewUrl(null);
//           }
//         }
//       } catch (error) {
//         setError(error instanceof Error ? error.message : "An error occurred");
//       }
//     };

//     const handleUploadClick = () => {
//       fileInputRef.current?.click();
//     };

//     return (
//       // returns just the image upload button and preview
//       <div className="w-full">
//         <div className="flex flex-col items-center w-full gap-y-2">
//           <button
//             type="button"
//             onClick={handleUploadClick}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//           >
//             Upload Logo
//           </button>

//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleFileChange}
//             accept=".jpg,.jpeg,.png"
//             className="hidden"
//           />
//           {previewUrl ? (
//             <div className="w-36 h-36 border border-gray-300 rounded-md overflow-hidden">
//               <img
//                 src={previewUrl || "/placeholder.svg"}
//                 alt="Company logo preview"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           ) : (
//             <div className="w-36 h-36 border border-gray-300 rounded-md flex items-center justify-center text-gray-400">
//               No logo
//             </div>
//           )}
//         </div>
//         {error && <p className="text-red-500">{error}</p>}
//       </div>
//     );
//   };

//   const jobPost = async (e: React.FormEvent) => {
//     // e.preventDefault();
//     // setLoading(true);
//     // setError(null);
//     // let logoUrl = null;

//     // try {
//     //   // handle image if preview exists
//     //   {
//     //     /* if (previewUrl) {
//     //     const file = fileInputRef.current?.files?.[0];
//     //     if (file) {
//     //       const fileExt = file.name.split(".").pop();
//     //       const fileName = `${idgen()}.${fileExt}`;
//     //       const { error: uploadError, data } = await supabase.storage
//     //         .from("logos")
//     //         .upload(fileName, file);
//     //       if (uploadError) throw uploadError;

//     //       const {
//     //         data: { publicUrl },
//     //       } = supabase.storage.from("logos").getPublicUrl(fileName);
//     //       logoUrl = publicUrl;
//     //     }
//     //   } */
//     //   }
//     //   // now we can push ⚡️ the data to the table
//     //   const { error } = await supabase
//     //     .from("jobs")
//     //     .insert([{ title, company, pay, age }]);
//     //   if (error) throw error;
//     // } catch (error) {
//     //   setError(
//     //     error instanceof Error
//     //       ? error.message
//     //       : "error occured and no specific message we are cooked lol"
//     //   );
//     // }
//     e.preventDefault();

//     try {
//       const { data, error } = await supabase
//         .from("jobs")
//         .insert([{ title, company, pay, age }])
//         .select();
//     } catch (error) {
//       console.error("Error posting job:", error);
//     }

//     return (
//       <>
//         <form
//           onSubmit={jobPost}
//           className="relative bg-white rounded-lg max-w-lg w-full m-4 p-4"
//         >
//           <div className="mt-2">
//             <label htmlFor="title" className="block text-md text-gray-700">
//               Job Title
//             </label>
//             <input
//               id="title"
//               type="text"
//               value={title}
//               required
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focusing:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <div className="my-4">
//             <label htmlFor="company" className="block text-md text-gray-700">
//               Company Name
//             </label>
//             <input
//               id="company"
//               type="text"
//               value={company}
//               required
//               onChange={(e) => setCompany(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focusing:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <div className="my-4">
//             <div className="flex flex-row gap-4">
//               <div className="flex flex-col gap-8 w-full">
//                 <div className="w-full">
//                   <label htmlFor="pay" className="block text-md text-gray-700">
//                     Hourly Wage
//                   </label>
//                   <input
//                     id="pay"
//                     type="number"
//                     value={pay}
//                     required
//                     min="5"
//                     onChange={(e) => {
//                       const value =
//                         e.target.value === "" ? 0 : parseInt(e.target.value);
//                       setPay(value);
//                     }}
//                     onKeyDown={(e) => {
//                       if (e.key === ".") {
//                         e.preventDefault();
//                       }
//                     }}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focusing:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//                 <div className="w-full">
//                   <label htmlFor="age" className="block text-md text-gray-700">
//                     Minimum Age
//                   </label>
//                   <input
//                     id="pay"
//                     type="number"
//                     value={age}
//                     required
//                     min="0"
//                     onChange={(e) => {
//                       const value =
//                         e.target.value === "" ? 0 : parseInt(e.target.value);
//                       setAge(value);
//                     }}
//                     onKeyDown={(e) => {
//                       if (e.key === ".") {
//                         e.preventDefault();
//                       }
//                     }}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focusing:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//               </div>
//               <>{/* <PreviewComponent /> */}</>
//             </div>
//           </div>
//           <div className="w-full flex flex-row justify-end">
//             <button
//               type="submit"
//               className="p-2 mt-4 rounded-md bg-green-500 text-white"
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </>
//     );
//   };
// };

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
              {/* <ModalHandler /> */}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
