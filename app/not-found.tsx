import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f5f7]">
      <div className="text-center">
        <p
          className="text-8xl font-bold text-gray-200 leading-none"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          404
        </p>
        <h1 className="text-xl font-semibold text-gray-700 mt-4">Page not found</h1>
        <p className="text-sm text-gray-400 mt-2">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
