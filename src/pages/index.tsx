import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>
          Migram.org - Empowering New Australians, One Task at a Time
        </title>
      </Head>
      {/* Header Section */}
      <section className="relative h-screen max-h-[800px] flex items-center justify-center py-12 px-4 bg-white">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold mb-4">
            Empowering New Australians
          </h1>
          <p className="text-2xl mb-8">
            Unlock Opportunities for Refugees and Migrants
          </p>

          <a href="/sign-up">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Join The Team 🦘
            </button>
          </a>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-gray-100 py-12 px-4 md:py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-8">Migram.org</h2>
          <p className="text-lg mb-8">
            Migram.org is a platform designed to empower refugees and migrants
            in Australia by providing them with job opportunities. Here’s why
            you should join our community:
          </p>
          <div className="flex flex-wrap justify-center">
            <div className="w-full md:w-1/3 p-4">
              <h3 className="text-xl font-bold mb-4">Community</h3>
              <p>
                Connect with a network of peers and employers who appreciate
                your unique skills and experiences.
              </p>
            </div>
            <div className="w-full md:w-1/3 p-4">
              <h3 className="text-xl font-bold mb-4">Flexibility</h3>
              <p>
                Choose from a variety of jobs and tasks that fit your skills and
                schedule.
              </p>
            </div>
            <div className="w-full md:w-1/3 p-4">
              <h3 className="text-xl font-bold mb-4">Support</h3>
              <p>
                Our dedicated support team is always available to assist you
                with any questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="bg-white py-12 px-4 md:py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-8">How It Works</h2>
          <div className="flex flex-wrap justify-center">
            <div className="w-full md:w-1/4 p-4">
              <div className="text-center">
                {/* Replace with an actual icon or image */}
                <div className="mb-4">
                  <i className="fas fa-user-plus text-4xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">Sign Up</h3>
                <p>
                  Create a free account to get started. It's quick and easy!
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/4 p-4">
              <div className="text-center">
                {/* Replace with an actual icon or image */}
                <div className="mb-4">
                  <i className="fas fa-search text-4xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">Browse Jobs</h3>
                <p>
                  Explore a variety of jobs that suit your skills and interests.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/4 p-4">
              <div className="text-center">
                {/* Replace with an actual icon or image */}
                <div className="mb-4">
                  <i className="fas fa-paper-plane text-4xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">Apply</h3>
                <p>Apply for jobs with a single click. No hassle!</p>
              </div>
            </div>
            <div className="w-full md:w-1/4 p-4">
              <div className="text-center">
                {/* Replace with an actual icon or image */}
                <div className="mb-4">
                  <i className="fas fa-thumbs-up text-4xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">Get Hired</h3>
                <p>
                  Receive offers and start your journey with your new employer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="bg-gray-100 py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-8">
            Our Collaboration Partners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Illawarra Multicultural Services */}
            <div className="text-left">
              <h3 className="text-xl font-bold mb-4">
                Illawarra Multicultural Services (IMS)
              </h3>
              <p className="mb-4">
                Located in Wollongong, IMS has been supporting the culturally &
                linguistically diverse (CALD) population since August 1980. They
                focus on migrants, humanitarian entrants, and refugees in the
                Illawarra and Shoalhaven regions.
              </p>
              <p>
                <a
                  href="https://www.facebook.com/IMSpage"
                  className="text-blue-600 hover:underline"
                >
                  Visit their Facebook page
                </a>{" "}
                or{" "}
                <a
                  href="https://www.instagram.com/IMS_insta"
                  className="text-blue-600 hover:underline"
                >
                  Instagram
                </a>{" "}
                for more information.
              </p>
            </div>

            {/* Code.Sydney */}
            <div className="text-left">
              <h3 className="text-xl font-bold mb-4">Code.Sydney</h3>
              <p className="mb-4">
                Code.Sydney connects new developers with non-profits and
                charities to gain real-world experience. Their mission aligns
                perfectly with ours, providing countless opportunities for
                individuals to grow and contribute to society.
              </p>
              <p>
                <a
                  href="https://www.code.sydney/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Visit Code.Sydney's website
                </a>{" "}
                for more information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/4 mb-8 md:mb-0">
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p>
                We aim to create a welcoming community that facilitates job
                opportunities for everyone, including refugees and migrants.
              </p>
            </div>
            {/* <div className="w-full md:w-1/4 mb-8 md:mb-0">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul>
                <li>
                  <a href="#how-it-works" className="text-sm hover:underline">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-sm hover:underline">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-sm hover:underline">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div> */}
            <div className="w-full md:w-1/4">
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p>
                Email: <a href="mailto:dev@migram.org">dev@migram.org</a>
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm">
              &copy; 2023 Migram.org. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
