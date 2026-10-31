import { Link } from "react-router-dom";

export default function About() {
    return (
        <div className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl">
            {/* Header Hero */}
            <div className="text-center space-y-4 mb-12">
                <span className="badge badge-primary badge-lg uppercase tracking-wider font-semibold">
                    About CourseMaster
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                    Empowering Next-Generation Tech Leaders
                </h1>
                <p className="text-base sm:text-lg text-base-content/80 max-w-2xl mx-auto leading-relaxed">
                    CourseMaster is a modern learning platform built for ambitious software engineers and tech creators. We deliver industry-standard, project-driven education to accelerate your career.
                </p>
            </div>

            {/* Core Values / Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="card bg-base-100 shadow-md border border-base-200 hover:shadow-xl transition-shadow">
                    <div className="card-body">
                        <div className="text-4xl mb-2">🚀</div>
                        <h3 className="card-title text-xl font-bold">Practical Learning</h3>
                        <p className="text-sm text-base-content/70">
                            Learn by building real-world production systems with modern tech stacks, comprehensive code reviews, and automated assessments.
                        </p>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-md border border-base-200 hover:shadow-xl transition-shadow">
                    <div className="card-body">
                        <div className="text-4xl mb-2">🎯</div>
                        <h3 className="card-title text-xl font-bold">Industry Mentorship</h3>
                        <p className="text-sm text-base-content/70">
                            Direct guidance from experienced software architects, live Q&A sessions, and personalized feedback on all your milestone assignments.
                        </p>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-md border border-base-200 hover:shadow-xl transition-shadow">
                    <div className="card-body">
                        <div className="text-4xl mb-2">🌐</div>
                        <h3 className="card-title text-xl font-bold">Global Community</h3>
                        <p className="text-sm text-base-content/70">
                            Join an active network of thousands of learners, collaborate on open-source projects, and prepare for high-impact software careers.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission Statement */}
            <div className="card bg-gradient-to-r from-primary/10 via-base-200 to-secondary/10 border border-primary/20 p-6 sm:p-10 rounded-2xl mb-12 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-base sm:text-lg text-base-content/80 max-w-3xl mx-auto leading-relaxed">
                    To bridge the gap between academic theory and industry engineering standards. Every student deserves access to high-quality mentorship, disciplined code evaluation, and a supportive path to professional mastery.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                    <Link to="/courses" className="btn btn-primary">
                        Explore Courses
                    </Link>
                    <Link to="/register" className="btn btn-outline">
                        Join CourseMaster
                    </Link>
                </div>
            </div>
        </div>
    );
}
