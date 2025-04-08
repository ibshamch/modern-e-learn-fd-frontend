"use client";

import { useRouter } from "next/navigation";

export default function LessonView({ params }) {
  const router = useRouter();

  // Extract videoId from params.url
  const { url } = params;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Back Button */}
      <button
        onClick={() => router.push("/courses")}
        className="px-4 py-2 mb-4 text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        ← Back to Courses
      </button>

      {/* YouTube Video Player */}
      <div className="w-full max-w-3xl">
        <iframe
          width="100%"
          height="500"
          src={`https://www.youtube.com/embed/${url}`}
          title="Lesson Video"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
